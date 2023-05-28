import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Project } from 'src/app/pages/profile/models/project';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from 'src/app/pages/profile/models/userProfile';
import { Designation } from 'src/app/pages/register/models/Designation';
import { UserProject } from 'src/app/pages/profile/models/userProject';

@Injectable({providedIn: 'root'})
export class ProjectService {
    addUserToProject(result: any, projectId: string) {
      return of(new UserProject('999', result, new Project(projectId, undefined, "project 1", 10), new Date(), new Date(), 'description'))
    }
    removeUserFromProject(id: string) {
      return of(true)
    }
    deleteProject(id: string) {
        return this.http.delete(environment.apiUrl + "/api/projects/delete/" + id).pipe(
            map(() => {
                const projects = this.projects$.getValue()
                const index = projects.findIndex((project) => project.id === id)
                projects.splice(index, 1)
                this.projects$.next(projects)
                return true
            }
        ))
    }
    createProject(name: string, duration: number, managerId: string) {
      //TODO call backend
      return this.http.post<Project>(environment.apiUrl + "/api/projects/create", { managerId: managerId, name: name, duration: duration}).pipe(
        map((project: Project) => {
            const projects = this.projects$.getValue()
            projects.push(project)
            this.projects$.next(projects)
            return project
        }
      ))
    }
    private projects$ = new BehaviorSubject<Project[]>([])

    constructor(private http: HttpClient, private toastr: ToastrService) {}
  
    getEmployeesByProjectId(projectId: string): Observable<UserProject[]> {
        return of([
            new UserProject("1", new UserProfile(
                "2",
                "jane.doe@example.com",
                "password",
                "Jane",
                "Doe",
                "456 Elm St",
                "USA",
                "California",
                "555-5678",
                Designation.Engineer
              ), new Project('1', new UserProfile(
                "1",
                "john.doe@example.com",
                "password",
                "John",
                "Doe",
                "123 Main St",
                "USA",
                "New York",
                "555-1234",
                Designation.ProjectManager), 'Project 1', 10),new Date(), new Date(), "tester")
          ] as UserProject[])
        //return this.http.get<UserProfile[]>(environment.apiUrl + `/api/projects/${projectId}/employees`);
    }

    fetchProjects() {
      this.http.get<Project[]>(environment.apiUrl + "/api/profile/project/all").subscribe({
        next: (response: Project[]) => this.projects$.next(response),
        error: (error: HttpErrorResponse) => this.toastr.error(error.message)
      })
    }

    getProjectsObservable() {
        return this.projects$.asObservable()
    }
}