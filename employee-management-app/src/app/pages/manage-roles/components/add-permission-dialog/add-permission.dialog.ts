import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Permission } from 'src/app/core/models/permission';
import { Role } from 'src/app/core/models/role';

@Component({
  selector: 'app-add-permission.dialog',
  templateUrl: './add-permission.dialog.html',
  styleUrls: ['./add-permission.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPermissionDialog {

  permissions$: Observable<Permission[]>;
  role: Role

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {permissions$: Observable<Permission[]>, role: Role},
    public dialogRef: MatDialogRef<AddPermissionDialog>
  ) {
    this.permissions$ = data.permissions$
    this.role = data.role
  }

  addPermission(permission: Permission) {
    this.dialogRef.close({ permission: permission, role: this.role })
  }

}
