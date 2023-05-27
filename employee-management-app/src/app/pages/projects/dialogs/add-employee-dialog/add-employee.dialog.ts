import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserProfile } from 'src/app/pages/profile/models/userProfile';
import { Designation } from 'src/app/pages/register/models/Designation';
import { SelectOption } from 'src/app/shared/ui/input/components/select-field/select-field.component';

@Component({
  selector: 'app-add-employee-dialog',
  templateUrl: './add-employee.dialog.html',
  styleUrls: ['./add-employee.dialog.scss']
})
export class AddEmployeeDialog {
  constructor(public dialogRef: MatDialogRef<AddEmployeeDialog>) { }

  employee: any

  employeeOptions: SelectOption[] = [
    {
      value: new UserProfile(
        "1",
        "john.doe@example.com",
        "password",
        "John",
        "Doe",
        "123 Main St",
        "USA",
        "New York",
        "555-1234",
        Designation.Engineer),
        displayValue: "John Doe"
    }
  ]

  create(){
    this.dialogRef.close(this.employee);
  }
}
