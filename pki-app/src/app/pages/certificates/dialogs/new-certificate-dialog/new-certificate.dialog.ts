import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/core/auth/models/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Certificate } from 'src/app/core/models/certificate';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderType } from 'src/app/core/models/certificate-holder-type';
import { CertificateType } from 'src/app/core/models/certificate-type';
import { CertificateHolderService } from 'src/app/core/services/certificate-holder.service';
import { SelectOption } from 'src/app/shared/ui/input/components/select-field/select-field.component';
import { ExtensionsDialog } from '../extensions-dialog/extensions.dialog';

@Component({
  selector: 'app-new-certificate-dialog',
  templateUrl: './new-certificate.dialog.html',
  styleUrls: ['./new-certificate.dialog.scss']
})
export class NewCertificateDialog {
  user: User|null = null
  certificateTypes: SelectOption[] = []
  certificateHolders: CertificateHolder[] = [];
  certificateHolderOptions: SelectOption[] = [];
  certificateHolderOptionsFiltered: SelectOption[] = [];

  certificateForm = {
    type: null as CertificateType|null,
    subject: null as CertificateHolder|null,
    exp: null as Date|null,
    extensions: []
  }
  canEditIssuer = false

  todayDate = new Date()

  syncIssuerAndSubject = false

  direction_icon = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Certificate,
    private authService: AuthService,
    public dialogRef: MatDialogRef<NewCertificateDialog>,
    public certificateHolderService : CertificateHolderService,
    public matDialog: MatDialog
    ) {
    this.updateCertificateTypes()
    this.canEditIssuer = !this.authService.isAdmin()
  }
  ngOnInit(){
    this.user = this.authService.getUser()
    this.certificateHolderService.getAllCertificateHolders().subscribe({
      next: (result: CertificateHolder[]) => {
        this.certificateHolders = result.filter(holder => holder.email != this.user?.email)
        this.certificateHolderOptions = this.certificateHolders.map((certificateHolder) => {
          return {value: certificateHolder, displayValue: certificateHolder.commonName}
        })
        this.certificateHolderOptionsFiltered = this.certificateHolderOptions.filter(option => option.value.type != "ENTITY")
        this.certificateForm.type = CertificateType.INTERMEDIATE_CERTIFICATE
      }
    })
  }
  createCertificate() {
    this.dialogRef.close(this.certificateForm)
  }

  changeSelectedCertificateType(event: CertificateType) {
    this.certificateForm.type = event
    console.log('%cMyProject%cline:66%cthis.certificateForm.type', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px', this.certificateForm.type)
    if(event == CertificateType.INTERMEDIATE_CERTIFICATE) {
      this.certificateHolderOptionsFiltered = this.certificateHolderOptions.filter(option => option.value.type != CertificateHolderType.ENTITY)
    }else{
      this.certificateHolderOptionsFiltered = new Array<SelectOption>(...this.certificateHolderOptions)
    }
  }
  openCreateExtensionsDialog() {
    const dialogRef = this.matDialog.open(ExtensionsDialog, {
      autoFocus: false,
      restoreFocus: false,
      data: { type: this.certificateForm.type}
    });

    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        this.certificateForm.extensions = result;
      }
    })
  }
  subjectSelected(selected: CertificateHolder) {
    this.certificateForm.subject = selected
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
      // {
      //   value: CertificateType.ROOT_CERTIFICATE,
      //   displayValue: 'ROOT CERTIFICATE',
      // },
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
