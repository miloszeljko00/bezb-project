import { Injectable } from '@angular/core';
import { CreateRootCertificateRequest } from '../dtos/certificate/request/create-root-certificate-request';
import { CreateEntityCertificateRequest } from '../dtos/certificate/request/create-entity-certificate-request';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateRootCertificateResponse } from '../dtos/certificate/response/create-root-certificate-response';
import { CreateIntermediateCertificateResponse } from '../dtos/certificate/response/create-intermediate-certificate-response';
import { CreateEntityCertificateResponse } from '../dtos/certificate/response/create-entity-certificate-response';
import { Certificates } from '../models/certificates';
import { Certificate } from '../models/certificate';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  checkIfValid(id: string) {
    return this.http.get(environment.apiUrl+"/api/certificates/" + id + "/actions/check");
  }
  revokeCertificate(id: string) {
    return this.http.put(environment.apiUrl+"/api/certificates/" + id + "/actions/revoke", {});
  }
  downloadPrivateKey(id: string) {
    return this.http.get(environment.apiUrl+"/api/certificates/" + id + "/actions/download-private-key",{ responseType: 'blob' });
  }
  downloadCertificate(id: string) {
    return this.http.get(environment.apiUrl+"/api/certificates/" + id + "/actions/download",{ responseType: 'blob' });
  }

  constructor(private http: HttpClient) {}

  getAllCertificates() {
    return this.http.get<Certificates>(environment.apiUrl+"/api/certificates");
  }

  createRootCertificate(createRootCertificateRequest: CreateRootCertificateRequest) {
    return this.http.post<CreateRootCertificateResponse>(environment.apiUrl+"/api/certificates/actions/create-root-certificate", createRootCertificateRequest);
  }
  createIntermediateCertificate(createIntermediateCertificateRequest: any) {
    return this.http.post<CreateIntermediateCertificateResponse>(environment.apiUrl+"/api/certificates/actions/create-intermediate-certificate", createIntermediateCertificateRequest);
  }
  createEntityCertificate(createEntityCertificateRequest: CreateEntityCertificateRequest) {
    return this.http.post<CreateEntityCertificateResponse>(environment.apiUrl+"/api/certificates/actions/create-entity-certificate", createEntityCertificateRequest);
  }
}
