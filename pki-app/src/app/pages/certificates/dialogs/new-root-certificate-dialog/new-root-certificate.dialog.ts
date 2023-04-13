import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/auth/models/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderType } from 'src/app/core/models/certificate-holder-type';
import { CertificateType } from 'src/app/core/models/certificate-type';
import { CertificateHolderService } from 'src/app/core/services/certificate-holder.service';
import { SelectOption } from 'src/app/shared/ui/input/components/select-field/select-field.component';
import { ExtensionsDialog } from '../extensions-dialog/extensions.dialog';

@Component({
  selector: 'app-new-root-certificate',
  templateUrl: './new-root-certificate.dialog.html',
  styleUrls: ['./new-root-certificate.dialog.scss']
})
export class NewRootCertificateDialog {
  user: User|null = null
  certificateTypes: SelectOption[] = []
  certificateHolders: CertificateHolder[] = [];
  certificateHolderOptions: SelectOption[] = [];
  //@ts-ignore
  expirationDate: Date;

  todayDate = new Date()

  syncIssuerAndSubject = false

  direction_icon = ''
  extensions = [];
  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<NewRootCertificateDialog>,
    public certificateHolderService: CertificateHolderService,
    public toastr: ToastrService,
    private matDialog: MatDialog
    ) {
      this.updateCertificateTypes()
    }
    ngOnInit(){
      this.user = this.authService.getUser()
      this.certificateHolderService.getAllCertificateHolders().subscribe({
        next: (result: CertificateHolder[]) => {
          this.certificateHolders = result.filter(holder => holder.email != this.user?.email)
          this.certificateHolderOptions = this.certificateHolders.map((certificateHolder) => {
            return {value: certificateHolder, displayValue: certificateHolder.commonName}
          })
        }
      })
    }
  createCertificate() {
    this.dialogRef.close({exp: this.expirationDate, extensions: this.extensions })
  }

  openCreateExtensionsDialog() {
    const dialogRef = this.matDialog.open(ExtensionsDialog, {
      autoFocus: false,
      restoreFocus: false,
      data: { type:  CertificateType.ROOT_CERTIFICATE}
    });

    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        this.extensions = result;
      }
    })
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
