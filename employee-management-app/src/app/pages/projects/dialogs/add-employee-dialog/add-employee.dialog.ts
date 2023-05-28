import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { combineLatest, filter, map } from 'rxjs';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { UserService } from 'src/app/core/services/user.service';
import { UserProfile } from 'src/app/pages/profile/models/userProfile';
import { Designation } from 'src/app/pages/register/models/Designation';
import { SelectOption } from 'src/app/shared/ui/input/components/select-field/select-field.component';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-add-employee-dialog',
  templateUrl: './add-employee.dialog.html',
  styleUrls: ['./add-employee.dialog.scss']
})
export class AddEmployeeDialog {

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeDialog>,
     private userService: UserService,
     private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  employee: any
  from: Date|null = null
  to: Date|null = null
  description: string = ''


  employees$ = this.employeeService.getEmployees();

  employeesOnProject$ = this.userService.getUsersByProject(this.data.projectId)

  employeeOptions$ = combineLatest([this.employees$, this.employeesOnProject$]).pipe(
    map(([employees, employeesOnProject]) => {
      const employeeIdsOnProject = employeesOnProject.map(employee => employee.user!.id);
      return employees.filter(employee => !employeeIdsOnProject.includes(employee.account.id));
    }),
    map(employees => employees.map(
      employee => ({ value: employee, displayValue: `${employee.firstName} ${employee.lastName}` } as SelectOption)
    ))
  );

  ngOnInit(): void {
  }
  create(){
    this.dialogRef.close({userId: this.employee.account.id, userEmail: this.employee.account.email, from: this.from, to: this.to, description: this.description});
  }
}
