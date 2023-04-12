import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderType } from 'src/app/core/models/certificate-holder-type';
import { CertificateType } from 'src/app/core/models/certificate-type';
import { CertificateHolderService } from 'src/app/core/services/certificate-holder.service';
import { SelectOption } from 'src/app/shared/ui/input/components/select-field/select-field.component';

//dobaviti prave certificate holdere sa beka
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
  selector: 'app-new-root-certificate',
  templateUrl: './new-root-certificate.dialog.html',
  styleUrls: ['./new-root-certificate.dialog.scss']
})
export class NewRootCertificateDialog {

  certificateTypes: SelectOption[] = []
  certificateHolders: CertificateHolder[] = [];
  certificateHolderOptions: SelectOption[] = [];
  //@ts-ignore
  expirationDate: Date;

  todayDate = new Date()

  syncIssuerAndSubject = false

  direction_icon = ''

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<NewRootCertificateDialog>,
    public certificateHolderService: CertificateHolderService,
    public toastr: ToastrService
    ) {
      this.updateCertificateTypes()
    }
    ngOnInit(){
      this.certificateHolderService.getAllCertificateHolders().subscribe({
        next: (result: CertificateHolder[]) => {
          this.certificateHolders = result;
          this.certificateHolderOptions = this.certificateHolders.map((certificateHolder) => {
            return {value: certificateHolder, displayValue: certificateHolder.commonName}
          })
        }
      })
    }
  createCertificate() {
    this.dialogRef.close(this.expirationDate)
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
