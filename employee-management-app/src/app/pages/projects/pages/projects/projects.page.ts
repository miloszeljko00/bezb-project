import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from 'src/app/core/services/project.service';
import { ToastrService } from 'ngx-toastr';
import { MatTable } from '@angular/material/table';
import { Project } from 'src/app/pages/profile/models/project';
import { CreateProjectDialog } from '../../dialogs/create-project-dialog/create-project.dialog';
import { Router } from '@angular/router';

@Component({
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss']
})
export class ProjectsPage {
  projects$ = this.projectService.getProjectsObservable()
  displayedColumns = ['id', 'name', 'duration', 'manager','managerId', 'actions'];

  @ViewChild('table') table!: MatTable<Project>;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  )  {}

  ngOnInit() {
    this.projectService.fetchProjects()
  }
  
  openCreateProjectDialog() {
    const dialogRef = this.dialog.open(CreateProjectDialog, {
      restoreFocus: false,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.projectService.createProject(result.name, parseFloat(result.duration), result.manager.id).subscribe({
          next: (result) => {
            if(result) {
              this.toastr.success("Project created successfully!")
              this.table.renderRows()
            }else this.toastr.error("Error has occurred while creating project!")
          }
        });
      }
    })
  }

  deleteProject(project: Project) {
    const result = confirm("Are you sure you want to delete this project?");
    if(!result) return;
    this.projectService.deleteProject(project.id).subscribe({
      next: (result) => {
        if(result) {
          this.toastr.success("Project deleted successfully!")
          this.table.renderRows()
        }else this.toastr.error("Error has occurred while deleting project!")
      }
    });
  }
  goToProjectEmployeesPage(project: Project) {
    this.router.navigate(['projects', project.id, 'employees'])
  }
}
