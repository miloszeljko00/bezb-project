import {Component} from '@angular/core';
import {CertificateHolder} from "../../../../core/models/certificate-holder";
import {CertificateHolderType} from "../../../../core/models/certificate-holder-type";
import {SelectOption} from "../../../../shared/ui/input/components/select-field/select-field.component";
import {CertificateType} from "../../../../core/models/certificate-type";
import {AuthService} from "../../../../core/auth/services/auth.service";
import {CertificateService} from "../../../../core/services/certificate.service";
import {CertificateExtensionType} from "../../../../core/models/certificate-extension-type";
import {filter} from "rxjs";
import {CertificateExtension} from "../../../../core/models/certificate-extension";
import {MatTableDataSource} from "@angular/material/table";
import {
  IntermediateTemplateRequestDto
} from "../../../../core/dtos/template-certificate/request/create-intermediate-template-request";
import { TemplateService } from 'src/app/core/services/template.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-templates-form',
  templateUrl: './templates-form.component.html',
  styleUrls: ['./templates-form.component.scss']
})
export class TemplatesFormComponent {

  certificateTypes: SelectOption[] = []
  extensionList: CertificateExtension[] = [];

  certificateForm = {
    type: null as CertificateType|null,
    exp: null as Date|null,
  }

  canEditIssuer = false

  todayDate = new Date()

  syncIssuerAndSubject = false

  direction_icon = ''

  authorityInput = ''
  basicConstraintsValue = 1
  subjectAltNameInput = ''
  privateKeyPeriod1 = new Date
  privateKeyPeriod2 = new Date
  keyUsage = 1
  issuerInput = ''
  crlInput = ''
  crlChecked = false
  issuerChecked = false
  keyChecked = false
  name = "";



  constructor(
    private authService: AuthService,
    public certificateService: CertificateService,
    public templateService: TemplateService,
    public toastr: ToastrService
  ) {
    this.updateCertificateTypes()
    this.canEditIssuer = !this.authService.isAdmin()

  }





  createCertificate() {
    let newIntermediate = new IntermediateTemplateRequestDto();
    newIntermediate.exp = this.certificateForm.exp;
    newIntermediate.name = this.name;
    newIntermediate.extensions = this.extensionList;
    this.checkForImprovizations();
    this.extensionList = [];
    console.log(newIntermediate);
    this.templateService.createTemplate(newIntermediate).subscribe({
      next: (result:any) => {
        this.toastr.success("Template created successfully")
      },
      error: (err:any) => {
        this.toastr.error("Error creating template")
      }
    }) 

  }
  private checkForImprovizations(){
    const targetExtensionType = "PRIVATE_KEY_USAGE_PERIOD";

  // Use a forEach loop to iterate through the list of certificate extension objects
  this.extensionList.forEach((extension, index) => {
    // Check if the current object's certificateExtensionType matches the target extension type
    if (extension.extensionType === targetExtensionType) {
      const newExtension = {
        extensionType: targetExtensionType,
        critical: extension.critical,
        extensionValue: this.adaptDates(extension.extensionValue)
      };
      this.extensionList[index] = newExtension;
    }
});
}
private adaptDates(dateString: string): string {
  const dateStrings = dateString.split(",");
  const formattedDates = dateStrings.map((dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  });
  return formattedDates.join(",");
}
  adjustFormForCertificateType(selected: CertificateType) {
    if(selected == CertificateType.ROOT_CERTIFICATE) {
      this.direction_icon = '='
      this.syncIssuerAndSubject = true
    }else {
      this.direction_icon = 'arrow_forward'
      this.syncIssuerAndSubject = false
    }

  }

  private updateCertificateTypes() {
    if (this.authService.isAdmin()) {
      this.updateCertificateTypesForAdmin();
    } else if (this.authService.isCertificateAuthority()) {
      this.updateCertificateTypesForCA();
    }
  }

  private updateCertificateTypesForCA() {
    this.certificateTypes = [
      {
        value: CertificateType.INTERMEDIATE_CERTIFICATE,
        displayValue: 'INTERMEDIATE CERTIFICATE',
      },
      {
        value: CertificateType.ENTITY_CERTIFICATE,
        displayValue: 'ENTITY CERTIFICATE',
      }
    ];
  }

  private updateCertificateTypesForAdmin() {
    this.certificateTypes = [
      {
        value: CertificateType.ROOT_CERTIFICATE,
        displayValue: 'ROOT CERTIFICATE',
      },
      {
        value: CertificateType.INTERMEDIATE_CERTIFICATE,
        displayValue: 'INTERMEDIATE CERTIFICATE',
      },
      {
        value: CertificateType.ENTITY_CERTIFICATE,
        displayValue: 'ENTITY CERTIFICATE',
      }
    ];
  }

  addAuthorityInfoAccess() {

    let extension = new CertificateExtension();
    extension.extensionType = CertificateExtensionType.AUTHORITY_INFO_ACCESS;
    extension.extensionValue = this.authorityInput;
    extension.critical = false;
    this.extensionList.push(extension);

  }

  addBasicConstraints() {

    let extension = new CertificateExtension();

    if(this.authService.isAdmin() || this.authService.isCertificateAuthority()){

      extension.extensionValue = "1";
    }
    else{
      extension.extensionValue = "0";
    }
    extension.extensionType = CertificateExtensionType.BASIC_CONSTRAINTS;
    extension.critical = true;
    this.extensionList.push(extension);
  }

  addCrl() {
    let extension = new CertificateExtension();
    extension.extensionType = CertificateExtensionType.CRL_DISTRIBUTION_POINTS;
    extension.extensionValue = this.crlInput;
    extension.critical = this.crlChecked;
    this.extensionList.push(extension);
  }

  addIssuerAltName() {
    let extension = new CertificateExtension();
    extension.extensionType = CertificateExtensionType.ISSUER_ALT_NAME;
    extension.extensionValue = this.issuerInput;
    extension.critical = this.issuerChecked;
    this.extensionList.push(extension);
  }

  addKeyUsage() {
    let extension = new CertificateExtension();
    extension.extensionType = CertificateExtensionType.KEY_USAGE;
    if(this.keyUsage<10 && this.keyUsage>=0){

      extension.extensionValue = this.keyUsage.toString();
    }
    else{
      alert("enter number between 0 and 9")
    }
    extension.critical = this.keyChecked;
    this.extensionList.push(extension);
  }

  addPrivateKeyUsagePeriod() {

    let extension = new CertificateExtension();
    extension.extensionType = CertificateExtensionType.PRIVATE_KEY_USAGE_PERIOD;
    extension.extensionValue = this.privateKeyPeriod1.toString()+"," + this.privateKeyPeriod2;
    extension.critical = false;
    this.extensionList.push(extension);
  }

  addSubjectAltName() {

    let extension = new CertificateExtension();
    extension.extensionType = CertificateExtensionType.SUBJECT_ALT_NAME;
    extension.extensionValue = this.subjectAltNameInput;
    extension.critical = false;
    this.extensionList.push(extension);
  }
}
