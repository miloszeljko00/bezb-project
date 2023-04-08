import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogFooterComponent } from './components/dialog-footer/dialog-footer.component';
import { DialogHeaderComponent } from './components/dialog-header/dialog-header.component';
import { ButtonModule } from '../button/button.module';
import { ConfirmDialog } from './components/confirm-dialog/confirm.dialog';



@NgModule({
  declarations: [
    DialogFooterComponent,
    DialogHeaderComponent,
    ConfirmDialog,
  ],
  imports: [
    CommonModule,
    ButtonModule,
  ],
  exports: [
    DialogFooterComponent,
    DialogHeaderComponent,
    ConfirmDialog,
  ]
})
export class DialogModule { }
