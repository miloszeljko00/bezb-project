import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsPage } from './pages/projects/projects.page';
import { ProjectEmployeesPage } from './pages/project-employees-page/project-employees.page';

const routes: Routes = [
  { path: '', component: ProjectsPage },
  { path: ':projectId/employees', component: ProjectEmployeesPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
