import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RegisterUserInfoService {

  constructor(private http: HttpClient) {}

  getAllWithAccountStatusPending() {
    return this.http.get(environment.apiUrl+"/api/register");
  }

  createRegistration(registerUserInfo: any) {
    return this.http.post(environment.apiUrl+"/api/register", registerUserInfo);
  }

}
