import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-footer',
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogFooterComponent {

  @Input() okText: string = '';
  @Input() cancelText: string = '';
  @Input() okDisabled: boolean = false;

  @Output() okClick: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() cancelClick: EventEmitter<boolean> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<any>) { }

  closeDialog(){
    this.dialogRef.close();
  }
}
