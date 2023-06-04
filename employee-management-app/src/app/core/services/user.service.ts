import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Project } from "../../pages/profile/models/project";
import { UserSkills } from "../../pages/profile/models/userSkills";
import { UserProject } from "../../pages/profile/models/userProject";
import { UserProfile } from "../../pages/profile/models/userProfile";
import { CreateUserProject } from "../../pages/profile/models/dto/createUserProject";

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
    return this.http.get<UserProject[]>(environment.apiUrl + "/api/profile/user-project/"+ id);
  }
  getUsers() {
    return this.http.get<UserProfile[]>("https://localhost:443" + "/api/profile/users/all");
  }
  //za kreiranje userprojecta
  getAccounts() {
    return this.http.get<UserProfile[]>("https://localhost:443" + "/api/manager/user/all");
  }
  getProjectManagers() {
    return this.http.get<UserProfile[]>(environment.apiUrl + "/api/profile/users/pm");
  }
  getProjectsByUser(id: string) {
    return this.http.get(environment.apiUrl + "/api/profile/project-user/"+ id);
  }
  getProjectsByManager(id: string) {
    return this.http.get("https://localhost:443"+ "/api/profile/manager/"+id);
  }
  getEmployeesByManager(id: string) {
    return this.http.get("https://localhost:443" + "/api/manager/user-manager/"+id);
  }

  getUserSkills(userId: string) {
    return this.http.get(environment.apiUrl + "/api/profile/user-skills/"+ userId);
  }
  deleteUserProject(id: string): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + "/api/manager/user-project/"+id);
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
  createUserProject(userProjectDto: CreateUserProject) {
    return this.http.post("https://localhost:443" + "/api/manager/create-user-project", userProjectDto);
  }
  updateUserProject(userProject: UserProject) {
    return this.http.put("https://localhost:443" + "/api/manager/update/"+ userProject.id +'/' +userProject.startDate+'/'+userProject.endDate, userProject);
  }
  updateProfile(newCaption: any) {
    return this.http.put(environment.apiUrl + "/api/profile/update-profile", newCaption);
  }
  updateSkill(userSkill: UserSkills, flag: string) {
    if(flag=="jedan"){
      return this.http.put(environment.apiUrl + "/api/profile/update-skill/" + userSkill.id + "/" + userSkill.name + "/" + flag, null);

    }else {
      return this.http.put(environment.apiUrl + "/api/profile/update-skill/" + userSkill.id + "/" + userSkill.rating + "/" + flag, null);
    }
  }
  uploadCv(file: FormData, userEmail: string) {
    return this.http.post(environment.apiUrl + "/api/profile/upload-cv/" + userEmail, file);
  }
  getAllCvs() {
    return this.http.get(environment.apiUrl + "/api/profile/get-all-cvs");
  }
  getAllCvsByManager(managerId: string) {
    return this.http.get(environment.apiUrl + "/api/profile/get-all-cvs-for-manager-projects/"+managerId);
  }
  getCvByFileName(fileName: String) {
    return this.http.get<string>(environment.apiUrl + "/api/profile/get-cv-by-filename/"+fileName);
  }
}
