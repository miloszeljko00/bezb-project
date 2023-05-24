import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Role } from '../models/role';
import { BehaviorSubject, of } from 'rxjs';
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

  getAllRolesObservable() {
    return this.roles$.asObservable()
  }
  
  addPermission(roleId: string, permission: Permission) {
    let roles = this.roles$.getValue()
    roles.forEach(role => {
      if(role.id === roleId) role.permissions.push(permission)
    })
    // TODO: API call to backend
    this.http.put(environment.apiUrl + '/api/roles/' + roleId + '/actions/add-permission', permission).subscribe({
      next: () => {

      },
      error: (error: HttpErrorResponse) => this.toastr.error(error.message)
    })
    this.roles$.next(roles)
    return of(true)
  }
  removePermission(roleId: string, permission: Permission) {
    let roles = this.roles$.getValue()
    roles.forEach(role => {
      if(role.id === roleId){
        role.permissions = role.permissions.filter(permission => permission.id !== permission.id)
      }
    })
    // TODO: API call to backend
    this.http.put(environment.apiUrl + '/api/roles/' + roleId + '/actions/remove-permission', permission).subscribe({
      next: () => {

      },
      error: (error: HttpErrorResponse) => this.toastr.error(error.message)
    })
    this.roles$.next(roles)
    return of(true)
  }
}
