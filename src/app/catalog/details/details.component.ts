import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Car } from 'src/app/models/car';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'bk-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  car: Car;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private loadingService: LoadingService,
    public searchService: SearchService

  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        const subscription = this.api.getCar(params.id).subscribe((car) => {
          this.car = car;
          this.loadingService.removeSubscription(subscription);
        });
        this.loadingService.addSubscription(subscription);
      }
    });
  }
}
