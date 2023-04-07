import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

export interface RadioOption {
  value: any;
  displayValue: string;
}


@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonComponent {

  @Input() label: string = '';
  @Input() options: RadioOption[] = [];
  @Input() selected: any;
  @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();

  selectionChange(event: MatRadioChange){
    this.selected = event;
    this.selectedChange.emit(this.selected);
  }

}
