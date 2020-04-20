import { Place } from './place';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export class Order {
  id: number;
  carId: number;
  place: Place;
  dateFrom: Date;
  dateTo: Date;
  orderSum: number;
  timeStruct: NgbTimeStruct;
  get time(): string {
    return this._time;
  }
  set time(time: string) {
    let struc = time.split(':');
    this.timeStruct = { hour: +struc[0], minute: +struc[1], second: +struc[2] };
    this._time = time;
  }
  _time: string;
}
