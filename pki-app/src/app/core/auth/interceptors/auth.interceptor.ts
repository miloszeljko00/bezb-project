import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    const excludedPaths = [
      '/api/auth/actions/login',
    ];

    const isExcluded = excludedPaths.some(path => request.url.includes(path));

    if (!isExcluded) {
      const authToken = this.authService.getToken();

      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });

      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}