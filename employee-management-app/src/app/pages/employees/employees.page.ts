import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPage {
  
  displayedColumns = ['id', 'firstName', 'lastName', 'country', 'city', 'street', 'email', 'phone', 'actions'];
  employees$ = this.userService.getUsers()

  constructor(
    private userService: UserService,
    private toastr: ToastrService) {}

  enableAccount(user: any) {
    this.userService.enableUser(user.account.id).subscribe({
      next: () => this.handleEnableAccountSuccess(user),
      error: () => this.handleEnableAccountError(user)
    })
  }
  
  disableAccount(user: any) {
    this.userService.disableUser(user.account.id).subscribe({
      next: () => this.handleDisableAccountSuccess(user),
      error: () => this.handleDisableAccountError(user)
    })
  }

  private handleEnableAccountSuccess(user: any): void {
    this.toastr.success(`Account for: [${user.account.email}] is enabled!`);
    user.account.enabled = true
  }
  private handleDisableAccountSuccess(user: any): void {
    this.toastr.success(`Account for: [${user.account.email}] is disabled!`);
    user.account.enabled = false
  }
  private handleEnableAccountError(user: any): void {
    this.toastr.error(`Error enabling account for: [${user.account.email}]!`);
  }
  private handleDisableAccountError(user: any): void {
    this.toastr.error(`Error enabling account for: [${user.account.email}]!`);
  }
}
