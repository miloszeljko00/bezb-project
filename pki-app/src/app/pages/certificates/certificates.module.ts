import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificatesRoutingModule } from './certificates-routing.module';
import { CertificatesPage } from './certificates.page';
import { CertificatesTableComponent } from './components/certificates-table/certificates-table.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';
import { SearchBarModule } from 'src/app/shared/ui/search-bar/search-bar.module';
import { NewCertificateDialog } from './dialogs/new-certificate-dialog/new-certificate.dialog';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { DialogModule } from 'src/app/shared/ui/dialog/dialog.module';
import { CertificatesTreeViewComponent } from './components/certificates-tree-view/certificates-tree-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeViewComponent } from 'src/app/shared/ui/tree-view/tree-view.component';
import { TreeViewModule } from 'src/app/shared/ui/tree-view/tree-view.module';


@NgModule({
  declarations: [
    CertificatesPage,
    CertificatesTableComponent,
    NewCertificateDialog,
    CertificatesTreeViewComponent,
  ],
  imports: [
    CommonModule,
    CertificatesRoutingModule,
    MaterialModule,
    ButtonModule,
    SearchBarModule,
    InputModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TreeViewModule
  ]
})
export class CertificatesModule { }
