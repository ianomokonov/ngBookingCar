import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgbDate, NgbTimeStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Order, OrderStatus } from 'src/app/models/order';
import { SearchModel } from 'src/app/services/search.service';

@Component({
  selector: 'bk-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  @Input() public set carOrder(order: Order){
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
          toDate: this.order.dateTo as NgbDate
        },
        time: this.order.time as NgbTimeStruct,
        place: this.order.placeId
      }

      this.orderForm.patchValue(formValue);
    }
  }
  
  @Input() public disabled;
  public order: Order;

  public isEditing;

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
  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      period: null,
      place: null,
      time: null
    });

    this.orderForm.valueChanges.subscribe((v) => {
      console.log(v);
    });
  }

  public edit() {
    if (!this.disabled) {
      this.isEditing = !this.isEditing;
    }
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
