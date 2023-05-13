import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';
import { CheckboxModule } from 'src/app/shared/ui/checkbox/checkbox.module';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { RadioModule } from 'src/app/shared/ui/radio/radio.module';
import { SearchBarModule } from 'src/app/shared/ui/search-bar/search-bar.module';
import { ToggleModule } from 'src/app/shared/ui/toggle/toggle.module';


@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputModule,
    RadioModule,
    SearchBarModule,
    ToggleModule,
  ]
})
export class HomeModule { }
