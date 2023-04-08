import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCertificateDialog } from './dialogs/new-certificate-dialog/new-certificate.dialog';
import { auto } from '@popperjs/core';
import { Subscription } from 'rxjs';
import { ConfirmDialog } from 'src/app/shared/ui/dialog/components/confirm-dialog/confirm.dialog';
import { Certificate } from 'src/app/core/models/certificate';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.page.html',
  styleUrls: ['./certificates.page.scss']
})
export class CertificatesPage implements OnDestroy{

  newCertificateDialogClosedSubscription = new Subscription();

  constructor(public dialog: MatDialog) {}

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
