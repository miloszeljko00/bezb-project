import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCertificateDialog } from './dialogs/new-certificate-dialog/new-certificate.dialog';
import { auto } from '@popperjs/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ConfirmDialog } from 'src/app/shared/ui/dialog/components/confirm-dialog/confirm.dialog';
import { Certificate } from 'src/app/core/models/certificate';
import { CertificateType } from 'src/app/core/models/certificate-type';
import { ToastrService } from 'ngx-toastr';
import { CertificateService } from 'src/app/core/services/certificate.service';
import { Certificates } from 'src/app/core/models/certificates';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.page.html',
  styleUrls: ['./certificates.page.scss']
})
export class CertificatesPage implements OnDestroy{

  newCertificateDialogClosedSubscription = new Subscription();

  certificates$: BehaviorSubject<Certificate[]> = new BehaviorSubject<Certificate[]>([]);

  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private certificateService: CertificateService
  ) {}

  ngOnInit() {
    this.certificateService.getAllCertificates().subscribe({
      next: (certificates: Certificates) => {
        console.log(certificates);
        this.certificates$.next(certificates.certificates);
      },
      error: (error: HttpErrorResponse) =>{
        this.toastr.error(error.message)
      }
    })
  }

  ngOnDestroy(): void {
    this.newCertificateDialogClosedSubscription.unsubscribe()
  }

  openNewCertificateDialog() {
    const dialogRef = this.dialog.open(NewCertificateDialog, {
      width: '50%',
      height: auto,
      autoFocus: false,
      restoreFocus: false,
    });

    this.newCertificateDialogClosedSubscription = dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        // TODO: Poslati zahtev za kreiranje sertifikata

        switch(result.type) {
          case CertificateType.ROOT_CERTIFICATE:
            break
          case CertificateType.INTERMEDIATE_CERTIFICATE:
            break
          case CertificateType.ENTITY_CERTIFICATE:
            break
          default:
            this.toastr.error("Invalid Certificate type: " + result.type);
        }
        

      },
    })
  }
  
  openConfirmRevokeDialog(certificate: Certificate) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      autoFocus: false,
      restoreFocus: false,
      data: { title: 'Revoke certificate?' }
    });

    this.newCertificateDialogClosedSubscription = dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        if(result){
          // TODO: Poslati zahtev za povlacenje sertifikata
        }
      }
    })
  }
}
