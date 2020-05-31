import {Component,Injectable,EventEmitter,Input,Output} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct,NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

const I18N_VALUES = {
  'en': {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  'ru': {
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'ru';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: TranslateService) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.currentLang].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.currentLang].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Component({
  selector: 'ngbd-datepicker-i18n',
  template: `
  <ngb-datepicker
    [(ngModel)]="model"
    [displayMonths]="displayMonths"
    outsideDays="collapsed"
    [minDate]="minDate"
    [maxDate]="maxDate"
    [dayTemplate]="dayTemplate"
    [markDisabled]="markDisabled"
    (select)="onDateSelect($event)"
  ></ngb-datepicker>
`,
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom NgbDatepickerI18n provider
})
export class NgbdDatepickerI18n {
  @Input() dayTemplate;
  @Input() displayMonths = 1;
  @Input() minDate;
  @Input() maxDate;
  @Input() markDisabled;
  @Output() dateSelect: EventEmitter<NgbDate> = new EventEmitter<NgbDate>();
  model: NgbDateStruct;

  onDateSelect(e) {
    this.dateSelect.emit(e);
  }
}
