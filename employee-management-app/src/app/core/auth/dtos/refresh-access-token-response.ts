export class RefreshAccessTokenResponse {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}