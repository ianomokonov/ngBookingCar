import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bk-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  car = {
    img: '../../../assets/cars/logan_new.jpeg',
    name: 'Renault Logan II MT',
    year: 2017,
    description:
      'Аренда Рено Логан. - демократичный и надёжный седан, с большим багажником и энергоёмкой подвеской. Оптимальное решение, если вы хотите получить хороший уровень комфорта по приемлемой цене.',
    price: 1805,
    engineType: 'Бензиновый, 16',
    enginePower: 82,
    speed: 172,
    time: 11.9,
    volumPerHundred: 7.2,
    kpp: 'Механическая',
    driveUnit: 'Передний',
    place: 5,
    backVolume: 510
  };

  constructor() {}

  ngOnInit(): void {}
}
