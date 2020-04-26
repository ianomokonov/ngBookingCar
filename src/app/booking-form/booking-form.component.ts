import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbTimeStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { error } from '@angular/compiler/src/util';
import { AuthService } from '../services/auth.service';
import { Place } from '../profile/profile-details/places/place/place.component';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'bk-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent implements OnInit {
  public car;
  public user;

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
    private route: ActivatedRoute
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
        period: [
          {
            fromDate: calendar.getToday(),
            toDate: calendar.getNext(calendar.getToday(), 'd', 10),
          },
        ],
        place: null,
        time: this.time,
        carId: null,
        sum: null,
      }),
    });
  }

  ngOnInit(): void {
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
        (this.bookingForm.get('user') as FormGroup).patchValue(this.user);
      }
    });

    if (this.searchService.model) {
      (this.bookingForm.get('order') as FormGroup).patchValue({
        ...this.searchService.model,
        place: this.searchService.model.place ? this.searchService.model.place.id : null,
      });
    }
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
