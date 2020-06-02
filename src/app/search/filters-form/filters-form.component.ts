import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SliderRange } from 'src/app/utils/double-slider/double-slider.component';
import { ApiService } from 'src/app/services/api.service';
import { SearchService } from 'src/app/services/search.service';
import { debounceTime, takeWhile } from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { Place } from 'src/app/models/place';
import { LoadingService } from 'src/app/services/loading.service';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
  minDateTo: NgbDate;
  times: string[] = [];
  dates: { fromDate?; toDate? } = {};
  priceFormatValue = (value) => `₽ ${value}`;

  filterForm: FormGroup;
  places: Place[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private loadingService: LoadingService,
    public searchService: SearchService,
    private translate: TranslateService
  ) {
    this.filterForm = this.fb.group({
      dateFrom: null,
      dateTo: null,
      placeFrom: null,
      placeTo: null,
      timeFrom: null,
      timeTo: null,
    });

    this.filterForm.get('dateFrom').valueChanges.subscribe((date: NgbDate) => {
      date = NgbDate.from(date);
      this.setDate(new Date(date.year, date.month - 1, date.day));
      const dateTo = this.filterForm.get('dateTo');
      this.minDateTo = date;
      if (date.after(dateTo.value)) {
        dateTo.setValue(date);
      }
    });

    this.filterForm.get('dateTo').valueChanges.subscribe((date: NgbDate) => {
      this.setDate(new Date(date.year, date.month - 1, date.day), true);
    });
  }

  ngOnInit() {
    this.genTimes();

    if (this.searchService.model) {
      this.filterForm.patchValue({
        ...this.searchService.model,
        placeFrom: this.searchService.model.placeFrom ? this.searchService.model.placeFrom.id : null,
        placeTo: this.searchService.model.placeTo ? this.searchService.model.placeTo.id : null,
      });
    } else {
      this.filterForm.patchValue({
        ...this.searchService.defaultModel,
        placeFrom: this.searchService.defaultModel.placeFrom ? this.searchService.defaultModel.placeFrom.id : null,
        placeTo: this.searchService.defaultModel.placeTo ? this.searchService.defaultModel.placeTo.id : null,
      });
    }

    const subscription = forkJoin([this.api.getPlaces(), this.api.getPriceRange()]).subscribe(([places, range]) => {
      this.places = places;
      if (places[0]) {
        const value = this.filterForm.getRawValue();
        if (!value.placeFrom) {
          this.filterForm.patchValue({ placeFrom: places[0].id });
        }
        if (!value.placeTo) {
          this.filterForm.patchValue({ placeTo: places[0].id });
        }
      }
      this.priceRange = range;
      this.searchService.priceRange = range;
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  onSearchClick() {
    this.saveFilters();
    this.router.navigate([this.translate.currentLang, 'catalog']);
  }

  private saveFilters() {
    const formValue = this.filterForm.getRawValue();
    formValue.placeFrom = this.places.find((p) => p.id == formValue.placeFrom);
    formValue.placeTo = this.places.find((p) => p.id == formValue.placeTo);
    this.searchService.model = formValue;
  }

  private genTimes() {
    for (let i = 0; i < 24; i++) {
      this.times.push(`${i < 10 ? `0${i}` : i}:00`);
      this.times.push(`${i < 10 ? `0${i}` : i}:30`);
    }
  }

  setDate(date: Date, toDate = false) {
    if (!toDate) {
      this.dates.fromDate = {
        weekDay: this.searchService.weekDays[date.getDay()],
        day: date.getDate(),
        month: this.searchService.months[date.getMonth()],
        year: date.getFullYear(),
      };
      return;
    }
    this.dates.toDate = {
      weekDay: this.searchService.weekDays[date.getDay()],
      day: date.getDate(),
      month: this.searchService.months[date.getMonth()],
      year: date.getFullYear(),
    };
  }

  isDisabled(date: NgbDate) {
    return date.before(this.searchService.minDate);
  }
}
