import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, concatAll, map, switchMap, tap, toArray } from 'rxjs';
import { ProjectService } from 'src/app/core/services/project.service';
import { UserProject } from 'src/app/pages/profile/models/userProject';
import { AddEmployeeDialog } from '../../dialogs/add-employee-dialog/add-employee.dialog';

@Component({
  templateUrl: './project-employees.page.html',
  styleUrls: ['./project-employees.page.scss']
})
export class ProjectEmployeesPage {
 
  displayedColumns = ['userId','user', 'project', 'startDate', 'endDate','description', 'actions'];
  projectId!: string;
  projectId$: Observable<string> = this.route.params.pipe(
    map(params => {this.projectId = params.projectId; return params.projectId})
  )
  employeesOnProject$ = this.projectId$.pipe(
    switchMap(projectId => this.projectService.getEmployeesByProjectId(projectId))
  )
  employeesOnProject: UserProject[] = [];
  @ViewChild('table') table!: MatTable<UserProject>;


  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private dialog: MatDialog) {}

  removeEmployeeFromProject(userProject: UserProject) {
    const result = confirm("Are you sure you want to remove this user from project?");
    if(!result) return;
    this.projectService.removeUserFromProject(this.projectId, userProject.id).subscribe({
      next: (result) => {
        if(result) {
          this.toastr.success("User removed from project successfully!")
          this.employeesOnProject = this.employeesOnProject.filter(employee => employee.id !== userProject.id)
          this.table.renderRows()
        }else this.toastr.error("Error has occurred while removing user from project!")
      }
    });
  }
  ngOnInit() {
    this.employeesOnProject$.subscribe((employees) => {
      this.employeesOnProject = employees;
    })
  }
  openAddEmployeeToProjectDialog() {
    const dialogRef = this.dialog.open(AddEmployeeDialog, {
      restoreFocus: false,
      autoFocus: false,
      data: { projectId: this.projectId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.projectService.addUserToProject(result, this.projectId).subscribe({
          next: (result: UserProject) => {
            if(result) {
              this.toastr.success("User added to project successfully!")
              this.employeesOnProject = [...this.employeesOnProject, result]
              this.table.renderRows()
            }else this.toastr.error("Error has occurred while adding user to project!")
          }
        });
      }
    })
  }
}
