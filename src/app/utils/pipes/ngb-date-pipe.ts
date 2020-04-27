import { Pipe, PipeTransform } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Pipe({name: 'ngbDate'})
export class NgbDatePipe implements PipeTransform {
    transform(value): Date {
        if(value.year && value.month && value.day){
            return new Date(value.year, value.month - 1, value.day);
        }
        const date = value.split('.');
        return new Date(+date[2], +date[1] - 1, +date[0]);
        
    }
}