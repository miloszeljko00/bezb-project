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

    //dialogRef.afterClosed().subscribe({
      //next: (result: any) => {
        // var createCertificateAuthorityRequest = new CreateCertificateAuthorityRequest(
        //   email: string;
        //   password: string;
        //   commonName: string;
        //   country: string;
        //   state: string;
        //   locality: string;
        //   organization: string;
        //   organizationalUnit: string;
        // );
    //     this.certificateService.createIntermediateCertificate(createCertificateAuthorityRequest).subscribe({
    //       next: (result: any) => {
    //         this.toastr.success("Root certificate created successfully!")
    //         this.dialogRef.close(result);
    //       }
    //     })
    //   },
    //   error: (error: any) => {
    //     this.toastr.error("Something went wrong while creating root certificate :/");
    //   }
    // })
  }
}
