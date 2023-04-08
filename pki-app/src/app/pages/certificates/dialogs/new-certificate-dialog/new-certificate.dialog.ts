import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderType } from 'src/app/core/models/certificate-holder-type';
import { CertificateType } from 'src/app/core/models/certificate-type';
import { SelectOption } from 'src/app/shared/ui/input/components/select-field/select-field.component';

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
  selector: 'app-new-certificate-dialog',
  templateUrl: './new-certificate.dialog.html',
  styleUrls: ['./new-certificate.dialog.scss']
})
export class NewCertificateDialog {

  certificateTypes: SelectOption[] = []
  certificateHolders: SelectOption[] = CERTIFICATE_HOLDERS.map((certificateHolder) => {
    return {value: certificateHolder, displayValue: certificateHolder.commonName}
  })

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

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<NewCertificateDialog>
    ) {
    this.updateCertificateTypes()
    this.canEditIssuer = !this.authService.isAdmin()
  }

  createCertificate() {
    console.log(this.certificateForm)
    this.dialogRef.close(this.certificateForm)
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
}
