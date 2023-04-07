import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.scss'],
})
export class SecondaryButtonComponent {

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
