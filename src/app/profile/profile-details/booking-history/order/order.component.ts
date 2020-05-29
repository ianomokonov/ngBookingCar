import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbTimeStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Order, OrderStatus, UpdateOrder, DateRange } from 'src/app/models/order';
import { SearchModel, SearchService } from 'src/app/services/search.service';
import { ApiService } from 'src/app/services/api.service';
import { takeWhile } from 'rxjs/internal/operators';
import { LoadingService } from 'src/app/services/loading.service';

// @Component({
//   selector: 'bk-order',
//   templateUrl: './order.component.html',
//   styleUrls: ['./order.component.scss'],
// })
export class OrderComponent implements OnInit {
  @Input() public set carOrder(order: Order) {
    this.order = order;
    if (this.order) {
      const style = this.statuses.find((s) => s.status == +this.order.status);
      if (style) {
        this.order.statusClass = style.statusClass;
        this.order.statusText = style.statusText;
      } else {
        this.order.statusClass = '';
        this.order.statusText = '';
      }

      const formValue = {
        period: {
          fromDate: this.order.dateFrom as NgbDate,
          toDate: this.order.dateTo as NgbDate,
        },
        // time: this.order.time as NgbTimeStruct,
        // place: this.order.placeId,
      };

      const fromDateNgb = this.order.dateFrom as NgbDate;

      this.minDate = this.calendar.getNext(this.today, 'd', 5);
      if (this.order.status != OrderStatus.Planned || fromDateNgb.before(this.minDate)) {
        this.disabled = true;
      }
      this.orderForm.patchValue(formValue);
      if (this.fromDate && !this.toDate) {
        this.setMaxDate(this.fromDate);
      }
    }
  }

  private _isAdmin: boolean;

  @Input() public disabled;
  @Input() public set isAdmin(isAdmin: boolean) {
    if (isAdmin) {
      this.disabled = false;
    }

    this._isAdmin = isAdmin;
  }
  public get isAdmin() {
    return this._isAdmin;
  }
  @Output() public orderUpdated: EventEmitter<number> = new EventEmitter();
  public order: Order;

  public isEditing;

  public minDate: NgbDate;
  public maxDate: NgbDate;
  public today: NgbDate;

  hoveredDate: NgbDate | null = null;

  hourStep = 1;
  minuteStep = 30;

  orderForm: FormGroup;
  @Input() public places = [];

  public get fromDate(): NgbDate {
    return this.orderForm.get('period').value.fromDate;
  }

  public get toDate(): NgbDate | null {
    return this.orderForm.get('period').value.toDate;
  }

  public set fromDate(date: NgbDate) {
    this.orderForm.get('period').setValue({
      fromDate: date,
      toDate: this.toDate,
    });
  }

  public set toDate(date: NgbDate) {
    this.orderForm.get('period').setValue({
      fromDate: this.fromDate,
      toDate: date,
    });
  }

  private rxAlive: boolean = true;
  public orderStatus = OrderStatus;
  constructor(private fb: FormBuilder, private calendar: NgbCalendar, public api: ApiService, private loadingService: LoadingService) {
    this.orderForm = this.fb.group({
      period: [null, Validators.required],
      place: [null],
      time: [null, Validators.required],
    });

    this.orderForm.valueChanges.pipe(takeWhile(() => this.rxAlive)).subscribe((v) => {
      this.setOrderSum(v);
    });

    this.today = this.calendar.getToday();
  }

  public edit() {
    if (!this.disabled) {
      this.isEditing = !this.isEditing;
    }
  }

  public changeStatus(statuss: OrderStatus) {
    if (this.isAdmin) {
      // const subscription = this.api
      //   .updateOrder({ id: this.order.id, status: statuss })
      //   .pipe(takeWhile(() => this.rxAlive))
      //   .subscribe(() => {
      //     this.orderUpdated.emit(this.order.id);
      //     this.loadingService.removeSubscription(subscription);
      //   });
      // this.loadingService.addSubscription(subscription);
    }
  }

  public onSaveClick() {
    if (this.orderForm.invalid) {
      for (const control of Object.values(this.orderForm.controls)) {
        if (control.invalid) {
          control.markAsDirty();
        }
      }
      return;
    }

    const orderFormValue = this.orderForm.getRawValue();
    const order: UpdateOrder = {
      id: this.order.id,
      // placeId: orderFormValue.place,
      dateFrom: orderFormValue.period.fromDate,
      dateTo: orderFormValue.period.toDate,
      // time: orderFormValue.time,
      orderSum: this.order.orderSum,
    };

    // const subscription = this.api
    //   .updateOrder(order)
    //   .pipe(takeWhile(() => this.rxAlive))
    //   .subscribe(() => {
    //     this.orderUpdated.emit(this.order.id);
    //     this.loadingService.removeSubscription(subscription);
    //   });
    // this.loadingService.addSubscription(subscription);
  }

  public cancel() {
    if (this.disabled || !confirm('Вы уверены, что хотите отменить заказ?')) {
      return;
    }

    const subscription = this.api
      .cancelOrder(this.order.id)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.orderUpdated.emit(this.order.id);
        this.loadingService.removeSubscription(subscription);
      });
    this.loadingService.addSubscription(subscription);
  }

  private setOrderSum(model: SearchModel) {
    const periodDays = SearchService.setPeriodDays(model);

    // this.order.orderSum = this.order.car.price * periodDays;
  }

  ngOnInit(): void {
    if (this.places && this.places.length) {
      this.orderForm.get('place').setValidators(Validators.required);
    }
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

  setMaxDate(fromDate: NgbDate) {
    if (!this.order.car.dates) {
      this.maxDate = null;
      return;
    }
    const maxDate = this.order.car.dates.filter((range: DateRange) => range.dateFrom.after(fromDate))[0];
    if (maxDate) {
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
    if (date.before(this.minDate)) {
      return true;
    }
    if (date.after(this.maxDate)) {
      return true;
    }
    if (!this.order.car.dates) {
      return false;
    }

    for (let range of this.order.car.dates) {
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

  private statuses: Status[] = [
    {
      status: OrderStatus.Planned,
      statusText: 'Запланирован',
      statusClass: 'bg-info',
    },
    {
      status: OrderStatus.Active,
      statusText: 'Активен',
      statusClass: 'bg-success',
    },
    {
      status: OrderStatus.Canceled,
      statusText: 'Отменен',
      statusClass: 'bg-danger',
    },
    {
      status: OrderStatus.Ready,
      statusText: 'Окончен',
      statusClass: 'bg-purple',
    },
  ];
}

export interface Status {
  status: OrderStatus;
  statusText: string;
  statusClass: string;
}
