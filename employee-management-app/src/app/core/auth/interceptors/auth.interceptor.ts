import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, flatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError, Observable, from } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const excludedPaths = [
      '/api/auth/actions/login',
      '/api/auth/actions/refresh-access-token',
      '/login/magicLoginCallback'
    ];

    const isExcluded = excludedPaths.some(path => request.url.includes(path))

    if (isExcluded) {
      return next.handle(request);
    }

    return from(this.authService.getAccessToken()).pipe(
      flatMap(accessToken => {
        if (!accessToken) {
          this.authService.clearAuthAndRedirectHome();
          return next.handle(request);
        }
        const authRequest = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
        });
        return next.handle(authRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.authService.clearAuth();
              this.router.navigate(['']);
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}
