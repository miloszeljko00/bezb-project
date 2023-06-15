import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestResetPasswordRoutingModule } from './request-reset-password-routing.module';
import { RequestResetPasswordComponent } from './request-reset-password.component';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';


@NgModule({
  declarations: [
    RequestResetPasswordComponent
  ],
  imports: [
    CommonModule,
    RequestResetPasswordRoutingModule,
    InputModule,
    ButtonModule
  ]
})
export class RequestResetPasswordModule { }
