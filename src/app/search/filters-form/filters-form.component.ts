import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SliderRange } from 'src/app/utils/double-slider/double-slider.component';

@Component({
  selector: 'bk-filters-form',
  templateUrl: './filters-form.component.html',
  styleUrls: ['./filters-form.component.scss'],
})
export class FiltersFormComponent {
  hoveredDate: NgbDate | null = null;

  hourStep = 1;
  minuteStep = 30;
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  priceRange: SliderRange = { min: 1500, max: 8000 };
  priceFormatValue = (value) => `₽ ${value}`;

  filterForm: FormGroup;
  places = [
    {
      id: 1,
      name: 'Москва',
    },
    {
      id: 2,
      name: 'Санкт-Петербург',
    },
    {
      id: 3,
      name: 'Новосибирск',
    },
    {
      id: 4,
      name: 'Екатеринбург',
    },
    {
      id: 5,
      name: 'Астрахань',
    },
  ];

  public get fromDate(): NgbDate {
    return this.filterForm.get('period').value.fromDate;
  }

  public get toDate(): NgbDate | null {
    return this.filterForm.get('period').value.toDate;
  }

  public set fromDate(date: NgbDate) {
    this.filterForm.get('period').setValue({
      fromDate: date,
      toDate: this.toDate,
    });
  }

  public set toDate(date: NgbDate) {
    this.filterForm.get('period').setValue({
      fromDate: this.fromDate,
      toDate: date,
    });
  }

  constructor(private fb: FormBuilder, calendar: NgbCalendar) {
    this.filterForm = this.fb.group({
      period: [
        {
          fromDate: calendar.getToday(),
          toDate: calendar.getNext(calendar.getToday(), 'd', 10),
        },
      ],
      place: null,
      time: this.time,
      price: { from: this.priceRange.min, to: this.priceRange.max },
    });

    this.filterForm.valueChanges.subscribe((v) => {
      console.log(v);
    });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
}
