import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasRoleAdminGuard } from './core/auth/guards/has-role-admin.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'accounts', loadChildren: () => import('./pages/accounts/accounts.module').then(m => m.AccountsModule), canActivate: [HasRoleAdminGuard] },
  { path: 'certificates', loadChildren: () => import('./pages/certificates/certificates.module').then(m => m.CertificatesModule) },
  { path: '**', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
