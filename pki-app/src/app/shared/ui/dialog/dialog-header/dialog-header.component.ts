import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogHeaderComponent{

  @Input() title: string = '';

  constructor(public dialogRef: MatDialogRef<any>) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
