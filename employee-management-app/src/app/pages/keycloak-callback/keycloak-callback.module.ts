import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeycloakCallbackRoutingModule } from './keycloak-callback-routing.module';
import { KeycloakCallbackComponent } from './keycloak-callback.component';


@NgModule({
  declarations: [
    KeycloakCallbackComponent
  ],
  imports: [
    CommonModule,
    KeycloakCallbackRoutingModule
  ]
})
export class KeycloakCallbackModule { }
