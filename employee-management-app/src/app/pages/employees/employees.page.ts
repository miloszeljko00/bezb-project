import { Component } from '@angular/core';
import { EmployeeService } from 'src/app/core/services/employee.service';

@Component({
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPage {
  
  displayedColumns = ['id', 'firstName', 'lastName', 'country', 'city', 'street', 'email', 'phone'];
  employees$ = this.employeeService.getEmployeesObservable()

  constructor(private employeeService: EmployeeService) {}
}
