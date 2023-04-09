import { Injectable } from '@angular/core';
import { CreateRootCertificateRequest } from '../dtos/certificate/request/create-root-certificate-request';
import { CreateIntermediateCertificateRequest } from '../dtos/certificate/request/create-intermediate-certificate-request';
import { CreateEntityCertificateRequest } from '../dtos/certificate/request/create-entity-certificate-request';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CreateRootCertificateResponse } from '../dtos/certificate/response/create-root-certificate-response';
import { CreateIntermediateCertificateResponse } from '../dtos/certificate/response/create-intermediate-certificate-response';
import { CreateEntityCertificateResponse } from '../dtos/certificate/response/create-entity-certificate-response';
import { Certificate } from '../models/certificate';
import { Certificates } from '../models/certificates';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) {}

  getAllCertificates() {
    return this.http.get<Certificates>(environment.apiUrl+"/api/certificates");
  }

  createRootCertificate(createRootCertificateRequest: CreateRootCertificateRequest) {
    return this.http.post<CreateRootCertificateResponse>(environment.apiUrl+"/api/certificates/actions/create-entity", createRootCertificateRequest);
  }
  createIntermediateCertificate(createIntermediateCertificateRequest: CreateIntermediateCertificateRequest) {
    return this.http.post<CreateIntermediateCertificateResponse>(environment.apiUrl+"/api/certificate-holders/actions/create-certificate-authority", createIntermediateCertificateRequest);
  }
  createEntityCertificate(createEntityCertificateRequest: CreateEntityCertificateRequest) {
    return this.http.post<CreateEntityCertificateResponse>(environment.apiUrl+"/api/certificate-holders/actions/create-certificate-authority", createEntityCertificateRequest);
  }
}
