import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface Order {
  id?: number;
  carId: number;
  placeId: number;
  dateFrom: string | NgbDate;
  dateTo: string | NgbDate;
  orderSum: number;
  time: string;
}
