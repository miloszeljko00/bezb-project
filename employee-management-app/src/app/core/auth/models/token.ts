export class Token {
  sub: string;
  authorities: string[];
  iat: number;
  exp: number;

  constructor(sub: string, authorities: string[], iat: number, exp: number) {
    this.sub = sub;
    this.authorities = authorities;
    this.iat = iat;
    this.exp = exp;
  }
}