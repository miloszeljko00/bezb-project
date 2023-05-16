import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { MagicLoginCallbackComponent } from './components/magic-login-callback/magic-login-callback.component';


@NgModule({
  declarations: [
    LoginPage,
    MagicLoginCallbackComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    InputModule,
    ButtonModule,
    MaterialModule
  ]
})
export class LoginModule { }
