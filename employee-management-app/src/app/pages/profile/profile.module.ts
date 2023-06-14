import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';
import { CheckboxModule } from 'src/app/shared/ui/checkbox/checkbox.module';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { RadioModule } from 'src/app/shared/ui/radio/radio.module';
import { SearchBarModule } from 'src/app/shared/ui/search-bar/search-bar.module';
import { ToggleModule } from 'src/app/shared/ui/toggle/toggle.module';
import {AdminProfileComponent} from "./components/admin-profile/admin-profile.component";
import {EngineerProfileComponent} from "./components/engineer-profile/engineer-profile.component";
import {ManagerProfileComponent} from "./components/manager-profile/manager-profile.component";
import {ProfileRoutingModule} from "./profile-routing.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RegisterRoutingModule} from "../register/register-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../shared/material/material.module";
import {SearchModule} from "../search/search.module";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [
    AdminProfileComponent,
    EngineerProfileComponent,
    ManagerProfileComponent
  ],
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MaterialModule,
        ButtonModule,
        CheckboxModule,
        InputModule,
        RadioModule,
        SearchBarModule,
        ToggleModule,
        ProfileRoutingModule,
        MatFormFieldModule,
        FormsModule,
      SearchModule,
      MatInputModule
    ]
})
export class ProfileModule { }
