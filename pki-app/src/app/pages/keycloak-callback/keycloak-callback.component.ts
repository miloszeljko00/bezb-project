import { Component } from '@angular/core';

@Component({
  selector: 'app-keycloak-callback',
  templateUrl: './keycloak-callback.component.html',
  styleUrls: ['./keycloak-callback.component.scss']
})
export class KeycloakCallbackComponent {

  ngOnInit() {
    const token = this.getAccessTokenFromUrl();
    console.log(token);
  }

  private getAccessTokenFromUrl(): string|null {
    const hash = window.location.hash.substr(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
  }
}
