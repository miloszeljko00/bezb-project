import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { filter, map } from 'rxjs';
import { Permission } from 'src/app/core/models/permission';
import { Role } from 'src/app/core/models/role';
import { PermissionService } from 'src/app/core/services/permission.service';
import { RoleService } from 'src/app/core/services/role.service';



@Component({
  templateUrl: './manage-roles.page.html',
  styleUrls: ['./manage-roles.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageRolesPage {
  panelOpenState = false;
  roles$ = this.roleService.getAllRoles()
  permissions$ = this.permissionService.getAllPermissions()

  constructor(
    private roleService: RoleService, 
    private permissionService: PermissionService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    
  }

  addPermission(role: Role): void {
    console.log('Open dialog with all permissions')
    let missingPermissions$ = this.permissions$.pipe(
      map(permissions => permissions.filter(
        permission => !role.permissions.some(
          ownedPermission => ownedPermission.id === permission.id
          )
        )
      )
    )
    missingPermissions$.subscribe({
      next: (permissions) => console.log(permissions)
    })
  }

  removePermission(role: Role, permission: Permission): void {
    const request: Role = {
      ...role,
      permissions: role.permissions.filter(p => p.id !== permission.id)
    } 
    this.roleService.updateRolePermissions(request).subscribe({
      next: (response) => {
        if(response.result) {
          role.permissions = request.permissions
          this.cdr.detectChanges()
        }else {
          this.toastr.error("Error has occurred while removing permission!")
        }
      },
      error: () => {
        this.toastr.error("Error has occurred while removing permission!")
      }
    })
  }
}
