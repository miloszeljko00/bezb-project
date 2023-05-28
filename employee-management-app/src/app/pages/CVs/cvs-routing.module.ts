import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CVsComponent } from './CVs.component';

const routes: Routes = [
  { path: '', component: CVsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CVsRoutingModule { }
