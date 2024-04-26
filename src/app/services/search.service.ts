import { NgbDate, NgbTimeStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { SliderSelected, SliderRange } from '../utils/double-slider/double-slider.component';
import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Place } from '../models/place';
import { Filter } from '../search/search-cars/search-cars.component';

@Injectable()
export class SearchService {
  private _model: SearchModel;
  public periodDays: number = 1;
  public isSummer: boolean = true;
  public priceRange: SliderRange = { min: 1500, max: 8000 };
  public summerMonths = ['05', '09'];
  public winterMonths = ['10', '04'];
  public minDate: NgbDate;
  public times: string[] = [];
  public weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  public months: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public pricesNames: string[] = [
    'oneDayPrice',
    'twoDaysPrice',
    'threeDaysPrice',
    'fourDaysPrice',
    'fiveDaysPrice',
    'sixDaysPrice',
    'sevenDaysPrice',
  ];

  public defaultModel: SearchModel;

  public $filtersUpdate: BehaviorSubject<SearchModel>;

  public get model(): SearchModel {
    if (!this._model && sessionStorage.getItem('bookingSearchModel')) {
      this.updateModel(JSON.parse(sessionStorage.getItem('bookingSearchModel')));
    }
    return this._model;
  }

  public set model(model: SearchModel) {
    this.updateModel(model);
    this.$filtersUpdate.next(this._model);
  }

  private updateModel(model: SearchModel) {
    this._model = model;
    if (model && !model.dateFrom && !model.timeFrom && !model.timeTo && !model.placeFrom && !model.placeTo) {
      this._model = null;
    }
    if (model && !model.dateFrom) {
      model.dateFrom = this.defaultModel.dateFrom;
    }
    if (model && !model.dateTo) {
      model.dateTo = model.dateFrom;
    }
    sessionStorage.setItem('bookingSearchModel', JSON.stringify(this._model));
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    if (model) {
      month = this.model.dateFrom.month;
      day = this.model.dateFrom.day;
    }

    if (month > 7 && month < 9) {
      this.isSummer = true;
    } else {
      if ((month === 7 && day > 14) || (month === 9 && day < 16)) {
        this.isSummer = true;
      } else {
        this.isSummer = false;
      }
    }
    this.periodDays = SearchService.setPeriodDays(model);
  }

  constructor(public calendar: NgbCalendar) {
    this.genTimes();
    this._model = this.model;
    this.minDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.defaultModel = {
      dateFrom: this.minDate,
      dateTo: this.calendar.getNext(this.minDate, 'd', 10),
      placeFrom: null,
      placeTo: null,
      timeFrom: '12:00',
      timeTo: '13:00',
    };
    this.$filtersUpdate = new BehaviorSubject(this._model);
  }

  public initUpdate() {
    this.$filtersUpdate.next(this._model);
  }

  private genTimes() {
    for (let i = 0; i < 24; i++) {
      this.times.push(`${i < 10 ? `0${i}` : i}:00`);
      this.times.push(`${i < 10 ? `0${i}` : i}:30`);
    }
  }

  public static setPeriodDays(model: SearchModel) {
    if (!model) {
      return 1;
    }
    let { dateFrom, dateTo, timeFrom, timeTo } = model;
    const timeFromArr = (timeFrom || '12:00').split(':').map((x) => +x);
    const timeToArr = (timeTo || '12:00').split(':').map((x) => +x);

    if (!dateTo) {
      return 1;
    }

    const toDateTime = new Date(dateTo.year, dateTo.month - 1, dateTo.day, timeToArr[0], timeToArr[1]);
    const fromDateTime = new Date(dateFrom.year, dateFrom.month - 1, dateFrom.day, timeFromArr[0] + 1, timeFromArr[1]);

    return Math.ceil((toDateTime.getTime() - fromDateTime.getTime()) / (24 * 3600000));
  }

  public getCarPrice({ summerPrice, winterPrice, summerPrices, winterPrices }, periodDays = this.periodDays) {
    let prices = null;
    let price = null;
    if (this.isSummer) {
      prices = summerPrices;
      price = summerPrice;
    } else {
      prices = winterPrices;
      price = winterPrice;
    }
    if (periodDays > 0 && periodDays < 8) {
      return prices[this.pricesNames[periodDays - 1]];
    }
    return price * periodDays;
  }
}

export class SearchModel {
  dateFrom: NgbDate;
  dateTo: NgbDate;
  timeFrom: string;
  timeTo: string;
  placeFrom: Place;
  placeTo: Place;
  filters?: Filter[];
}
