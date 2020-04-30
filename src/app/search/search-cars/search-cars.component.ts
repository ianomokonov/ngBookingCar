import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SearchService, SearchModel } from 'src/app/services/search.service';
import { takeWhile } from 'rxjs/internal/operators';

@Component({
  selector: 'bk-search-cars',
  templateUrl: './search-cars.component.html',
  styleUrls: ['./search-cars.component.scss'],
})
export class SearchCarsComponent implements OnInit, OnDestroy {
  @Input() public header: string;
  @Input() public limit: number;

  constructor(private api: ApiService, private searchService: SearchService) {}

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
    this.api.getCars(model, this.limit).subscribe((cars) => {
      this.cars = cars;
    });
  }
}
