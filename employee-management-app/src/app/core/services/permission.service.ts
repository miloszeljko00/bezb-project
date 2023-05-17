import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Role } from '../models/role';
import { of } from 'rxjs';
import { Permission } from '../models/permission';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) {}

  getAllPermissions() {
    return of([
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
    ] as Permission[])
  }

}
