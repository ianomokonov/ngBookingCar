import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Order } from 'src/app/models/order';
import { takeWhile } from 'rxjs/internal/operators';
import { Place } from 'src/app/models/place';
import { LoadingService } from 'src/app/services/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bk-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss'],
})
export class BookingHistoryComponent implements OnInit {
  public orders: Order[];
  public places: Place[];
  private rxAlive: boolean = true;
  public isAdmin: boolean;

  constructor(private api: ApiService, private loadingService: LoadingService, public translate: TranslateService) {}

  ngOnInit(): void {
    this.getOrders();
    const getPlaces = this.api
      .getPlaces()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((places) => {
        this.places = places;
        this.loadingService.removeSubscription(getPlaces);
      });
    this.loadingService.addSubscription(getPlaces);
    const checkAccess = this.api
      .checkAccess()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
        this.loadingService.removeSubscription(checkAccess);
      });
    this.loadingService.addSubscription(checkAccess);
  }

  getOrders() {
    const getOrders = this.api
      .getOrders()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((orders) => {
        this.orders = orders;
        this.loadingService.removeSubscription(getOrders);
      });
    this.loadingService.addSubscription(getOrders);
  }
}
