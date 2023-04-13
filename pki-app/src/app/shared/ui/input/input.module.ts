import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
import { AutocompleteInputFieldComponent } from './components/autocomplete-input-field/autocomplete-input-field/autocomplete-input-field.component';
import { DateFieldComponent } from './components/date-field/date-field.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { NumberInputFieldComponent } from './components/number-input-field/number-input-field.component';
import { SelectFieldComponent } from './components/select-field/select-field.component';
import { PasswordInputFieldComponent } from './components/password-input-field/password-input-field.component';

@NgModule({
  declarations: [
    AutocompleteInputFieldComponent,
    DateFieldComponent,
    InputFieldComponent,
    NumberInputFieldComponent,
    SelectFieldComponent,
    PasswordInputFieldComponent,
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
    PasswordInputFieldComponent,
  ]
})
export class InputModule { }
