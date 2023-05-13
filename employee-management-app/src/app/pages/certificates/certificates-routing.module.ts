import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificatesPage } from './certificates.page';
import {TemplatesFormComponent} from "../templates/components/templates-form/templates-form.component";

const routes: Routes = [{ path: '', component: CertificatesPage },
  {path:'template', component: TemplatesFormComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificatesRoutingModule { }
