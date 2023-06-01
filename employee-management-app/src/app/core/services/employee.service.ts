import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from 'src/app/pages/profile/models/userProfile';
import { BehaviorSubject, of } from 'rxjs';
import { Designation } from 'src/app/pages/register/models/Designation';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class EmployeeService {
    
    constructor(private http: HttpClient) { }
 
    getEmployees() { 
        return this.http.get<any[]>(environment.apiUrl + `/api/profile/users/all`);
    }
    
}