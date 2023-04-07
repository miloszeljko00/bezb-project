import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-raised-button',
  templateUrl: './raised-button.component.html',
  styleUrls: ['./raised-button.component.scss'],
})
export class RaisedButtonComponent {

  @Input() disabled: boolean = false;

  @ViewChild('button', { read: ElementRef, static: true }) button:ElementRef<HTMLButtonElement> | undefined;

  constructor() { }

  ngOnInit() {
    if(!this.button) return;
    
    if(this.disabled) {
      this.button.nativeElement.classList.add('disabled-button');
      this.button.nativeElement.classList.remove('active-button');
    }
    else {
      this.button.nativeElement.classList.add('active-button');
      this.button.nativeElement.classList.remove('disabled-button');
    }
  }

  ngOnChanges() {
    if(!this.button) return;

    if(this.disabled) {
      this.button.nativeElement.classList.add('disabled-button');
      this.button.nativeElement.classList.remove('active-button');
    }
    else {
      this.button.nativeElement.classList.add('active-button');
      this.button.nativeElement.classList.remove('disabled-button');
    }
  }

}
