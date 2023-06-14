import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesPage } from './employees.page';
import {SearchComponent} from "../search/search/search.component";

const routes: Routes = [
  { path: '', component: EmployeesPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
