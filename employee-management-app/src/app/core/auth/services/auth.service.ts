import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../dtos/login-request';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../dtos/login-response';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccessToken } from '../models/access-token';
import { Subject, firstValueFrom } from 'rxjs';
import { LogoutRequest } from '../dtos/logout-request';
import { RefreshAccessTokenRequest } from '../dtos/refresh-access-token-request';
import { RefreshAccessTokenResponse } from '../dtos/refresh-access-token-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$: Subject<User|null> = new Subject();
  private user: User|null = null

  private accessToken$: Subject<string|null> = new Subject();
  private accessToken: string|null = null

  private refreshToken$: Subject<string|null> = new Subject();
  private refreshToken: string|null = null

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    this.loadAuth()

    if(this.accessTokenValid()){
      this.clearAuthAndRedirectHome()
    }
   }

  

  login(loginRequest: LoginRequest) {
    this.http.post<LoginResponse>(environment.apiUrl+"/api/auth/actions/login", loginRequest).subscribe({
      next: (response) => {
        this.setAuth(response)
        this.toastr.success('Login successful.', "Login Success")
        this.redirectHome();
      },
      error: (error: Error) => {
        this.toastr.error("Invalid credentials.", "Login Failed")
      }
    })
  }
  async refreshAccessToken(refreshAccessTokenRequest: RefreshAccessTokenRequest) {
    try{
      const response = await firstValueFrom(this.http.post<RefreshAccessTokenResponse>(environment.apiUrl+"/api/auth/actions/refresh-access-token", refreshAccessTokenRequest))
      this.setAccessToken(response.accessToken)

    }catch(err){
      this.clearAuthAndRedirectHome()
    }
  }

  logout() {
    const request = new LogoutRequest(this.accessToken, this.refreshToken)
    this.http.post(environment.apiUrl+"/api/auth/actions/logout", request).subscribe({
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
    this.loadAccessToken()
    this.loadRefreshToken()
  }

  setAuth(tokens: {accessToken: string, refreshToken: string}) {
    this.setUser(tokens.accessToken)
    this.setAccessToken(tokens.accessToken)
    this.setRefreshToken(tokens.refreshToken)
  }

  clearAuth() {
    this.clearUser()
    this.clearAccessToken()
    this.clearRefreshToken()
  }

  getUser() {
    return this.user
  }
  getUserObservable() {
    return this.user$
  }
  async getAccessToken() {
    if(!this.accessToken) return null
    const accessToken: AccessToken = jwtDecode(this.accessToken);
    const expirationDate = new Date((accessToken.exp as number ) * 1000)
    const currentDate = new Date()
    if(expirationDate < currentDate) {
      if(!this.refreshToken) return null
      await this.refreshAccessToken(new RefreshAccessTokenRequest(this.refreshToken))
    }
    return this.accessToken;
  }
  getAccessTokenObservable() {
    return this.accessToken$;
  }
  getRefreshToken() {
    return this.refreshToken;
  }
  getRefreshTokenObservable() {
    return this.refreshToken$;
  }
  isAuthenticated() {
    return this.user != null && this.refreshToken != null && this.accessToken != null && this.accessTokenValid()
  }
  
  clearAuthAndRedirectHome() {
    this.clearAuth()
    this.redirectHome()
  }

  private extractUser(token: string) {
        const decodedToken: AccessToken = jwtDecode(token)
        const roles = decodedToken.roles.map((auth: any) => auth)
        const permissions = decodedToken.authorities.map((auth: any) => auth.authority)
        return new User(decodedToken.sub, roles, permissions)
  }

  private accessTokenValid(): boolean {
    if(!this.accessToken) return false
    const decodedToken: AccessToken = jwtDecode(this.accessToken)

    const expirationDate = new Date((decodedToken.exp as number ) * 1000)
    const currentDate = new Date()

    return currentDate < expirationDate
  }

  private loadUser() {
    const user = window.sessionStorage.getItem('user')
    if(!user) return

    this.user = JSON.parse(user)
    this.user$.next(this.user)
  }

  private loadAccessToken() {
    const accessToken = window.sessionStorage.getItem('accessToken')
    if(!accessToken) return

    this.accessToken = accessToken
    this.accessToken$.next(this.accessToken)
  }

  private loadRefreshToken() {
    const refreshToken = window.sessionStorage.getItem('refreshToken')
    if(!refreshToken) return

    this.refreshToken = refreshToken
    this.refreshToken$.next(this.refreshToken)
  }

  private setUser(accessToken: string) {
    this.user = this.extractUser(accessToken)
    window.sessionStorage.setItem('user', JSON.stringify(this.user))
    this.user$.next(this.user)
  }

  private setAccessToken(accessToken: string) {
    this.accessToken = accessToken
    window.sessionStorage.setItem('accessToken', this.accessToken)
    this.accessToken$.next(this.accessToken)
  }
  private setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken
    window.sessionStorage.setItem('refreshToken', this.refreshToken)
    this.accessToken$.next(this.refreshToken)
  }
  private redirectHome() {
    this.router.navigate(['']);
  }

  private clearUser() {
    window.sessionStorage.removeItem('user')
    this.user = null
    this.user$.next(this.user)
  }
  
  private clearAccessToken() {
    window.sessionStorage.removeItem('accessToken')
    this.accessToken = null
    this.accessToken$.next(this.accessToken)
  }

  private clearRefreshToken() {
    window.sessionStorage.removeItem('refreshToken')
    this.refreshToken = null
    this.refreshToken$.next(this.refreshToken)
  }
}
