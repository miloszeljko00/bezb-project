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
      return this.http.post<UserProject>(environment.apiUrl + `/api/profile/user-project/${projectId}/add`, { userId: result.userId, from: result.from, to: result.to, description: result.description})
    }
    removeUserFromProject(projectId: string, userId: string) {
      return this.http.delete(environment.apiUrl + `/api/profile/user-project/${projectId}/delete/${userId}`).pipe(
        map(() => {
          return true
        })
      )
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
        return this.http.get<UserProject[]>(environment.apiUrl + `/api/profile/user-project/${projectId}`)
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