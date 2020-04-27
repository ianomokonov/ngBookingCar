import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Car } from './car';
import { Place } from './place';

export interface Order {
  id?: number;
  carId: number;
  placeId: number;
  dateFrom: string | NgbDate;
  dateTo: string | NgbDate;
  orderSum: number;
  time: string | NgbTimeStruct;
  status?: OrderStatus;
  statusText?: string;
  statusClass?: string;

  car?: Car;
  place?: Place;
}

export enum OrderStatus {
  Planned = 1,
  Active = 2,
  Canceled = 3,
  Ready = 4,
}
