import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterNewAdminRoutingModule } from './register-new-admin-routing.module';
import { RegisterNewAdminComponent } from './register-new-admin.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';


@NgModule({
  declarations: [
    RegisterNewAdminComponent
  ],
  imports: [
    CommonModule,
    RegisterNewAdminRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    InputModule,
    ButtonModule
  ]
})
export class RegisterNewAdminModule { }
