import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-input-field',
  templateUrl: './password-input-field.component.html',
  styleUrls: ['./password-input-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordInputFieldComponent {
  
  @Input() value = '';
  @Input() disabled = false;
  @Input() autocomplete = '';
  @Output() valueChange = new EventEmitter<string>();

  valueChanged(event: string) {
    this.value = event;
    this.valueChange.emit(this.value);
  }
}
