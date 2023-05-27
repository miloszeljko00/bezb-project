import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageRolesPage } from './manage-roles.page';

const routes: Routes = [
  { path: '', component: ManageRolesPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRolesRoutingModule { }
