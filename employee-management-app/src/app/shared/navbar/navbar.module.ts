import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarButtonComponent } from './components/navbar-button/navbar-button.component';
import { MaterialModule } from '../material/material.module';
import { NotificationsDialogComponent } from './components/notifications-dialog/notifications-dialog.component';



@NgModule({
  declarations: [
    NavbarComponent,
    NavbarButtonComponent,
    NotificationsDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
