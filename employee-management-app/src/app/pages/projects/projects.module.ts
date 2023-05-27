import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { CreateProjectDialog } from './dialogs/create-project-dialog/create-project.dialog';
import { InputModule } from 'src/app/shared/ui/input/input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'src/app/shared/ui/button/button.module';
import { ProjectsPage } from './pages/projects/projects.page';
import { ProjectEmployeesPage } from './pages/project-employees-page/project-employees.page';
import { AddEmployeeDialog } from './dialogs/add-employee-dialog/add-employee.dialog';


@NgModule({
  declarations: [
    ProjectsPage,
    CreateProjectDialog,
    ProjectEmployeesPage,
    AddEmployeeDialog
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MaterialModule,
    InputModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule
  ]
})
export class ProjectsModule { }
