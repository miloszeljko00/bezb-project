import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRolesRoutingModule } from './manage-roles-routing.module';
import { ManageRolesPage } from './manage-roles.page';
import { MaterialModule } from 'src/app/shared/material/material.module';


@NgModule({
  declarations: [
    ManageRolesPage
  ],
  imports: [
    CommonModule,
    ManageRolesRoutingModule,
    MaterialModule
  ]
})
export class ManageRolesModule { }
