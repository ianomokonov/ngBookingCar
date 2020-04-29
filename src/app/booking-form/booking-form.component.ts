import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbTimeStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService, SearchModel } from '../services/search.service';
import { Place } from '../models/place';
import { Order, DateRange } from '../models/order';

@Component({
  selector: 'bk-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent implements OnInit {
  public car;
  public user;
  public periodDays: number = 1;
  public submitted;

  hoveredDate: NgbDate | null = null;

  hourStep = 1;
  minuteStep = 30;
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };

  bookingForm: FormGroup;
  period: FormControl;
  places: Place[];
  carDates: DateRange[];

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

  maxDate: NgbDate;

  constructor(
    public searchService: SearchService,
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      user: this.fb.group({
        name: null,
        surname: null,
        middlename: null,
        email: null,
        phone: null,
      }),
      order: this.fb.group({
        period: [{
          fromDate: null,
          toDate: null
        }, [Validators.required]],
        place: [null],
        time: null,
        carId: null,
        sum: null,
      }),
    });
    this.period = this.bookingForm.get('order').get('period') as FormControl;
    this.bookingForm.get('order').get('time').setValue(this.searchService.defaultModel.time);

    this.bookingForm.get('order').valueChanges.subscribe((value) => {
      this.saveFilters(value);
      this.setPeriodDays(value);
    });
  }

  private saveFilters(formValue) {
    formValue.place = this.places.find((p) => p.id == formValue.place);
    this.searchService.model = formValue;
  }

  private setPeriodDays({ period: { fromDate, toDate } }: SearchModel) {
    if (!toDate) {
      this.periodDays = 1;
      return;
    }

    this.periodDays =
      (new Date(toDate.year, toDate.month, toDate.day).getTime() - new Date(fromDate.year, fromDate.month, fromDate.day).getTime()) /
        (24 * 3600000) +
      1;
  }

  ngOnInit(): void {
    this.auth.setDefaultUrl();
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.initData(params.id);
      }
    });
  }

  initData(carId) {
    const requests = [this.api.getPlaces(), this.api.getCar(carId), this.api.getCarDates(carId)];
    if (this.auth.getToken()) {
      requests.push(this.api.getUserInfo());
    }
    const orderForm = this.bookingForm.get('order') as FormGroup;

    forkJoin(requests).subscribe(([places, car, carDates, userInfo]) => {
      this.places = places;
      if(this.places && this.places.length){
        orderForm.get('place').setValidators(Validators.required);
      }
      this.car = car;
      this.carDates = carDates;
      if (userInfo) {
        this.user = userInfo;
        const userForm = this.bookingForm.get('user') as FormGroup;
        userForm.patchValue(this.user);
        userForm.disable();
      }
      if(this.fromDate && !this.toDate){
        this.setMaxDate(this.fromDate);
      }
    });
    
    
    if (this.searchService.model) {
      orderForm.patchValue(
        {
          ...this.searchService.model,
          place: this.searchService.model.place ? this.searchService.model.place.id : null,
        },
        { emitEvent: false }
      );
      this.setPeriodDays(orderForm.getRawValue());
    }
    
  }

  enter() {
    this.auth.redirectUrl = `/booking/${this.car.id}`;
    this.router.navigate(['/enter']);
  }

  addOrder() {
    this.submitted = true;
    const orderForm = this.bookingForm.get('order') as FormGroup;
    if (orderForm.invalid) {
      for (const control of Object.values(orderForm.controls)) {
        if (control.invalid) {
          control.markAsDirty();
        }
      }
      return;
    }
    if(!this.period.value.fromDate){
      this.bookingForm.markAsDirty();
      return;
    }
    const orderFormValue = orderForm.getRawValue();
    const order: Order = {
      carId: this.car.id,
      placeId: orderFormValue.place,
      dateFrom: orderFormValue.period.fromDate,
      dateTo: orderFormValue.period.toDate,
      time: orderFormValue.time,
      orderSum: this.car.price * this.periodDays,
    };

    this.api.addOrder(order).subscribe((v) => {
      this.router.navigate(['/profile']);
    });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.setMaxDate(date);
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.maxDate = null;
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.setMaxDate(date);
    }
  }

  setMaxDate(fromDate: NgbDate){
    if(!this.carDates){
      this.maxDate = null;
      return;
    }
    const maxDate = this.carDates.filter((range: DateRange) => range.dateFrom.after(fromDate))[0];
    if(maxDate){
      this.maxDate = maxDate.dateFrom;
    } else {
      this.maxDate = null;
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

  isDisabled = (date: NgbDate) => {
    if (date.before(this.searchService.minDate)) {
      return true;
    }
    if (date.after(this.maxDate)) {
      return true;
    }
    if(!this.carDates){
      return false;
    }
    
    for(let range of this.carDates){
      if(date.equals(range.dateFrom) || date.equals(range.dateTo)){
        return true;
      }

      if(!range.dateTo){
        continue;
      }

      if(date.after(range.dateFrom) && date.before(range.dateTo)){
        return true;
      }
    }
    return false;
  }
}
