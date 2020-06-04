import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bk-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
})
export class CarsComponent implements OnInit {
  cars;
  constructor(private api: ApiService, private loadingService: LoadingService, public translate: TranslateService) {}

  ngOnInit(): void {
    const subscription = this.api.getCars().subscribe(cars => {
      this.cars = cars;
      this.loadingService.removeSubscription(subscription);
    })
    this.loadingService.addSubscription(subscription);
  }
}
