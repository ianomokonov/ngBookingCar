import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Place } from '../profile/profile-details/places/place/place.component';
import { SliderSelected } from '../utils/double-slider/double-slider.component';
import { Subject, BehaviorSubject } from 'rxjs';

export class SearchService {
    private _model: SearchModel;

    public $filtersUpdate: BehaviorSubject<SearchModel>;

    public get model(): SearchModel {
        if(!this._model && sessionStorage.getItem('bookingSearchModel')){
            this._model = JSON.parse(sessionStorage.getItem('bookingSearchModel'));
        }
        return this._model;
    }

    public set model(model: SearchModel) {
        this._model = model;
        sessionStorage.setItem('bookingSearchModel', JSON.stringify(this._model));
        this.$filtersUpdate.next(this._model);
    }

    constructor() {
        this._model = this.model;
        this.$filtersUpdate = new BehaviorSubject(this._model);
    }

    public initUpdate(){
        this.$filtersUpdate.next(this._model);
    }
}

export interface SearchModel {
    period: SearchPeriod;
    time: NgbTimeStruct;
    place: Place;
    price: SliderSelected;
}

export interface SearchPeriod {
    fromDate: NgbDate;
    toDate: NgbDate;
}