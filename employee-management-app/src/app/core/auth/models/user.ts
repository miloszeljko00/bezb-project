export class User {
  email: string;
  roles: string[];

  constructor(email: string, roles: string[]) {
    this.email = email;
    this.roles = roles;
  }
}