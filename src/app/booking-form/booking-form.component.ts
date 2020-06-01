import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbTimeStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { forkJoin, from } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService, SearchModel } from '../services/search.service';
import { Place } from '../models/place';
import { Order, DateRange } from '../models/order';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'bk-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent implements OnInit {
  public car;
  public user;
  public submitted;

  hoveredDate: NgbDate | null = null;

  hourStep = 1;
  minuteStep = 30;
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };

  bookingForm: FormGroup;
  places: Place[];
  carDates: DateRange[];

  maxDate: NgbDate;

  public get fromDate(): NgbDate {
    return this.bookingForm.value.order.dateFrom;
  }

  public get toDate(): NgbDate | null {
    return this.bookingForm.value.order.dateTo;
  }

  public set fromDate(date: NgbDate) {
    this.bookingForm.get('order').get('dateFrom').setValue(date, {emitEvent: false});
  }

  public set toDate(date: NgbDate) {
    this.bookingForm.get('order').get('dateTo').setValue(date, {emitEvent: false});
  }

  constructor(
    public searchService: SearchService,
    private fb: FormBuilder,
    private api: ApiService, private loadingService: LoadingService,
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
        dateTo: [null, Validators.required],
        dateFrom: [null, Validators.required],
        placeTo: [null, Validators.required],
        placeFrom: [null, Validators.required],
        timeTo: [null, Validators.required],
        timeFrom: [null, Validators.required],
        carId: null,
        sum: null,
      }),
    });

    this.bookingForm.get('order').valueChanges.subscribe((value) => {
      
      this.setMaxDate(value.dateFrom);
      const from = NgbDate.from(value.dateFrom);
      if(from.after(this.toDate)){
        this.toDate = from;
      }
      this.saveFilters(this.bookingForm.get('order').value);
    });
  }

  private saveFilters(formValue) {
    formValue.placeTo = this.places.find((p) => p.id == formValue.placeTo);
    formValue.placeFrom = this.places.find((p) => p.id == formValue.placeFrom);
    this.searchService.model = formValue;
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

    const subscription = forkJoin(requests).subscribe(([places, car, carDates, userInfo]) => {
      this.places = places;
      this.car = car;
      this.carDates = carDates;
      if (userInfo) {
        this.user = userInfo;
        const userForm = this.bookingForm.get('user') as FormGroup;
        userForm.patchValue(this.user);
        userForm.disable();
      }
      if (this.fromDate && !this.toDate) {
        this.setMaxDate(this.fromDate);
      }
      this.loadingService.removeSubscription(subscription);
    });

    this.loadingService.addSubscription(subscription);

    if (this.searchService.model) {
      orderForm.patchValue(
        {
          ...this.searchService.model,
          placeFrom: this.searchService.model.placeFrom ? this.searchService.model.placeFrom.id : null,
          placeTo: this.searchService.model.placeTo ? this.searchService.model.placeTo.id : null
        },
        { emitEvent: false }
      );
      this.searchService.periodDays = SearchService.setPeriodDays(orderForm.getRawValue());
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
    const orderFormValue = orderForm.getRawValue();
    const order: Order = {
      carId: this.car.id,
      placeFromId: orderFormValue.placeFrom,
      placeToId: orderFormValue.placeTo,
      dateFrom: orderFormValue.dateFrom,
      dateTo: orderFormValue.dateTo,
      timeFrom: orderFormValue.timeFrom,
      timeTo: orderFormValue.timeTo,
      orderSum: this.searchService.getCarPrice(this.car),
    };

    const subscription = this.api.addOrder(order).subscribe((v) => {
      this.loadingService.removeSubscription(subscription);
      this.router.navigate(['/profile']);
    });
    this.loadingService.addSubscription(subscription);
  }

  setMaxDate(fromDate: NgbDate) {
    if (!this.carDates || !fromDate) {
      this.maxDate = null;
      return;
    }
    const maxDate = this.carDates.filter((range: DateRange) => range.dateFrom.after(fromDate))[0];
    if (maxDate) {
      this.maxDate = maxDate.dateFrom;
    } else {
      this.maxDate = null;
    }
  }

  isDisabled = (date: NgbDate) => {
    if (date.before(this.searchService.minDate)) {
      return true;
    }
    if (date.after(this.maxDate)) {
      return true;
    }
    if (!this.carDates) {
      return false;
    }

    for (let range of this.carDates) {
      if (date.equals(range.dateFrom) || date.equals(range.dateTo)) {
        return true;
      }

      if (!range.dateTo) {
        continue;
      }

      if (date.after(range.dateFrom) && date.before(range.dateTo)) {
        return true;
      }
    }
    return false;
  };

  isFromDisabled = (date: NgbDate) => {
    if (date.before(this.searchService.minDate)) {
      return true;
    }
    if (!this.carDates) {
      return false;
    }

    for (let range of this.carDates) {
      if (date.equals(range.dateFrom) || date.equals(range.dateTo)) {
        return true;
      }

      if (!range.dateTo) {
        continue;
      }

      if (date.after(range.dateFrom) && date.before(range.dateTo)) {
        return true;
      }
    }
    return false;
  };
}
