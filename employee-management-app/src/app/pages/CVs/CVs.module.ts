import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CVsComponent } from './CVs.component';
import { CVsRoutingModule } from './cvs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CVsRoutingModule
  ],
  declarations: [CVsComponent]
})
export class CVsModule { }
