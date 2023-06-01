import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmResetPasswordRoutingModule } from './confirm-reset-password-routing.module';
import { ConfirmResetPasswordComponent } from './confirm-reset-password.component';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { MaterialModule } from 'src/app/shared/material/material.module';


@NgModule({
  declarations: [
    ConfirmResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ConfirmResetPasswordRoutingModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputModule,
    MaterialModule
  ]
})
export class ConfirmResetPasswordModule { }
