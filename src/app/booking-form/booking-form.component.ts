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
import { TranslateService } from '@ngx-translate/core';

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
    this.bookingForm.get('order').get('dateFrom').setValue(date, { emitEvent: false });
  }

  public set toDate(date: NgbDate) {
    this.bookingForm.get('order').get('dateTo').setValue(date, { emitEvent: false });
  }

  constructor(
    public searchService: SearchService,
    private fb: FormBuilder,
    private api: ApiService,
    private loadingService: LoadingService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    this.bookingForm = this.fb.group({
      user: this.fb.group({
        name: [null, Validators.required],
        surname: [null, Validators.required],
        middlename: null,
        email: [null, Validators.required],
        phone: null,
      }),
      order: this.fb.group({
        dateTo: [null, Validators.required],
        dateFrom: [null, Validators.required],
        placeTo: [null, Validators.required],
        placeFrom: [null, Validators.required],
        timeTo: ['12:00', Validators.required],
        timeFrom: ['12:00', Validators.required],
        carId: null,
        sum: null,
      }),
    });

    this.bookingForm.get('order').valueChanges.subscribe((value) => {
      const from = NgbDate.from(value.dateFrom);
      if (from.after(this.toDate)) {
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
      this.loadingService.removeSubscription(subscription);
    });

    this.loadingService.addSubscription(subscription);

    if (this.searchService.model) {
      orderForm.patchValue(
        {
          ...this.searchService.model,
          placeFrom: this.searchService.model.placeFrom ? this.searchService.model.placeFrom.id : null,
          placeTo: this.searchService.model.placeTo ? this.searchService.model.placeTo.id : null,
        },
        { emitEvent: false }
      );
      this.searchService.periodDays = SearchService.setPeriodDays(orderForm.getRawValue());
    }
  }

  enter() {
    this.auth.redirectUrl = ['booking', this.car.id];
    this.router.navigate([this.translate.currentLang, 'enter']);
  }

  addOrder() {
    this.submitted = true;
    const orderForm = this.bookingForm.get('order') as FormGroup;
    const userForm = this.bookingForm.get('user') as FormGroup;
    if (this.bookingForm.invalid) {
      if (orderForm.invalid) {
        for (const control of Object.values(orderForm.controls)) {
          if (control.invalid) {
            control.markAsDirty();
          }
        }
      }
      if (userForm.invalid) {
        for (const control of Object.values(userForm.controls)) {
          if (control.invalid) {
            control.markAsDirty();
          }
        }
      }
      return;
    }

    const { order: orderFormValue, user } = this.bookingForm.getRawValue();
    const order: Order = {
      user: {
        name: user.name,
        surname: user.surname,
        middlename: user.middlename,
        phone: user.phone,
        email: user.email,
      },
      carId: this.car.id,
      car: this.car,
      placeFromId: orderFormValue.placeFrom,
      placeToId: orderFormValue.placeTo,
      dateFrom: orderFormValue.dateFrom,
      dateTo: orderFormValue.dateTo,
      timeFrom: orderFormValue.timeFrom,
      timeTo: orderFormValue.timeTo,
      orderSum: this.searchService.getCarPrice(this.car),
      isCarFree: this.ifCarFree(NgbDate.from(orderFormValue.dateFrom), NgbDate.from(orderFormValue.dateTo)),
    };

    const subscription = this.api.addOrder(order, this.translate.currentLang).subscribe((v) => {
      this.loadingService.removeSubscription(subscription);
      this.router.navigate([this.translate.currentLang, 'profile']);
    });
    this.loadingService.addSubscription(subscription);
  }

  isDisabled = (date: NgbDate) => {
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

  ifCarFree(dateFrom: NgbDate, dateTo: NgbDate) {
    console.log(dateFrom)
    let date = dateFrom;
    do {
      if (this.isDisabled(date)) {
        return false;
      }
      date = this.searchService.calendar.getNext(date, 'd', 1);
    } while (!date.equals(dateTo));
    return true;
  }
}
