import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-footer',
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss'],
})
export class DialogFooterComponent {
  @Input() okDisabled: boolean = false;

  @Output() okClicked: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<any>) { }

  closeDialog(){
    this.dialogRef.close();
  }
}
