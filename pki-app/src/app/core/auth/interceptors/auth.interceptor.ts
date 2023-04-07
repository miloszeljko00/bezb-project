import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    const excludedPaths = [
      '/api/auth/actions/login',
    ];

    const isExcluded = excludedPaths.some(path => request.url.includes(path));

    if (!isExcluded) {
      const authToken = this.authService.getToken()

      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });

      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403 || error.status === 401) {
            this.authService.clearAuth()
            window.location.href = '/login'
          }
          return throwError(() => error)
        })
      )
    }

    return next.handle(request)
  }
}