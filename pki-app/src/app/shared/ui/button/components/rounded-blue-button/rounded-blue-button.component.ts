import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-rounded-blue-button',
  templateUrl: './rounded-blue-button.component.html',
  styleUrls: ['./rounded-blue-button.component.scss'],
})
export class RoundedBlueButtonComponent implements OnInit {
  
  @Input() fontIcon: string = '';
  @Input() fontSet: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
