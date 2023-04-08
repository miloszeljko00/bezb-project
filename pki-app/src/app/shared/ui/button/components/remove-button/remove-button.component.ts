import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-remove-button',
  templateUrl: './remove-button.component.html',
  styleUrls: ['./remove-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoveButtonComponent {
  @Input() disabled: boolean = false;
}
