import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Role } from '../models/role';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Permission } from '../models/permission';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private roles$ = new BehaviorSubject<Role[]>([])

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  fetchRoles() {
    this.http.get<Role[]>(environment.apiUrl + '/api/roles').subscribe({
      next: (response: Role[]) => this.roles$.next(response),
      error: (error: HttpErrorResponse) => this.toastr.error(error.message)
    })
  }

  getRolesObservable() {
    return this.roles$.asObservable()
  }
  getRoles(): Role[] {
    return this.roles$.getValue();
  }
  getRole(roleId: string): Role|undefined {
    return this.getRoles().find(r => r.id === roleId);
  }
  
  addPermission(roleId: string, permission: Permission): Observable<boolean> {
    let roles: Role[] = JSON.parse(JSON.stringify(this.getRoles()));
    let role = roles.find(r => r.id === roleId);

    if (!role) {
      return throwError(() => `Role with ID ${roleId} not found`);
    }
    role.permissions.push(permission);
  
    return this.http.put<boolean>(environment.apiUrl + '/api/roles/' + roleId + '/actions/add-permission', permission).pipe(
      map(() => {
        
        roles = this.getRoles()
        role = roles.find(r => r.id === roleId);
        if(!role) false
        role!.permissions.push(permission);
        this.roles$.next(roles);
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        return of(false);
      })
    );
  }
  removePermission(roleId: string, permission: Permission): Observable<boolean> {
    let roles: Role[] = JSON.parse(JSON.stringify(this.getRoles()));
    let role = roles.find(r => r.id === roleId);

    if (!role) {
      return throwError(() => `Role with ID ${roleId} not found`);
    }
    role.permissions = role.permissions.filter(p => p.id !== permission.id);
  
    return this.http.put<boolean>(`${environment.apiUrl}/api/roles/${roleId}/actions/remove-permission`, permission).pipe(
      map(() => {
        roles = this.getRoles()
        role = roles.find(r => r.id === roleId);
        if(!role) false
        role!.permissions = role!.permissions.filter(p => p.id !== permission.id);
        this.roles$.next(roles);
        return true
      }),
      catchError((error: HttpErrorResponse) => {
        return of(false);
      })
    );
  }
}
