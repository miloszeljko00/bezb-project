import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Certificate } from 'src/app/core/models/certificate';
import { NewCertificateDialog } from '../new-certificate-dialog/new-certificate.dialog';
import { auto } from '@popperjs/core';
import { CertificateService } from 'src/app/core/services/certificate.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/auth/models/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ConfirmDialog } from 'src/app/shared/ui/dialog/components/confirm-dialog/confirm.dialog';
import { CertificateType } from 'src/app/core/models/certificate-type';

@Component({
  selector: 'app-certificate-overview',
  templateUrl: './certificate-overview.dialog.html',
  styleUrls: ['./certificate-overview.dialog.scss']
})
export class CertificateOverviewDialog implements OnInit {

  createCertificateRequest:any;
  user: User|null = null

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Certificate,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CertificateOverviewDialog>,
    public certificateService : CertificateService,
    public toastrService : ToastrService,
    private authService : AuthService,
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser()
  }
  checkIfCertificateIsValid(){
    this.certificateService.checkIfValid(this.data.id).subscribe({
      next: (response: any) => {
        if(response.valid){
          this.toastrService.success("Certificate is valid.", "Success!");
        }else {
          this.toastrService.error("Certificate is not valid.", "Error!");
        }
      }
    })
  }
  downloadCertificate(){
    this.certificateService.downloadCertificate(this.data.id).subscribe({
      next: (response: any) => {
        const downloadLink = document.createElement('a');
        const blob = new Blob([response], { type: 'blob' }); // replace with the MIME type of your file
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = 'certificate.crt'; // replace with the name of your file
        downloadLink.click();
      }
    })
  }
  downloadPrivateKey() {
    this.certificateService.downloadPrivateKey(this.data.id).subscribe({
      next: (response: any) => {
        const downloadLink = document.createElement('a');
        const blob = new Blob([response], { type: 'blob' }); // replace with the MIME type of your file
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = 'certificate-key.pem'; // replace with the name of your file
        downloadLink.click();
      }
    })
  }
  revokeCertificate(){
    const dialogRef = this.dialog.open(ConfirmDialog, {
      autoFocus: false,
      restoreFocus: false,
      data: { title: 'Revoke certificate?' }
    });

    dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        if(result){
          // TODO: Poslati zahtev za povlacenje sertifikata
          this.certificateService.revokeCertificate(this.data.id).subscribe({
            next: (result) => {
              this.toastrService.success("Certificate revoked successfully", "Revoke certificate")
              this.dialogRef.close(true);
            },
            error: (err) => {
              this.toastrService.error("Error revoking certificate", "Revoke certificate")
            }
          })
        }
      }
    })
  }
  createNewCertificateFromThis(){
    const dialogRef = this.dialog.open(NewCertificateDialog, {
      width: '50%',
      height: auto,
      autoFocus: false,
      restoreFocus: false,
      data: this.data
    });

    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        console.log("BURAZ: ")
        console.log(result)
        if(result.type==CertificateType.INTERMEDIATE_CERTIFICATE){
          this.createCertificateRequest = {
            exp : result.exp,
            parentCertificateSerialNumber : this.data.id,
            subjectId: result.subject.id
          };
          console.log(this.createCertificateRequest);
          this.certificateService.createIntermediateCertificate(this.createCertificateRequest).subscribe({
            next: (result: any) => {
              this.toastrService.success("CA certificate created successfully!")
              this.dialogRef.close(result);
            },
            error: (error: any) => {
              this.toastrService.error("Please enter a valid certificate configuration.", "Create Certificate Failed")
            }
          })
        } else if(result.type == CertificateType.ENTITY_CERTIFICATE){
          this.createCertificateRequest = {
            exp : result.exp,
            parentCertificateSerialNumber : this.data.id,
            subjectId: result.subject.id
          };
          this.certificateService.createEntityCertificate(this.createCertificateRequest).subscribe({
            next: (result: any) => {
              this.toastrService.success("Entity certificate created successfully!")
              this.dialogRef.close(result);
            },
            error: (error: any) => {
              this.toastrService.error("Please enter a valid certificate configuration.", "Create Certificate Failed")
            }
          })
        }

      },
      error: (error: any) => {
        this.toastrService.error("Something went wrong while creating root certificate :/");
      }
    })
  }
}
