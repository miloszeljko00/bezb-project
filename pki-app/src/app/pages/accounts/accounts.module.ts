import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';
import { RadioModule } from 'src/app/shared/ui/radio/radio.module';
import { CreateCertificateHolderDialogComponent } from './dialogs/create-certificate-holder.dialog/create-certificate-holder.dialog';
import { AccountsPage } from './accounts.page';
import { SearchBarModule } from 'src/app/shared/ui/search-bar/search-bar.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { DialogModule } from '@angular/cdk/dialog';
import { CertificateHoldersTableComponent } from './components/certificate-holders-table/certificate-holders-table/certificate-holders-table.component';


@NgModule({
  declarations: [
    AccountsPage,
    CreateCertificateHolderDialogComponent,
    CertificateHoldersTableComponent,
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    InputModule,
    ButtonModule,
    RadioModule,
    SearchBarModule,
    MaterialModule,
    DialogModule
  ]
})
export class AccountsModule { }
