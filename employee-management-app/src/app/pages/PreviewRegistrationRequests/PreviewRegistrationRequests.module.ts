import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewRegistrationRequestsComponent } from './PreviewRegistrationRequests.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { PreviewRegistrationRequestRoutingModule } from './preview-registration-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PreviewRegistrationRequestRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MaterialModule
  ],
  declarations: [PreviewRegistrationRequestsComponent]
})
export class PreviewRegistrationRequestsModule { }
