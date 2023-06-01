import { Component } from '@angular/core';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPage {
  
  displayedColumns = ['id', 'firstName', 'lastName', 'country', 'city', 'street', 'email', 'phone'];
  employees$ = this.userService.getUsers()

  constructor(private userService: UserService) {}
}
