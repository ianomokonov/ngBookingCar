import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'bk-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  filters = {
    period: {
      fromDate: new NgbDate(2020, 5, 5),
      toDate: new NgbDate(2020, 5, 10),
    },
    time: { hour: 13, minute: 30, second: 0 },
    place: {
      id: 1,
      name: 'Москва',
    },
    price: {
      from: 5000,
      to: 8000
    }
  };

  constructor() {}

  ngOnInit(): void {}
}
