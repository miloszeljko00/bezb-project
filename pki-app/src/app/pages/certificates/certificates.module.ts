import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificatesRoutingModule } from './certificates-routing.module';
import { CertificatesPage } from './certificates.page';


@NgModule({
  declarations: [
    CertificatesPage
  ],
  imports: [
    CommonModule,
    CertificatesRoutingModule
  ]
})
export class CertificatesModule { }
