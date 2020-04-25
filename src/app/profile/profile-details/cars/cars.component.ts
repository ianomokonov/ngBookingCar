import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'bk-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
})
export class CarsComponent implements OnInit {
  cars;
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getCars().subscribe(cars => {
      this.cars = cars;
    })
  }
}
