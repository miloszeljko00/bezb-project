import { Component } from '@angular/core';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { UserService } from 'src/app/core/services/user.service';
import {Router} from "@angular/router";

@Component({
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPage {

  displayedColumns = ['id', 'firstName', 'lastName', 'country', 'city', 'street', 'email', 'phone'];
  employees$ = this.userService.getUsers()

  constructor(private userService: UserService, private router: Router) {}

  Search() {
    this.router.navigate(['/account/search']);
  }
}
