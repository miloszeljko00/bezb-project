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

const CERTIFICATE_HOLDERS: CertificateHolder[] = [
  {
    id: 'axdasdxas-dxa-dax-sdx-asxasx',
    email: 'ca@email.com',
    type: CertificateHolderType.CERTIFICATE_AUTHORITY,
    commonName: 'Pera Peric',
    country: 'Serbia',
    locality: 'Novi Sad',
    state: 'Vojvodina',
    organization: 'WeDoSOFTWARE',
    organizationalUnit: 'WebTeam',
  },
  {
    id: 'asdafgfa-dasd-asdasa-hhgds-gasfsas',
    email: 'entity@email.com',
    type: CertificateHolderType.ENTITY,
    commonName: 'Djoka Djokic',
    country: 'Bosna i Hercegovina',
    locality: 'Banjaluka',
    state: 'Republika Srpska',
    organization: 'WeDoSOFTWARE',
    organizationalUnit: 'AITeam',
  }
]

@Component({
  selector: 'app-templates-form',
  templateUrl: './templates-form.component.html',
  styleUrls: ['./templates-form.component.scss']
})
export class TemplatesFormComponent {

  certificateTypes: SelectOption[] = []
  certificateHolders: SelectOption[] = CERTIFICATE_HOLDERS.map((certificateHolder) => {
    return {value: certificateHolder, displayValue: certificateHolder.commonName}
  })

  extensionList: CertificateExtension[] = [];

  certificateForm = {
    type: null as CertificateType|null,
    issuer: null as CertificateHolder|null,
    subject: null as CertificateHolder|null,
    exp: null as Date|null,
  }

  canEditIssuer = false

  todayDate = new Date()

  syncIssuerAndSubject = false

  direction_icon = ''

  authorityInput = ''
  basicConstraintsValue = 1
  subjectAltNameInput = ''
  privateKeyPeriod = ''
  keyUsage = 1
  issuerInput = ''

  crlInput1 = ''

  crlInput2 = ''
  crlChecked = false
  issuerChecked = false
  keyChecked = false







  constructor(
    private authService: AuthService,
    public certificateService: CertificateService
  ) {
    this.updateCertificateTypes()
    this.canEditIssuer = !this.authService.isAdmin()

  }

  createCertificate() {
    console.log(this.extensionList);
    this.extensionList = [];
  //  this.certificateService.Create(this.certificateForm)
  }

  issuerSelected(selected: CertificateHolder) {
    this.certificateForm.issuer = selected
    if(this.syncIssuerAndSubject) this.certificateForm.subject = selected
  }

  subjectSelected(selected: CertificateHolder) {
    this.certificateForm.subject = selected
    if(this.syncIssuerAndSubject) this.certificateForm.issuer = selected
  }

  adjustFormForCertificateType(selected: CertificateType) {
    if(selected == CertificateType.ROOT_CERTIFICATE) {
      this.direction_icon = '='
      this.syncIssuerAndSubject = true
      this.certificateForm.subject = this.certificateForm.issuer
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
    extension.extensionName = CertificateExtensionType.AUTHORITY_INFO_ACCESS;
    extension.extensionValue = this.authorityInput;
    extension.critical = false;
    this.extensionList.push(extension);

  }

  addBasicConstraints() {

    let extension = new CertificateExtension();
    extension.extensionName = CertificateExtensionType.BASIC_CONSTRAINTS;
    extension.extensionValue = this.basicConstraintsValue.toString();
    extension.critical = true;
    this.extensionList.push(extension);
  }

  addCrl() {

    let extension = new CertificateExtension();
    extension.extensionName = CertificateExtensionType.CRL_DISTRIBUTION_POINTS;

    let crlInput =this.crlInput1+this.crlInput2
    extension.extensionValue = crlInput;
    extension.critical = this.crlChecked;
    this.extensionList.push(extension);
  }

  addIssuerAltName() {
    let extension = new CertificateExtension();
    extension.extensionName = CertificateExtensionType.ISSUER_ALT_NAME;
    extension.extensionValue = this.issuerInput;
    extension.critical = this.issuerChecked;
    this.extensionList.push(extension);
  }

  addKeyUsage() {
    let extension = new CertificateExtension();
    extension.extensionName = CertificateExtensionType.KEY_USAGE;
    extension.extensionValue = this.keyUsage.toString();
    extension.critical = this.keyChecked;
    this.extensionList.push(extension);
  }

  addPrivateKeyUsagePeriod() {

    let extension = new CertificateExtension();
    extension.extensionName = CertificateExtensionType.PRIVATE_KEY_USAGE_PERIOD;
    extension.extensionValue = this.privateKeyPeriod;
    extension.critical = false;
    this.extensionList.push(extension);
  }

  addSubjectAltName() {

    let extension = new CertificateExtension();
    extension.extensionName = CertificateExtensionType.SUBJECT_ALT_NAME;
    extension.extensionValue = this.subjectAltNameInput;
    extension.critical = false;
    this.extensionList.push(extension);
  }
}
