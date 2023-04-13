import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss'],
})
export class DialogHeaderComponent {
  
  constructor(public dialogRef: MatDialogRef<any>) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
