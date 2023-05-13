export class LogoutRequest {
  accessToken: string|null;
  refreshToken: string|null;

  constructor(accessToken: string|null, refreshToken: string|null) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }
}