import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm.dialog.html',
  styleUrls: ['./confirm.dialog.scss'],
})
export class ConfirmDialog {

  title = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string },
    public dialogRef: MatDialogRef<ConfirmDialog>,
  ) {
    if(data.title) this.title = data.title
  }

}
