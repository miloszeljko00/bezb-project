export class RefreshAccessTokenRequest {
  refreshToken: string;

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken
  }
}