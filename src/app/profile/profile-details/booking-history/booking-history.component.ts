import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'bk-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss'],
})
export class BookingHistoryComponent implements OnInit {
  public orders: Order[];

  constructor(private api: ApiService) {
    this.api.getOrders().subscribe(orders => {
      this.orders = orders;
    })
  }

  ngOnInit(): void {}
}
