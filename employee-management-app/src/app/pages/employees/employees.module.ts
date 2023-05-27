import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesPage } from './employees.page';
import { MaterialModule } from 'src/app/shared/material/material.module';


@NgModule({
  declarations: [
    EmployeesPage
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    MaterialModule
  ]
})
export class EmployeesModule { }
