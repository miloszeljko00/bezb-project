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
export class PermissionService {

  private permissions$ = new BehaviorSubject<Permission[]>([]);

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  fetchPermissions() {
    this.http.get<Permission[]>(environment.apiUrl + '/api/permissions').subscribe({
      next: (response: Permission[]) => this.permissions$.next(response),
      error: (error: HttpErrorResponse) => this.toastr.error(error.message)
    })
  }
  getPermissionsObservable() {
    return this.permissions$.asObservable()
  }
}
