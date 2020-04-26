import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SliderRange } from 'src/app/utils/double-slider/double-slider.component';
import { Place } from 'src/app/profile/profile-details/places/place/place.component';
import { ApiService } from 'src/app/services/api.service';
import { SearchService } from 'src/app/services/search.service';
import { debounceTime } from 'rxjs/internal/operators';

@Component({
  selector: 'bk-filters-form',
  templateUrl: './filters-form.component.html',
  styleUrls: ['./filters-form.component.scss'],
})
export class FiltersFormComponent implements OnInit {
  hoveredDate: NgbDate | null = null;

  hourStep = 1;
  minuteStep = 30;
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  priceRange: SliderRange = { min: 1500, max: 8000 };
  priceFormatValue = (value) => `₽ ${value}`;

  filterForm: FormGroup;
  places: Place[];

  public get fromDate(): NgbDate {
    return this.filterForm.get('period').value.fromDate;
  }

  public get toDate(): NgbDate | null {
    return this.filterForm.get('period').value.toDate;
  }

  public set fromDate(date: NgbDate) {
    this.filterForm.get('period').setValue({
      fromDate: date,
      toDate: this.toDate,
    });
  }

  public set toDate(date: NgbDate) {
    this.filterForm.get('period').setValue({
      fromDate: this.fromDate,
      toDate: date,
    });
  }

  constructor(private fb: FormBuilder, calendar: NgbCalendar, private api: ApiService, private searchService: SearchService) {
    this.filterForm = this.fb.group({
      period: {
        fromDate: calendar.getToday(),
        toDate: calendar.getNext(calendar.getToday(), 'd', 10),
      },
      place: null,
      time: this.time,
      price: { from: this.priceRange.min, to: this.priceRange.max },
    });
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const formValue = this.filterForm.getRawValue();
      formValue.place = this.places.find((p) => p.id == formValue.place);
      this.searchService.model = formValue;
    });
  }

  ngOnInit() {
    if (this.searchService.model) {
      const model = { ...this.searchService.model } as any;
      if (model.place) {
        model.place = model.place.id;
      }
      this.filterForm.patchValue(model, { emitEvent: false });
    }
    this.api.getPlaces().subscribe((places) => {
      this.places = places;
    });
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
}
