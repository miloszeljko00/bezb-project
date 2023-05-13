import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class DateFieldComponent {

  @Input() value: Date|null = null;
  @Input() min: Date|null = null;
  @Input() max: Date|null = null;
  @Input() disabled = false;
  @Output() valueChange: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
  }

  valueChanged(event: Date) {
    this.value = event;
    this.valueChange.emit(this.value);
  }
}
