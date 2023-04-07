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
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$: Subject<User|null> = new Subject();
  private user: User|null = null

  private token$: Subject<string|null> = new Subject();
  private token: string|null = null

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    this.loadAuth()

    if(this.tokenValid()){
      this.clearAuthAndRedirectHome()
    }
   }

  

  login(loginRequest: LoginRequest) {
    this.http.post<LoginResponse>(environment.apiUrl+"/api/auth/actions/login", loginRequest).subscribe({
      next: (response) => {
        this.setAuth(response.token)
        this.toastr.success('Login successful.', "Login Success")
        this.redirectHome();
      },
      error: (error: Error) => {
        this.toastr.error("Invalid credentials.", "Login Failed")
      }
    })
  }

  logout() {
    this.http.get<LoginResponse>(environment.apiUrl+"/api/auth/actions/logout").subscribe({
      next: (response) => {
        this.clearAuthAndRedirectHome()
      },
      error: (error: Error) => {
        this.clearAuthAndRedirectHome()
      }
    })
  }

  loadAuth() {
    this.loadUser()
    this.loadToken()
  }

  setAuth(token: string) {
    this.setUser(token)
    this.setToken(token)
  }

  clearAuth() {
    this.clearUser()
    this.clearToken()
  }

  getUser() {
    return this.user
  }
  getUserObservable() {
    return this.user$
  }
  getToken() {
    return this.token;
  }
  getTokenObservable() {
    return this.token$;
  }
  isAuthenticated() {
    return this.user != null && this.token != null && this.tokenValid()
  }

  isAdmin() {
    return this.user != null && this.user.roles.includes('ROLE_ADMIN')
  }

  isCertificateAuthority() {
    return this.user != null && this.user.roles.includes('ROLE_CERTIFICATE_AUTHORITY')
  }

  isEntity() {
    return this.user != null && this.user.roles.includes('ROLE_ENTITY')
  }
  
  private clearAuthAndRedirectHome() {
    this.clearAuth()
    this.redirectHome()
  }

  private extractUser(token: string) {
        const decodedToken: Token = jwtDecode(token)
        const authorities = decodedToken.authorities.map((auth: any) => auth.authority)
        return new User(decodedToken.sub, authorities)
  }

  private tokenValid(): boolean {
    if(!this.token) return true
    const decodedToken: Token = jwtDecode(this.token)

    const expirationDate = new Date((decodedToken.exp as number ) * 1000)
    const currentDate = new Date()

    return currentDate > expirationDate
  }

  private loadUser() {
    const user = window.sessionStorage.getItem('user')
    if(!user) return

    this.user = JSON.parse(user)
    this.user$.next(this.user)
  }

  private loadToken() {
    const token = window.sessionStorage.getItem('token')
    if(!token) return

    this.token = token
    this.token$.next(this.token)
  }

  
  private setUser(token: string) {
    this.user = this.extractUser(token)
    window.sessionStorage.setItem('user', JSON.stringify(this.user))
    this.user$.next(this.user)
  }

  private setToken(token: string) {
    this.token = token
    window.sessionStorage.setItem('token', this.token)
    this.token$.next(this.token)
  }

  private redirectHome() {
    this.router.navigate(['']);
  }

  private clearUser() {
    window.sessionStorage.removeItem('user')
    this.user = null
    this.user$.next(this.user)
  }
  
  private clearToken() {
    window.sessionStorage.removeItem('token')
    this.token = null
    this.token$.next(this.token)
  }
}
