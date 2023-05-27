import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserProfile } from 'src/app/pages/profile/models/userProfile';
import { Designation } from 'src/app/pages/register/models/Designation';
import { SelectOption } from 'src/app/shared/ui/input/components/select-field/select-field.component';

@Component({
  templateUrl: './create-project.dialog.html',
  styleUrls: ['./create-project.dialog.scss']
})
export class CreateProjectDialog {

  constructor(public dialogRef: MatDialogRef<CreateProjectDialog>) { }

  manager: any;
  name: any;
  duration: any;
  managerOptions: SelectOption[] = [
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
        Designation.ProjectManager),
        displayValue: "John Doe"
    }
  ]

  create(){
    this.dialogRef.close({ name: this.name, duration: this.duration, manager: this.manager });
  }
}
