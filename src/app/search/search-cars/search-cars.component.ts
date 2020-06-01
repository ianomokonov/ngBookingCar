import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SearchService, SearchModel } from 'src/app/services/search.service';
import { takeWhile, take, filter } from 'rxjs/internal/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'bk-search-cars',
  templateUrl: './search-cars.component.html',
  styleUrls: ['./search-cars.component.scss'],
})
export class SearchCarsComponent implements OnInit, OnDestroy {
  @Input() public header: string;
  @Input() public limit: number;

  filterFormArray: FormArray;
  constructor(
    private api: ApiService,
    private loadingService: LoadingService,
    public searchService: SearchService,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterFormArray = this.fb.array([]);
    this.filterFormArray.valueChanges.pipe(filter(() => this.isFiltersReady)).subscribe((value: Filter[]) => {
      const model = this.searchService.model || new SearchModel();
      model.filters = value.map(f => {
        f.options = f.options.filter(o => o.isChecked);
        return f;
      }).filter(f => f.options.length);
      this.updateCars(model);
    })
  }

  cars;
  isFiltersReady = false;

  private rxAlive: boolean = true;

  ngOnInit(): void {
    this.api
      .getFilters()
      .pipe(takeWhile(() => this.rxAlive))
      .subscribe((filters) => {
        this.setFilters(filters);
        this.isFiltersReady = true;
      });
    this.searchService.$filtersUpdate.pipe(takeWhile(() => this.rxAlive)).subscribe((model) => {
      this.updateCars(model);
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
  setFilters(filters: Filter[]) {
    filters.forEach((f) => {
      const form = this.fb.group({
        name: f.name,
        prop: f.prop,
        isClosed: f.isClosed,
        options: this.fb.array(
          f.options.map((o) => {
            return this.fb.group({
              name: o.name,
              isChecked: o.isChecked,
            });
          })
        ),
      });
      this.filterFormArray.push(form);
    });
  }

  toggleFilter(filter: FormGroup) {
    filter.get('isClosed').setValue(!filter.value.isClosed, { emitEvent: false });
  }
  

  enter(carId) {
    // TODO убрать, когда сделаю личный кабинет
    if (this.auth.getToken()) {
      this.router.navigate([`/edit-car/${carId}`]);
      return;
    }
    this.auth.redirectUrl = `/edit-car/${carId}`;
    this.router.navigate(['/enter']);
  }
}

export interface Filter {
  name: string;
  prop: string;
  isClosed: boolean;
  options: FilterOption[];
}

export interface FilterOption {
  name: string;
  isChecked: boolean;
}
