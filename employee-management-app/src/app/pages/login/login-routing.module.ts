import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login.page';
import { MagicLoginCallbackComponent } from './components/magic-login-callback/magic-login-callback.component';

const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'magicLoginCallback', component: MagicLoginCallbackComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
