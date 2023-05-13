import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PrimaryButtonComponent } from './components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from './components/secondary-button/secondary-button.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { RemoveButtonComponent } from './components/remove-button/remove-button.component';
import { CloseButtonComponent } from './components/close-button/close-button.component';



@NgModule({
  declarations: [
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    AddButtonComponent,
    RemoveButtonComponent,
    CloseButtonComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    AddButtonComponent,
    RemoveButtonComponent,
    CloseButtonComponent,
  ]
})
export class ButtonModule { }
