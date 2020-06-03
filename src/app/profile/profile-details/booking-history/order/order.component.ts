import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbTimeStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Order, OrderStatus, UpdateOrder, DateRange } from 'src/app/models/order';
import { SearchModel, SearchService } from 'src/app/services/search.service';
import { ApiService } from 'src/app/services/api.service';
import { takeWhile } from 'rxjs/internal/operators';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'bk-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
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

      const fromDateNgb = this.order.dateFrom as NgbDate;

      this.minDate = this.calendar.getNext(this.today, 'd', 5);
      if (this.order.status != OrderStatus.Planned || fromDateNgb.before(this.minDate)) {
        this.disabled = true;
      }
      this.orderForm.patchValue(this.order);
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
    return this.orderForm.value.dateFrom;
  }

  public get toDate(): NgbDate | null {
    return this.orderForm.value.dateTo;
  }

  public set fromDate(date: NgbDate) {
    this.orderForm.get('dateFrom').setValue(date, {emitEvent: false});
  }

  public set toDate(date: NgbDate) {
    this.orderForm.get('dateTo').setValue(date, {emitEvent: false});
  }

  private rxAlive: boolean = true;
  public orderStatus = OrderStatus;
  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public api: ApiService,
    private loadingService: LoadingService,
    public searchService: SearchService
  ) {
    this.orderForm = this.fb.group({
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required],
      placeFromId: [null, Validators.required],
      placeToId: [null, Validators.required],
      timeFrom: [null, Validators.required],
      timeTo: [null, Validators.required],
    });

    this.orderForm.valueChanges.pipe(takeWhile(() => this.rxAlive)).subscribe((v) => {
      this.setMaxDate(v.dateFrom);
      const from = NgbDate.from(v.dateFrom);
      if(from.after(this.toDate)){
        this.toDate = from;
      }
      this.setOrderSum(this.orderForm.value);
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
      const subscription = this.api
        .updateOrder({ id: this.order.id, status: statuss })
        .pipe(takeWhile(() => this.rxAlive))
        .subscribe(() => {
          this.orderUpdated.emit(this.order.id);
          this.loadingService.removeSubscription(subscription);
        });
      this.loadingService.addSubscription(subscription);
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
      placeFromId: orderFormValue.placeFromId,
      placeToId: orderFormValue.placeToId,
      dateFrom: orderFormValue.dateFrom,
      dateTo: orderFormValue.dateTo,
      timeFrom: orderFormValue.timeFrom,
      timeTo: orderFormValue.timeTo,
      orderSum: this.order.orderSum,
    };

    const subscription = this.api
      .updateOrder(order)
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe(() => {
        this.orderUpdated.emit(this.order.id);
        this.loadingService.removeSubscription(subscription);
      });
    this.loadingService.addSubscription(subscription);
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

    this.order.orderSum = this.searchService.getCarPrice(this.order.car, periodDays, false);
  }

  ngOnInit(): void {}

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

  isFromDisabled = (date: NgbDate) => {
    if (date.before(this.searchService.minDate)) {
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
      statusText: 'USER.PLANNED',
      statusClass: 'bg-info',
    },
    {
      status: OrderStatus.Active,
      statusText: 'USER.ACTIVE',
      statusClass: 'bg-success',
    },
    {
      status: OrderStatus.Canceled,
      statusText: 'USER.CANCELED',
      statusClass: 'bg-danger',
    },
    {
      status: OrderStatus.Ready,
      statusText: 'USER.READY',
      statusClass: 'bg-purple',
    },
  ];
}

export interface Status {
  status: OrderStatus;
  statusText: string;
  statusClass: string;
}
