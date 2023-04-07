import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFieldComponent {
  
  @Input() value = '';
  @Input() disabled = false;
  @Input() autocomplete = '';
  @Output() valueChange = new EventEmitter<string>();

  valueChanged(event: string) {
    this.value = event;
    this.valueChange.emit(this.value);
  }
}
