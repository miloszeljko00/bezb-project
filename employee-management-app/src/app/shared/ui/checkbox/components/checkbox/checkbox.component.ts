import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input() checked = false;
  @Input() disabled = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  @Input() fontIcon: string = '';
  @Input() fontSet: string = '';
  constructor() { }

  ngOnInit() {
  }

  checkedChanged(event: MatCheckboxChange) {
    this.checked = event.checked;
    this.checkedChange.emit(this.checked);
  }

}
