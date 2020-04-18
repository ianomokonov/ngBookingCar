import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bk-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss'],
})
export class BookingHistoryComponent implements OnInit {
  public orders = [
    {
      img: '../../assets/cars/logan_new.jpeg',
      name: 'Renault Logan II MT',
      dateFrom: { year: 2020, month: 10, day: 18 },
      dateTo: { year: 2020, month: 10, day: 20 },
      time: { hour: 10, minute: 30 },
      price: 1805,
      statusText: 'Запланирован',
      statusClass: 'bg-info'
    },
    {
      img: '../../assets/cars/logan_new.jpeg',
      name: 'Renault Logan II MT',
      dateFrom: { year: 2020, month: 10, day: 18 },
      dateTo: { year: 2020, month: 10, day: 20 },
      time: { hour: 10, minute: 30 },
      price: 1805,
      statusText: 'Активен',
      statusClass: 'bg-success'
    },
    {
      img: '../../assets/cars/logan_new.jpeg',
      name: 'Renault Logan II MT',
      dateFrom: { year: 2020, month: 10, day: 18 },
      dateTo: { year: 2020, month: 10, day: 20 },
      time: { hour: 10, minute: 30 },
      price: 1805,
      statusText: 'Окончен',
      statusClass: 'bg-purple'
    },
    {
      img: '../../assets/cars/logan_new.jpeg',
      name: 'Renault Logan II MT',
      dateFrom: { year: 2020, month: 10, day: 18 },
      dateTo: { year: 2020, month: 10, day: 20 },
      time: { hour: 10, minute: 30 },
      price: 1805,
      statusText: 'Отменен',
      statusClass: 'bg-danger'
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
