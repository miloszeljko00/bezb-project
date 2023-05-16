import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RegisterUserInfoService {

  constructor(private http: HttpClient) {}

  getAllWithAccountStatusPending() {
    return this.http.get(environment.apiUrl+"/api/register/get-all-unconfirmed");
  }

  createRegistration(registerUserInfo: any) {
    return this.http.post(environment.apiUrl+"/api/register", registerUserInfo);
  }
  acceptRegistration(id: string) {
    return this.http.put(environment.apiUrl+"/api/register/accept-registration", id);
  }
  declineRegistration(id: string) {
    return this.http.put(environment.apiUrl+"/api/register/decline-registration", id);
  }
}
