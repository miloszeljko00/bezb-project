import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';
import {SearchResponseComponent} from "./search-response/search-response.component";
import {SearchComponent} from "./search/search.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {CheckboxModule} from "../../shared/ui/checkbox/checkbox.module";
import {RadioModule} from "../../shared/ui/radio/radio.module";
import {SearchBarModule} from "../../shared/ui/search-bar/search-bar.module";
import {ToggleModule} from "../../shared/ui/toggle/toggle.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ProfileModule} from "../profile/profile.module";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    SearchResponseComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    InputModule,
    ButtonModule,
    CheckboxModule,
    RadioModule,
    SearchBarModule,
    ToggleModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule
  ]
})
export class SearchModule { }
