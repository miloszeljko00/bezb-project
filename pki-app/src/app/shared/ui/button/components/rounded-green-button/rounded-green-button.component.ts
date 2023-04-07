import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-rounded-green-button',
  templateUrl: './rounded-green-button.component.html',
  styleUrls: ['./rounded-green-button.component.scss'],
})
export class RoundedGreenButtonComponent implements OnInit {

  @Input() fontIcon: string = '';
  @Input() fontSet: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

}
