import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Role } from '../models/role';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) {}

  getAllRoles() {
    return of([
      {
        id: '6caccf41-5c54-401d-87b4-05af4d629fda',
        name: 'Administrator',
        permissions: [
          {
            id: 'eaf64bf2-0604-4d44-88db-f14712e7c7ad',
            name: 'TEST'
          },
          {
            id: '84e5cc62-2b3b-4332-89ae-ba74f96f614a',
            name: 'GET-PERMISSIONS'
          },
          {
            id: '781a137c-e1b2-4f3b-8eed-b1d429f348fe',
            name: 'GET-ROLES'
          },
          {
            id: '8557bd2e-5e5c-4358-92d1-96331bd72af4',
            name: 'UPDATE-ROLE-PERMISSIONS'
          }
        ]
      },
      {
        id: '9a4d712a-2882-4278-b981-76d339fc6894',
        name: 'Software Engineer',
        permissions: [
          {
            id: 'eaf64bf2-0604-4d44-88db-f14712e7c7ad',
            name: 'TEST'
          },
        ]
      },
      {
        id: '3ad3288e-1fad-45cc-aa7f-8660ce4af4e4',
        name: 'HR Manager',
        permissions: [
          {
            id: 'eaf64bf2-0604-4d44-88db-f14712e7c7ad',
            name: 'TEST'
          },
        ]
      },
      {
        id: 'b45881cf-a8d2-4bdf-bbb1-183dcbabbbfc',
        name: 'Project Manager',
        permissions: [
          {
            id: 'eaf64bf2-0604-4d44-88db-f14712e7c7ad',
            name: 'TEST'
          },
        ]
      }
    ] as Role[])
  }

  updateRolePermissions(role: Role) {
    console.log('%cMyProject%cline:72%crole', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px', role)
    return of({ result: true})
  }
}
