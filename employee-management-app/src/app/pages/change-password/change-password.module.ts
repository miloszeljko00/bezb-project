import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './change-password.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';


@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    InputModule,
    ButtonModule
  ]
})
export class ChangePasswordModule { }
