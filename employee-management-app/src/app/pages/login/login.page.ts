import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/core/auth/dtos/login-request';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {

  loginForm = {
    email: '',
    password: '',
  }

  constructor(
    private authService: AuthService,
  ) {}

  login() {
    const loginRequest = new LoginRequest(this.loginForm.email, this.loginForm.password)
    this.authService.login(loginRequest)
  }
  magicLogin(email: string){
    this.authService.magicLogin(email);
  }
  keycloakLogin(){
    window.location.href = 'https://login-keycloak.azurewebsites.net/auth/realms/bezbednost/protocol/openid-connect/auth' +
        '?response_type=token' +
        '&client_id=bezbednost' +
        '&redirect_uri=https://localhost:4200/keycloak-callback';
  }
}
