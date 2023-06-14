import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class EmployeeService {

    constructor(private http: HttpClient) { }

    getEmployees() {
        return this.http.get<any[]>(environment.apiUrl + `/api/profile/users/all`);
    }
   search(searchDto: any) {
    return this.http.get<any[]>(`https://localhost:443/api/profile/users/search`, searchDto);
  }
  headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  searchEmployee(searchDto: any):
    Observable<any> {return this.http.get<any>('https://localhost:443/api/profile/users/search' +'/'
      + searchDto.email + '/'
      + searchDto.firstName +'/'
      + searchDto.lastName+'/'
      + searchDto.from +'/'
    + searchDto.to, {headers: this.headers});
  }
  searchEmployeeWithoutEmail(searchDto: any):
    Observable<any> {return this.http.get<any>('https://localhost:443/api/profile/users/search' +'/'
    + searchDto.firstName +'/'
    + searchDto.lastName+'/'
    + searchDto.from +'/'
    + searchDto.to, {headers: this.headers});
  }

  searchEmployeeByPeriod(searchDto: any):
    Observable<any> {return this.http.get<any>('https://localhost:443/api/profile/users/search' +'/'
    + searchDto.from +'/'
    + searchDto.to, {headers: this.headers});
  }

  searchEmployeeByEmail(searchDto: any):
    Observable<any> {return this.http.get<any>('https://localhost:443/api/profile/users/search' +'/'
    + searchDto.email + '/'
    + searchDto.from +'/'
    + searchDto.to, {headers: this.headers});
  }
}
