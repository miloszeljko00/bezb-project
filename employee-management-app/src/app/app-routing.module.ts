import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
  { path: 'previewRegistrationRequests', loadChildren: () => import('./pages/PreviewRegistrationRequests/PreviewRegistrationRequests.module').then(m => m.PreviewRegistrationRequestsModule) },
  { path: 'manage-roles', loadChildren: () => import('./pages/manage-roles/manage-roles.module').then(m => m.ManageRolesModule) },
  { path: 'account', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'employees', loadChildren: () => import('./pages/employees/employees.module').then(m => m.EmployeesModule) },
  { path: 'projects', loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'register-new-admin', loadChildren: () => import('./pages/register-new-admin/register-new-admin.module').then(m => m.RegisterNewAdminModule) },
  { path: 'cvs', loadChildren: () => import('./pages/CVs/CVs.module').then(m => m.CVsModule) },
  { path: '**', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
