import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Order } from 'src/app/models/order';
import { takeWhile } from 'rxjs/internal/operators';

@Component({
  selector: 'bk-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss'],
})
export class BookingHistoryComponent implements OnInit {
  public orders: Order[];
  private rxAlive: boolean = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.api
      .getOrders()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((orders) => {
        this.orders = orders;
      });
  }
}
