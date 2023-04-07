import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss']
})
export class SlideToggleComponent {

  @Input() checked: boolean = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  changed(){
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
