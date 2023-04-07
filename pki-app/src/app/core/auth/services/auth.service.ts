import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../dtos/login-request';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../dtos/login-response';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: User | null = null;
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    const user = window.sessionStorage.getItem('user');
    const token = window.sessionStorage.getItem('token');
    if(!user) return;
    if(!token) return;

    this.user = JSON.parse(user);
    this.token = token;
   }

  login(loginRequest: LoginRequest) {
    this.http.post<LoginResponse>(environment.apiUrl+"/api/auth/actions/login", loginRequest).subscribe({
      next: (response) => {
        this.token = response.token;
        window.sessionStorage.setItem('token', this.token);

        this.user = this.extractUser(this.token);
        window.sessionStorage.setItem('user', JSON.stringify(this.user));

        this.toastr.success('Login successful.', "Login Success")
        window.location.href = '/';
      },
      error: (error: Error) => {
        this.toastr.error("Invalid credentials.", "Login Failed")
      }
    });
  }

  logout() {
    return this.http.get<LoginResponse>(environment.apiUrl+"/api/auth/actions/logout").subscribe({
      next: (response) => {
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('user');
        window.location.href = '/';
      },
      error: (error: Error) => {
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('user');
        window.location.href = '/';
      }
    });
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return this.user != null && this.token != null
  }

  isAdmin() {
    return this.user != null && this.user.roles.includes('ROLE_ADMIN');
  }
  isCertificateAuthority() {
    return this.user != null && this.user.roles.includes('ROLE_CERTIFICATE_AUTHORITY');
  }
  isEntity() {
    return this.user != null && this.user.roles.includes('ROLE_ENTITY');
  }

  private extractUser(token: string) {
        const decodedToken: Token = jwtDecode(token);
        const authorities = decodedToken.authorities.map((auth: any) => auth.authority);
        return new User(decodedToken.sub, authorities);
  }
}
