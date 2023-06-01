import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { filter, map } from 'rxjs';
import { Permission } from 'src/app/core/models/permission';
import { Role } from 'src/app/core/models/role';
import { PermissionService } from 'src/app/core/services/permission.service';
import { RoleService } from 'src/app/core/services/role.service';
import { AddPermissionDialog } from './components/add-permission-dialog/add-permission.dialog';
import { auto } from '@popperjs/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';



@Component({
  templateUrl: './manage-roles.page.html',
  styleUrls: ['./manage-roles.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageRolesPage {
  panelOpenState = false;
  roles$ = this.roleService.getRolesObservable()
  permissions$ = this.permissionService.getPermissionsObservable()

  user: any;

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private authService: AuthService ) {
      this.user = this.authService.getUser()
      console.log('%cMyProject%cline:33%cthis.user', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px', this.user)
    }

  ngOnInit() {
    this.roleService.fetchRoles()
    this.permissionService.fetchPermissions()
  }

  openAddPermissionDialog(role: Role) {
    let missingPermissions$ = this.getMissingPermissionsForRole(role)

    const dialogRef = this.dialog.open(AddPermissionDialog, {
      width: auto,
      height: auto,
      data: {permissions$: missingPermissions$, role: role},
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe({
      next: (result: { permission: Permission, role: Role }) => {
        if(!result) return;
        this.addPermission(result.role.id, result.permission)
      },
      error: (error:any) => {
        this.toastr.error(error.message);
      }
    })
  }
  addPermission(roleId: string, permission: Permission): void {
    this.roleService.addPermission(roleId, permission).subscribe({
      next: (result) => {
        if(result) this.toastr.success("Permission added successfully!")
          else this.toastr.error("Error has occurred while adding permission!")
      },
      error: () => {
        this.toastr.error("Error has occurred while adding permission!")
      }
    })
  }

  removePermission(role: Role, permission: Permission): void {
    this.roleService.removePermission(role.id, permission).subscribe({
      next: (response) => {
        if(response) this.toastr.success("Permission removed successfully!")
        else this.toastr.error("Error has occurred while removing permission!")
      },
      error: () => {
        this.toastr.error("Error has occurred while removing permission!")
      }
    })
  }

  private getMissingPermissionsForRole(role: Role) {
    return this.permissions$.pipe(
      map(permissions => permissions.filter(
        permission => !role.permissions.some(
          ownedPermission => ownedPermission.id === permission.id
        )
      )
      )
    );
  }
}
