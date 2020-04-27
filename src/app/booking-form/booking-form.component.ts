import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbTimeStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService, SearchModel } from '../services/search.service';
import { Place } from '../models/place';
import { Order } from '../models/order';

@Component({
  selector: 'bk-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent implements OnInit {
  public car;
  public user;
  public periodDays: number = 1;

  hoveredDate: NgbDate | null = null;

  hourStep = 1;
  minuteStep = 30;
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };

  bookingForm: FormGroup;
  places: Place[];

  public get fromDate(): NgbDate {
    return this.bookingForm.get('order').get('period').value.fromDate;
  }

  public get toDate(): NgbDate | null {
    return this.bookingForm.get('order').get('period').value.toDate;
  }

  public set fromDate(date: NgbDate) {
    this.bookingForm.get('order').get('period').setValue({
      fromDate: date,
      toDate: this.toDate,
    });
  }

  public set toDate(date: NgbDate) {
    this.bookingForm.get('order').get('period').setValue({
      fromDate: this.fromDate,
      toDate: date,
    });
  }
  constructor(
    private searchService: SearchService,
    private fb: FormBuilder,
    calendar: NgbCalendar,
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
        period: null,
        place: null,
        time: null,
        carId: null,
        sum: null,
      }),
    });

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
    // console.log([fromDate, toDate])
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
    const requests = [this.api.getPlaces(), this.api.getCar(carId)];
    if (this.auth.getToken()) {
      requests.push(this.api.getUserInfo());
    }

    forkJoin(requests).subscribe(([places, car, userInfo]) => {
      this.places = places;
      this.car = car;
      if (userInfo) {
        this.user = userInfo;
        const userForm = this.bookingForm.get('user') as FormGroup;
        userForm.patchValue(this.user);
        userForm.disable();
      }
    });
    const orderForm = this.bookingForm.get('order') as FormGroup;
    if (this.searchService.model) {
      orderForm.patchValue(
        {
          ...this.searchService.model,
          place: this.searchService.model.place ? this.searchService.model.place.id : null,
        },
        { emitEvent: false }
      );
    } else {
      orderForm.patchValue(
        {
          ...this.searchService.defaultModel,
          place: this.searchService.defaultModel.place ? this.searchService.defaultModel.place.id : null,
        },
        { emitEvent: false }
      );
    }

    this.setPeriodDays(orderForm.getRawValue());
    
  }

  enter() {
    this.auth.redirectUrl = `/booking/${this.car.id}`;
    this.router.navigate(['/enter']);
  }

  addOrder(){
    const orderFormValue = (this.bookingForm.get('order') as FormGroup).getRawValue();
    const order: Order = {
      carId: this.car.id,
      placeId: orderFormValue.place,
      dateFrom: orderFormValue.period.fromDate,
      dateTo: orderFormValue.period.toDate,
      time: `${orderFormValue.time.hour}:${orderFormValue.time.minute}`,
      orderSum: this.car.price * this.periodDays
    }
    console.log(order)

    this.api.addOrder(order).subscribe(v => {
      console.log(v);
    })
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
