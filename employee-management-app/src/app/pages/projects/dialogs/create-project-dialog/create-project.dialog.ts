import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { ProjectService } from 'src/app/core/services/project.service';
import { UserService } from 'src/app/core/services/user.service';
import { UserProfile } from 'src/app/pages/profile/models/userProfile';
import { Designation } from 'src/app/pages/register/models/Designation';
import { SelectOption } from 'src/app/shared/ui/input/components/select-field/select-field.component';

@Component({
  templateUrl: './create-project.dialog.html',
  styleUrls: ['./create-project.dialog.scss']
})
export class CreateProjectDialog {

  constructor(public dialogRef: MatDialogRef<CreateProjectDialog>,
    private userService: UserService) { }

  manager: any;
  name: any;
  duration: any;
  managerOptions$: Observable<SelectOption[]> = this.userService.getProjectManagers().pipe(
    map((users: UserProfile[]) => users.map((user: UserProfile) => { 
      let selectOption: SelectOption ={
        value: user,
        displayValue: user.firstName + " " + user.lastName 
      }
      return selectOption;
    }))
  )

  create(){
    this.dialogRef.close({ name: this.name, duration: this.duration, manager: this.manager });
  }
}
