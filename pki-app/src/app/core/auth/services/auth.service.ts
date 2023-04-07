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

  private user: User | null = null
  private token: string | null = null

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    const user = window.sessionStorage.getItem('user')
    const token = window.sessionStorage.getItem('token')
    if(!user) return
    if(!token) return

    this.user = JSON.parse(user)
    this.token = token

    console.log('%cMyProject%cline:29%cthis.tokenExpired(this.token)', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px', this.tokenExpired(this.token))
    if(this.tokenExpired(this.token)){
      this.clearAuth()
      this.router.navigate([''])
    }
   }

  login(loginRequest: LoginRequest) {
    this.http.post<LoginResponse>(environment.apiUrl+"/api/auth/actions/login", loginRequest).subscribe({
      next: (response) => {
        this.token = response.token
        window.sessionStorage.setItem('token', this.token)

        this.user = this.extractUser(this.token)
        window.sessionStorage.setItem('user', JSON.stringify(this.user))

        this.toastr.success('Login successful.', "Login Success")
        this.router.navigate([''])
      },
      error: (error: Error) => {
        this.toastr.error("Invalid credentials.", "Login Failed")
      }
    })
  }

  logout() {
    this.http.get<LoginResponse>(environment.apiUrl+"/api/auth/actions/logout").subscribe({
      next: (response) => {
        this.clearAuth()
        this.router.navigate([''])
      },
      error: (error: Error) => {
        this.clearAuth()
        this.router.navigate([''])
      }
    })
  }
  clearAuth() {
    this.clearUser()
    this.clearToken()
  }
  clearUser() {
    window.sessionStorage.removeItem('user')
    this.user = null
  }
  clearToken() {
    window.sessionStorage.removeItem('token')
    this.token = null
  }

  getUser() {
    return this.user
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return this.user != null && this.token != null
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

  private extractUser(token: string) {
        const decodedToken: Token = jwtDecode(token)
        const authorities = decodedToken.authorities.map((auth: any) => auth.authority)
        return new User(decodedToken.sub, authorities)
  }

  private tokenExpired(token: string): boolean {
    const decodedToken: Token = jwtDecode(token)

    const expirationDate = new Date((decodedToken.exp as number ) * 1000)
    const currentDate = new Date()

    return currentDate > expirationDate
  }
}
