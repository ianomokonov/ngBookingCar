import { Pipe, PipeTransform } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Pipe({ name: 'carPlaces' })
export class CarPlacesPipe implements PipeTransform {
  transform(value): String {
    if (!value || isNaN(+value)) {
      return value;
    }

    switch (+value % 10) {
      case 1: {
        return `${value} место`;
      }
      case 2:
      case 3:
      case 4: {
        return `${value} места`;
      }
      default: {
        return `${value} мест`;
      }
    }
  }
}
