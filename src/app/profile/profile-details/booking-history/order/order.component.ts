import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbTimeStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Order, OrderStatus, UpdateOrder } from 'src/app/models/order';
import { SearchModel } from 'src/app/services/search.service';
import { ApiService } from 'src/app/services/api.service';
import { takeWhile } from 'rxjs/internal/operators';

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

      const formValue = {
        period: {
          fromDate: this.order.dateFrom as NgbDate,
          toDate: this.order.dateTo as NgbDate,
        },
        time: this.order.time as NgbTimeStruct,
        place: this.order.placeId,
      };

      const fromDateNgb = this.order.dateFrom as NgbDate;
      
      this.minDate = this.calendar.getNext(this.today, 'd', 5);
      if(fromDateNgb.before(this.minDate)){
        this.disabled = true;
      }
      this.orderForm.patchValue(formValue);
    }
  }

  @Input() public disabled;
  @Output() public orderUpdated: EventEmitter<number> = new EventEmitter();
  public order: Order;

  public isEditing;

  public minDate: NgbDate;
  public today: NgbDate;

  hoveredDate: NgbDate | null = null;

  hourStep = 1;
  minuteStep = 30;

  orderForm: FormGroup;
  places = [
    {
      id: 1,
      name: 'Москва',
    },
    {
      id: 2,
      name: 'Санкт-Петербург',
    },
    {
      id: 3,
      name: 'Новосибирск',
    },
    {
      id: 4,
      name: 'Екатеринбург',
    },
    {
      id: 5,
      name: 'Астрахань',
    },
  ];

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
  constructor(private fb: FormBuilder, private calendar: NgbCalendar, private api: ApiService) {
    this.orderForm = this.fb.group({
      period: [null, Validators.required],
      place: [null, Validators.required],
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

  public onSaveClick(){
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
      placeId: orderFormValue.place,
      dateFrom: orderFormValue.period.fromDate,
      dateTo: orderFormValue.period.toDate,
      time: orderFormValue.time,
      orderSum: this.order.orderSum
    }


    this.api.updateOrder(order).pipe(takeWhile(() => this.rxAlive)).subscribe(() => {
      this.orderUpdated.emit(this.order.id);
    })
  }

  private setOrderSum({ period: { fromDate, toDate } }: SearchModel) {
    // console.log([fromDate, toDate])
    if (!toDate) {
      this.order.orderSum = this.order.car.price;
      return;
    }

    const periodDays =
      (new Date(toDate.year, toDate.month, toDate.day).getTime() - new Date(fromDate.year, fromDate.month, fromDate.day).getTime()) /
        (24 * 3600000) +
      1;

      this.order.orderSum = this.order.car.price * periodDays;
  }

  ngOnInit(): void {}

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
  
  isDisabled(date: NgbDate) {
    return date.before(this.minDate);
  }

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
