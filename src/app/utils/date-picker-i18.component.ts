import {Component,Injectable,EventEmitter,Input,Output} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct,NgbDate} from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  'fr': {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
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

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
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
    [displayMonths]="2"
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
  @Input() minDate;
  @Input() maxDate;
  @Input() markDisabled;
  @Output() dateSelect: EventEmitter<NgbDate> = new EventEmitter<NgbDate>();
  model: NgbDateStruct;

  onDateSelect(e) {
    this.dateSelect.emit(e);
  }
}
