import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bk-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
})
export class CarsComponent implements OnInit {
  cars = [
    {
      img: '../../../assets/cars/logan_new.jpeg',
      name: 'Renault Logan II MT',
      places: 5,
      license: 'B',
      kpp: 'Механика',
      price: 1805,
    },
    {
      img: '../../../assets/cars/logan_new.jpeg',
      name: 'Renault Logan II MT',
      places: 5,
      license: 'B',
      kpp: 'Механика',
      price: 1805,
    },
    {
      img: '../../../assets/cars/logan_new.jpeg',
      name: 'Renault Logan II MT',
      places: 5,
      license: 'B',
      kpp: 'Механика',
      price: 1805,
    },
    {
      img: '../../../assets/cars/logan_new.jpeg',
      name: 'Renault Logan II MT',
      places: 5,
      license: 'B',
      kpp: 'Механика',
      price: 1805,
    },
    {
      img: '../../../assets/cars/logan_new.jpeg',
      name: 'Renault Logan II MT',
      places: 5,
      license: 'B',
      kpp: 'Механика',
      price: 1805,
    },
    {
      img: '../../../assets/cars/logan_new.jpeg',
      name: 'Renault Logan II MT',
      places: 5,
      license: 'B',
      kpp: 'Механика',
      price: 1805,
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
