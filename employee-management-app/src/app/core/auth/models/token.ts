export class Token {
  sub: string;
  roles: string[];
  authorities: string[];
  iat: number;
  exp: number;

  constructor(sub: string, authorities: string[], iat: number, exp: number, roles: string[]) {
    this.sub = sub
    this.authorities = authorities
    this.iat = iat
    this.exp = exp
    this.roles = roles
  }
}