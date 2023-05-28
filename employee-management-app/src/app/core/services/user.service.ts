import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Project } from "../../pages/profile/models/project";
import { UserSkills } from "../../pages/profile/models/userSkills";
import { UserProject } from "../../pages/profile/models/userProject";
import { UserProfile } from "../../pages/profile/models/userProfile";
import { User } from '../auth/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  updateEngineer(updateForm: any) {
    return this.http.post(environment.apiUrl + "/api/profile/update", updateForm);
  }

  getProjects() {
    return this.http.get(environment.apiUrl + "/api/profile/project/all");
  }
  
  getProjectById(id: string) {
    return this.http.get(environment.apiUrl + "/api/profile/project/"+ id);
  }
  getUsersByProject(id: string) {
    return this.http.get(environment.apiUrl + "/api/profile/user-project/"+ id);
  }
  getUsers() {
    return this.http.get<UserProfile[]>(environment.apiUrl + "/api/profile/users/all");
  }
  getProjectManagers() {
    return this.http.get<UserProfile[]>(environment.apiUrl + "/api/profile/users/pm");
  }
  getProjectsByUser(id: string) {
    return this.http.get(environment.apiUrl + "/api/profile/project-user/"+ id);
  }
  getEmployeesByManager(id: string) {
    return this.http.get(environment.apiUrl + "/api/profile/employees-manager/"+ id);
  }

  getUserSkills(userId: string) {
    return this.http.get(environment.apiUrl + "/api/profile/user-skills/"+ userId);
  }
  deleteUserProject(userProject: UserProject): Observable<any> {
    return this.http.put<any>(environment.apiUrl + "/api/profile/user-project", userProject);
  }
  deleteSkill(userSkill: UserSkills): Observable<any> {
    return this.http.put<any>(environment.apiUrl + "/api/profile/skill", userSkill);
  }
  changeCaption(id: string, newCaption: string) {
    return this.http.post(environment.apiUrl + "/api/profile/caption" + id, newCaption);
  }
  createProject(newCaption: Project) {
    return this.http.post(environment.apiUrl + "/api/profile/create-project", newCaption);
  }
  createUserSkill(newCaption: UserSkills) {
    return this.http.post(environment.apiUrl + "/api/profile/create-userSkill", newCaption);
  }
  createUserProject(newCaption: UserProject) {
    return this.http.post(environment.apiUrl + "/api/profile/create-userProject", newCaption);
  }
  updateUserProject(userProject: UserProject) {
    return this.http.put(environment.apiUrl + "/api/profile/update-userProject/" + userProject.id + "/" + userProject.description, null);
  }
  updateProfile(newCaption: any) {
    return this.http.put(environment.apiUrl + "/api/profile/update-profile", newCaption);
  }
  updateSkill(userSkill: UserSkills) {
    return this.http.put(environment.apiUrl + "/api/profile/update-skill", userSkill);
  }

}
