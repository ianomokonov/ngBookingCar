import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bk-search-cars',
  templateUrl: './search-cars.component.html',
  styleUrls: ['./search-cars.component.scss'],
})
export class SearchCarsComponent implements OnInit {

  @Input() public header: string;

  constructor() {}

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

  ngOnInit(): void {}
}
