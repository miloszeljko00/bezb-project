import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Certificate } from 'src/app/core/models/certificate';
import { NewCertificateDialog } from '../new-certificate-dialog/new-certificate.dialog';
import { auto } from '@popperjs/core';
import { CertificateService } from 'src/app/core/services/certificate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-certificate-overview',
  templateUrl: './certificate-overview.dialog.html',
  styleUrls: ['./certificate-overview.dialog.scss']
})
export class CertificateOverviewDialog implements OnInit {

  createCertificateRequest:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Certificate,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CertificateOverviewDialog>,
    public certificateService : CertificateService,
    public toastrService : ToastrService
  ) { }

  ngOnInit() {
  }
  checkIfCertificateIsValid(){

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

  revokeCertificate(){

  }
  createNewCertificateFromThis(){
    const dialogRef = this.dialog.open(NewCertificateDialog, {
      width: '50%',
      height: auto,
      autoFocus: false,
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        if(result.type=="CA"){
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
            }
          })
        } else if(result.type == "Entity"){
          this.createCertificateRequest = {
            exp : result.exp,
            parentCertificateSerialNumber : this.data.id,
            subjectId: result.subject.id
          };
          this.certificateService.createEntityCertificate(this.createCertificateRequest).subscribe({
            next: (result: any) => {
              this.toastrService.success("Entity certificate created successfully!")
              this.dialogRef.close(result);
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
