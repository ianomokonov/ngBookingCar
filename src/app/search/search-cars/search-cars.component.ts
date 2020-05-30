import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SearchService, SearchModel } from 'src/app/services/search.service';
import { takeWhile } from 'rxjs/internal/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bk-search-cars',
  templateUrl: './search-cars.component.html',
  styleUrls: ['./search-cars.component.scss'],
})
export class SearchCarsComponent implements OnInit, OnDestroy {
  @Input() public header: string;
  @Input() public limit: number;

  constructor(
    private api: ApiService,
    private loadingService: LoadingService,
    private searchService: SearchService,
    private auth: AuthService,
    private router: Router
  ) {}

  cars;
  periodDays: number = 1;

  private rxAlive: boolean = true;

  ngOnInit(): void {
    this.searchService.$filtersUpdate.pipe(takeWhile(() => this.rxAlive)).subscribe((model) => {
      this.updateCars(model);
      this.periodDays = SearchService.setPeriodDays(model);
    });
  }

  ngOnDestroy(): void {
    this.rxAlive = false;
  }

  updateCars(model?: SearchModel) {
    const subscription = this.api.getCars(model, this.limit).subscribe((cars) => {
      this.cars = cars;
      this.loadingService.removeSubscription(subscription);
    });
    this.loadingService.addSubscription(subscription);
  }

  getCarPrice({ summerPrice, winterPrice, summerPrices, winterPrices }) {
    const month = new Date().getMonth();
    let prices = null;
    let price = null;
    if (month > 2 && month < 9) {
      prices = summerPrices;
      price = summerPrice;
    } else {
      prices = winterPrices;
      price = winterPrice;
    }
    if (this.periodDays > 0 && this.periodDays < 8) {
      return prices[this.searchService.pricesNames[this.periodDays - 1]];
    }
    return price * this.periodDays;
  }

  enter(carId) { // TODO убрать, когда сделаю личный кабинет
    if (this.auth.getToken()) {
      this.router.navigate([`/edit-car/${carId}`]);
      return;
    }
    this.auth.redirectUrl = `/edit-car/${carId}`;
    this.router.navigate(['/enter']);
  }
}
