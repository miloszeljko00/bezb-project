import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-accent-button',
  templateUrl: './accent-button.component.html',
  styleUrls: ['./accent-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccentButtonComponent implements OnInit {

  @Input() disabled: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
