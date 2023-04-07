import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

export interface SelectOption {
  value: any;
  displayValue: string;
}

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss']
})
export class SelectFieldComponent implements OnInit {

  @Input() disabled = false;
  @Input() options: SelectOption[] = [];
  @Input() selected: any;
  @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {;
  }
  selectionChange(event: MatSelectChange){
    console.log(event.value);
    this.selected=event.value;
    this.selectedChange.emit(this.selected);
  }

}
