import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRolesRoutingModule } from './manage-roles-routing.module';
import { ManageRolesPage } from './manage-roles.page';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { AddPermissionDialog } from './components/add-permission-dialog/add-permission.dialog';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';


@NgModule({
  declarations: [
    ManageRolesPage,
    AddPermissionDialog
  ],
  imports: [
    CommonModule,
    ManageRolesRoutingModule,
    MaterialModule,
    ButtonModule
  ]
})
export class ManageRolesModule { }
