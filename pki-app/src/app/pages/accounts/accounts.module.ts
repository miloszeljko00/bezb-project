import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsPage } from './accounts.page';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';
import { RadioModule } from 'src/app/shared/ui/radio/radio.module';


@NgModule({
  declarations: [
    AccountsPage
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    InputModule,
    ButtonModule,
    RadioModule
  ]
})
export class AccountsModule { }
