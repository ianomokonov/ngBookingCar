import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Car } from './car';
import { Place } from './place';
import { User } from './user';

export interface UpdateOrder {
  id?: number;
  dateFrom?: string | NgbDate;
  dateTo?: string | NgbDate;
  orderSum?: number;
  timeFrom?: string;
  timeTo?: string;
  placeFromId?: number;
  placeToId?: number;
  status?: OrderStatus;
}

export interface Order extends UpdateOrder {
  carId: number;
  status?: OrderStatus;
  statusText?: string;
  statusClass?: string;
  isCarFree?: boolean;

  car?: Car;
  placeFrom?: Place;
  placeTo?: Place;
  user?: User;
}

export enum OrderStatus {
  Planned = 1,
  Active = 2,
  Ready = 3,
  Canceled = 4,
}
export interface DateRange {
  dateFrom: NgbDate;
  dateTo?: NgbDate;
}
