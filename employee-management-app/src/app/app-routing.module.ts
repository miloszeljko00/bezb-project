import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetProjectsGuard } from './core/auth/guards/get-projects.guard';
import { GetEmployeesGuard } from './core/auth/guards/get-employees.guard';
import { RegisterNewAdminGuard } from './core/auth/guards/register-new-admin.guard';
import { GetRolesGuard } from './core/auth/guards/get-ROLES.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
  { path: 'previewRegistrationRequests', loadChildren: () => import('./pages/PreviewRegistrationRequests/PreviewRegistrationRequests.module').then(m => m.PreviewRegistrationRequestsModule) },
  { path: 'manage-roles', loadChildren: () => import('./pages/manage-roles/manage-roles.module').then(m => m.ManageRolesModule), canActivate: [GetRolesGuard] },
  { path: 'account', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'employees', loadChildren: () => import('./pages/employees/employees.module').then(m => m.EmployeesModule), canActivate: [GetEmployeesGuard] },
  { path: 'projects', loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule), canActivate: [GetProjectsGuard] },
  { path: 'register-new-admin', loadChildren: () => import('./pages/register-new-admin/register-new-admin.module').then(m => m.RegisterNewAdminModule), canActivate: [RegisterNewAdminGuard] },
  { path: 'change-password/:email', loadChildren: () => import('./pages/change-password/change-password.module').then(m => m.ChangePasswordModule) },
  { path: '**', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
