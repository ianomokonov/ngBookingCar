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
    if (
      model &&
      (!model.period || !model.period.fromDate) &&
      !model.time &&
      !model.place &&
      (!model.price || (!model.price.from && !model.price.to))
    ) {
      this._model = null;
    }
    sessionStorage.setItem('bookingSearchModel', JSON.stringify(this._model));
    this.$filtersUpdate.next(this._model);
  }

  constructor(private calendar: NgbCalendar) {
    this._model = this.model;
    this.minDate = this.calendar.getNext(this.calendar.getToday(), 'd', 5);
    this.defaultModel = {
      period: {
        fromDate: this.minDate,
        toDate: this.calendar.getNext(this.minDate, 'd', 10),
      },
      place: null,
      time: this.time,
      price: null,
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
    let {
      period: { fromDate, toDate },
    } = model;

    if (!toDate) {
      return 1;
    }

    return (
      (new Date(toDate.year, toDate.month, toDate.day).getTime() - new Date(fromDate.year, fromDate.month, fromDate.day).getTime()) /
        (24 * 3600000) +
      1
    );
  }
}

export interface SearchModel {
  period: SearchPeriod;
  time: NgbTimeStruct;
  place: Place;
  price?: SliderSelected;
}

export interface SearchPeriod {
  fromDate: NgbDate;
  toDate: NgbDate;
}
