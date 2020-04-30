import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SliderRange } from 'src/app/utils/double-slider/double-slider.component';
import { ApiService } from 'src/app/services/api.service';
import { SearchService } from 'src/app/services/search.service';
import { debounceTime } from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { Place } from 'src/app/models/place';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'bk-filters-form',
  templateUrl: './filters-form.component.html',
  styleUrls: ['./filters-form.component.scss'],
})
export class FiltersFormComponent implements OnInit {
  hoveredDate: NgbDate | null = null;

  hourStep = 1;
  minuteStep = 30;
  priceRange: SliderRange;
  priceFormatValue = (value) => `₽ ${value}`;

  filterForm: FormGroup;
  places: Place[];

  period: FormControl;

  public get fromDate(): NgbDate {
    return this.period.value.fromDate;
  }

  public get toDate(): NgbDate | null {
    return this.period.value.toDate;
  }

  public set fromDate(date: NgbDate) {
    this.period.setValue({
      fromDate: date,
      toDate: this.toDate,
    });
  }

  public set toDate(date: NgbDate) {
    this.period.setValue({
      fromDate: this.fromDate,
      toDate: date,
    });
  }

  constructor(private fb: FormBuilder, private router: Router, private api: ApiService, private loadingService: LoadingService, public searchService: SearchService) {
    this.priceRange = this.searchService.priceRange;
    this.filterForm = this.fb.group({
      period: null,
      place: null,
      time: null,
      price: null,
    });
    this.period = this.filterForm.get('period') as FormControl;

    this.period.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.saveFilters();
    });
    this.filterForm.get('price').valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.saveFilters();
    });
  }

  ngOnInit() {
    if (this.searchService.model) {
      this.filterForm.patchValue({
        ...this.searchService.model,
        place: this.searchService.model.place ? this.searchService.model.place.id : null,
        price: this.searchService.model.price ? this.searchService.model.price : { from: this.priceRange.min, to: this.priceRange.max }
      });
    } else {
      this.filterForm.patchValue(
        {
          ...this.searchService.defaultModel,
          place: this.searchService.defaultModel.place ? this.searchService.defaultModel.place.id : null,
        },
        { emitEvent: false }
      );
    }

    const subscription = this.api.getPlaces().subscribe((places) => {
      this.places = places;
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  onSearchClick() {
    this.saveFilters();
    this.router.navigate(['/catalog']);
  }

  private saveFilters() {
    const formValue = this.filterForm.getRawValue();
    formValue.place = this.places.find((p) => p.id == formValue.place);
    this.searchService.model = formValue;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  isDisabled(date: NgbDate) {
    return date.before(this.searchService.minDate);
  }
}
