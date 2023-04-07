import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { DatepickerDropdownPositionX } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
})
export class DateFieldComponent {

  @Input() value: Date | undefined;
  @Output() valueChange: EventEmitter<Date> = new EventEmitter<Date>();

  valueChanged(event: Date) {
    this.value = event;
    this.valueChange.emit(this.value);
  }
}
