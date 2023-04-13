import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CreateEntityRequest } from 'src/app/pages/login/models/request/CreateEntityRequest';
import { environment } from 'src/environments/environment';
import { CreateCertificateAuthorityRequest } from 'src/app/pages/login/models/request/CreateCertificateAuthorityRequest';
import { CreateCertificateAuthorityResponse } from 'src/app/pages/login/models/response/CreateCertificateAuthorityResponse';
import { CertificateHolder } from '../models/certificate-holder';
import { CreateEntityResponse } from 'src/app/pages/login/models/response/CreateEntityResponse';

@Injectable({
  providedIn: 'root'
})
export class CertificateHolderService {


  constructor(private http: HttpClient, private router: Router) {}

  saveCertificateHolderEntity(certificateHolderRequest: CreateEntityRequest) {
    return this.http.post<CreateEntityResponse>(environment.apiUrl+"/api/certificate-holders/actions/create-entity", certificateHolderRequest);
  }
  saveCertificateHolderCA(certificateHolderRequest: CreateCertificateAuthorityRequest) {
    return this.http.post<CreateCertificateAuthorityResponse>(environment.apiUrl+"/api/certificate-holders/actions/create-certificate-authority", certificateHolderRequest);
  }
  getAllCertificateHolders() {
    return this.http.get<CertificateHolder[]>(environment.apiUrl+"/api/certificate-holders/actions/get-all-certificate-holders")
  }
  deleteCertificateHolderEntity(id: string) {
    return this.http.delete(environment.apiUrl+"/api/certificate-holders/actions/delete-entity/" + id);
  }
  deleteCertificateHolderCertificateAuthority(id: string) {
    return this.http.delete(environment.apiUrl+"/api/certificate-holders/actions/delete-certificate-authority/" + id);
  }
}
