import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-number-input-field',
  templateUrl: './number-input-field.component.html',
  styleUrls: ['./number-input-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberInputFieldComponent {

  @Input() value: number | undefined;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  valueChanged(event: number) {
    this.value = event;
    this.valueChange.emit(this.value);
  }

}
