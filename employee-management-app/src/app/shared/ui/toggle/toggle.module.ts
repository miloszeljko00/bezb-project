import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [
    SlideToggleComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports:[
    SlideToggleComponent
  ],
})
export class ToggleModule { }
