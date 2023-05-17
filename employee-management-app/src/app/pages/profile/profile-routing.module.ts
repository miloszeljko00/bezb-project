import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminProfileComponent} from "./components/admin-profile/admin-profile.component";
import {EngineerProfileComponent} from "./components/engineer-profile/engineer-profile.component";
import {ManagerProfileComponent} from "./components/manager-profile/manager-profile.component";

const routes: Routes = [{ path: 'admin', component: AdminProfileComponent },
  { path: 'engineer', component: EngineerProfileComponent},
  { path: 'manager', component: ManagerProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
