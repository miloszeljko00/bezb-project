import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogHeaderComponent } from './dialog-header/dialog-header.component';
import { ButtonModule } from '../button/button.module';
import { DialogFooterComponent } from './dialog-footer/dialog-footer.component';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { InputModule } from '../input/input.module';
import { SearchBarComponent } from '../search-bar/components/search-bar/search-bar.component';
import { SearchBarModule } from '../search-bar/search-bar.module';
import { RadioModule } from '../radio/radio.module';
import { SlideToggleComponent } from '../toggle/components/slide-toggle/slide-toggle.component';
import { ToggleModule } from '../toggle/toggle.module';
import { MaterialModule } from '../../material/material.module';



@NgModule({
  declarations: [
    DialogHeaderComponent,
    DialogFooterComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    MaterialModule,
    InputModule,
    CheckboxModule,
    SearchBarModule,
    RadioModule,
    ToggleModule,
  ],
  exports: [
    DialogHeaderComponent,
    DialogFooterComponent,
  ]
})
export class DialogModule { }
