import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundedBlueButtonComponent } from './components/rounded-blue-button/rounded-blue-button.component';
import { RoundedGreenButtonComponent } from './components/rounded-green-button/rounded-green-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from './components/button/button.component';
import { RaisedButtonComponent } from './components/raised-button/raised-button.component';
import { AccentButtonComponent } from './components/accent-button/accent-button.component';



@NgModule({
  declarations: [
    RoundedBlueButtonComponent,
    RoundedGreenButtonComponent,
    ButtonComponent,
    RaisedButtonComponent,
    AccentButtonComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    RoundedBlueButtonComponent,
    RoundedGreenButtonComponent,
    ButtonComponent,
    RaisedButtonComponent,
    AccentButtonComponent
  ]
})
export class ButtonModule { }
