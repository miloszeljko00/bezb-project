import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CreateCertificateHolderDialogComponent } from './dialogs/create-certificate-holder.dialog/create-certificate-holder.dialog';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderService } from 'src/app/core/services/certificate-holder.service';
import { BehaviorSubject } from 'rxjs';
import { ConfirmDialog } from 'src/app/shared/ui/dialog/components/confirm-dialog/confirm.dialog';
import { CertificateHolderType } from 'src/app/core/models/certificate-holder-type';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss']
})
export class AccountsPage {

  certificateHolders: CertificateHolder[] = [];
  certificateHolders$: BehaviorSubject<CertificateHolder[]> = new BehaviorSubject<CertificateHolder[]>([]);
  constructor(
    public toastrService: ToastrService,
    public dialog : MatDialog,
    public certificateHolderService: CertificateHolderService
     ) {
     }

  ngAfterContentInit() {
    this.certificateHolderService.getAllCertificateHolders().subscribe({
      next : (result: any) => {
        this.certificateHolders = result;
        this.certificateHolders$.next(this.certificateHolders);
      },
      error : (error:any) => {
      }
    });
  }

  openCreateCertificateHolderDialog(){
    const dialogRef = this.dialog.open(CreateCertificateHolderDialogComponent, {
      width: '70%',
      height: '60%',
      autoFocus: false,
      restoreFocus: false
    });
    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        this.certificateHolders.push(result.data);
        this.certificateHolders$.next(this.certificateHolders);
      //  this.certificateHolders$.pipe(
      //     map((certificateHolders) => [...certificateHolders, result.data])
      //   );
        // this.certificateHolders$.subscribe(
        //   (certificateHolders) => console.log(certificateHolders),
        //   (error) => console.error(error),
        //   () => console.log('Observable completed')
        // );
      },
      error: (error:any) => {
      }
    })
  }
  openConfirmDialog(certificateHolder : CertificateHolder){
    const dialogRef = this.dialog.open(ConfirmDialog, {
      autoFocus: false,
      restoreFocus: false,
      data: { title: 'Delete certificate holder?' }
    });

    dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        console.log(result);
        if(result){
          if(certificateHolder.type == CertificateHolderType.CERTIFICATE_AUTHORITY){
            this.certificateHolderService.deleteCertificateHolderCertificateAuthority(certificateHolder.id).subscribe({
              next: () => {
                this.certificateHolders = this.certificateHolders.filter((item) => item.id !== certificateHolder.id);
                this.certificateHolders$.next(this.certificateHolders);
                this.toastrService.success("Certificate Holder CA deleted successfully")
              },
              error: (error:any) => {
                this.toastrService.error(error);
              }
            })
          }
          else if(certificateHolder.type == CertificateHolderType.ENTITY){
            this.certificateHolderService.deleteCertificateHolderEntity(certificateHolder.id).subscribe({
              next: () => {
                this.certificateHolders = this.certificateHolders.filter((item) => item.id !== certificateHolder.id);
                this.certificateHolders$.next(this.certificateHolders);
                this.toastrService.success("Certificate Holder Entity deleted successfully")
              },
              error: (error:any) => {
                this.toastrService.error(error);
              }
            })
          }
        }
      }
    })
  }
}
