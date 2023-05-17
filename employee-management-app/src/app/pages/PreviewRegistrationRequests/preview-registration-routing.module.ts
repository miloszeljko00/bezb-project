import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewRegistrationRequestsComponent } from './PreviewRegistrationRequests.component';

const routes: Routes = [{ path: '', component: PreviewRegistrationRequestsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviewRegistrationRequestRoutingModule { }
