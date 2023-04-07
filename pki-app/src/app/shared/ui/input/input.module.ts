import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
import { AutocompleteInputFieldComponent } from './components/autocomplete-input-field/autocomplete-input-field/autocomplete-input-field.component';
import { DateFieldComponent } from './components/date-field/date-field.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { NumberInputFieldComponent } from './components/number-input-field/number-input-field.component';
import { SelectFieldComponent } from './components/select-field/select-field.component';



@NgModule({
  declarations: [
    AutocompleteInputFieldComponent,
    DateFieldComponent,
    InputFieldComponent,
    NumberInputFieldComponent,
    SelectFieldComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    AutocompleteInputFieldComponent,
    DateFieldComponent,
    InputFieldComponent,
    NumberInputFieldComponent,
    SelectFieldComponent,
  ]
})
export class InputModule { }
