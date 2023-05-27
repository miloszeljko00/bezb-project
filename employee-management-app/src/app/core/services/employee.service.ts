import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from 'src/app/pages/profile/models/userProfile';
import { BehaviorSubject, of } from 'rxjs';
import { Designation } from 'src/app/pages/register/models/Designation';

@Injectable({providedIn: 'root'})
export class EmployeeService {
    
    employees$ = new BehaviorSubject<UserProfile[]>([
        new UserProfile(
            "1",
            "john.doe@example.com",
            "password",
            "John",
            "Doe",
            "123 Main St",
            "USA",
            "New York",
            "555-1234",
            Designation.Engineer)
    ] as UserProfile[])
    
    constructor(private http: HttpClient) { }
 
    getEmployeesObservable() { 
        return this.employees$.asObservable()
    }
    
}