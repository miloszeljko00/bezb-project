import { Injectable } from '@angular/core';
import { CreateRootCertificateRequest } from '../dtos/certificate/request/create-root-certificate-request';
import { CreateEntityCertificateRequest } from '../dtos/certificate/request/create-entity-certificate-request';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateRootCertificateResponse } from '../dtos/certificate/response/create-root-certificate-response';
import { CreateIntermediateCertificateResponse } from '../dtos/certificate/response/create-intermediate-certificate-response';
import { CreateEntityCertificateResponse } from '../dtos/certificate/response/create-entity-certificate-response';
import { Certificates } from '../models/certificates';

import {
  IntermediateTemplateRequestDto
} from "../dtos/template-certificate/request/create-intermediate-template-request";
import { Certificate } from '../models/certificate';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpClient) {}

  getAllTemplates() {
    return this.http.get(environment.apiUrl+"/api/templates");
  }

  createTemplate(template: any) {
    return this.http.post(environment.apiUrl+"/api/templates", template);
  }
 
}
