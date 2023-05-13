export class User {
  email: string;
  roles: string[];
  permissions: string[];

  constructor(email: string, roles: string[], permissions: string[]) {
    this.email = email
    this.roles = roles
    this.permissions = permissions
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes("ROLE_" + permission)
  }
  hasRole(role: string): boolean {
    return this.roles.includes(role)
  }
}