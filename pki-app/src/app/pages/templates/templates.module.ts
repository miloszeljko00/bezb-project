import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';
import { SearchBarModule } from 'src/app/shared/ui/search-bar/search-bar.module';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { DialogModule } from 'src/app/shared/ui/dialog/dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TemplatesFormComponent} from "./components/templates-form/templates-form.component";
import {CheckboxModule} from "../../shared/ui/checkbox/checkbox.module";

@NgModule({
  declarations: [
    TemplatesFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ButtonModule,
    SearchBarModule,
    InputModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule
  ]
})
export class TemplatesModule { }
