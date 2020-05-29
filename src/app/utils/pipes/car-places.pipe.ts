import { Pipe, PipeTransform } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';

@Pipe({ name: 'carPlaces' })
export class CarPlacesPipe implements PipeTransform {
  transform(value): string {
    if (!value || isNaN(+value)) {
      return value;
    }

    switch (+value % 10) {
      case 1: {
        return 'ONE_PLACE';
      }
      case 2:
      case 3:
      case 4: {
        return 'TWO_PLACES';
      }
      default: {
        return 'FIVE_PLACES';
      }
    }
  }
}
