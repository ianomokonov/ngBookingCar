import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { SearchService, SearchModel } from 'src/app/services/search.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'bk-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  filters: SearchModel;

  constructor(public searchService: SearchService, public api: ApiService) {}

  ngOnInit(): void {
    this.filters = this.searchService.model;
    this.searchService.initUpdate();
  }

  resetFilters() {
    this.searchService.model = null;
  }
}
