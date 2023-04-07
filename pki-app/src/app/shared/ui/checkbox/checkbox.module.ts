import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { MaterialModule } from '../../material/material.module';



@NgModule({
  declarations: [
    CheckboxComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    CheckboxComponent
  ]
})
export class CheckboxModule { }
