import { NgbDate, NgbTimeStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { SliderSelected, SliderRange } from '../utils/double-slider/double-slider.component';
import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Place } from '../models/place';

@Injectable()
export class SearchService {
  private _model: SearchModel;

  private time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  public priceRange: SliderRange = { min: 1500, max: 8000 };
  public minDate: NgbDate;
  public weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  public months: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public pricesNames: string[] = ['oneDayPrice', 'twoDaysPrice', 'threeDaysPrice', 'fourDaysPrice', 'fiveDaysPrice', 'sixDaysPrice', 'sevenDaysPrice'];

  public defaultModel: SearchModel;

  public $filtersUpdate: BehaviorSubject<SearchModel>;

  public get model(): SearchModel {
    if (!this._model && sessionStorage.getItem('bookingSearchModel')) {
      this._model = JSON.parse(sessionStorage.getItem('bookingSearchModel'));
    }
    return this._model;
  }

  public set model(model: SearchModel) {
    this._model = model;
    if (model && !model.dateFrom && !model.timeFrom && !model.timeTo && !model.placeFrom && !model.placeTo) {
      this._model = null;
    }
    sessionStorage.setItem('bookingSearchModel', JSON.stringify(this._model));
    this.$filtersUpdate.next(this._model);
  }

  constructor(public calendar: NgbCalendar) {
    this._model = this.model;
    this.minDate = this.calendar.getNext(this.calendar.getToday(), 'd', 5);
    this.defaultModel = {
      dateFrom: this.minDate,
      dateTo: this.calendar.getNext(this.minDate, 'd', 10),
      placeFrom: null,
      placeTo: null,
      timeFrom: '12:00',
      timeTo: '12:00',
    };
    this.$filtersUpdate = new BehaviorSubject(this._model);
  }

  public initUpdate() {
    this.$filtersUpdate.next(this._model);
  }

  public static setPeriodDays(model: SearchModel) {
    if (!model) {
      return 1;
    }
    let { dateFrom, dateTo } = model;

    if (!dateTo) {
      return 1;
    }

    return (
      (new Date(dateTo.year, dateTo.month, dateTo.day).getTime() - new Date(dateFrom.year, dateFrom.month, dateFrom.day).getTime()) /
        (24 * 3600000) +
      1
    );
  }
}

export interface SearchModel {
  dateFrom: NgbDate;
  dateTo: NgbDate;
  timeFrom: string;
  timeTo: string;
  placeFrom: Place;
  placeTo: Place;
}
