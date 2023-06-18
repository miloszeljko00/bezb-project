import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-keycloak-callback',
  templateUrl: './keycloak-callback.component.html',
  styleUrls: ['./keycloak-callback.component.scss']
})
export class KeycloakCallbackComponent {
  constructor(private authService: AuthService) { }
  token: string|null = null;
  ngOnInit() {
    this.token = this.getAccessTokenFromUrl();
    setTimeout(() => {
      this.loginViaKeycloak();
    }, 20000);
  }

  private getAccessTokenFromUrl(): string|null {
    const hash = window.location.hash.substr(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
  }

  private loginViaKeycloak() {
    if(this.token == null) return;
    this.authService.loginViaKeycloak({token: this.token});
  }
}
