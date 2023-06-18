import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeycloakCallbackComponent } from './keycloak-callback.component';

const routes: Routes = [
  { path: '', component: KeycloakCallbackComponent },
  { path: '**', component: KeycloakCallbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeycloakCallbackRoutingModule { }
