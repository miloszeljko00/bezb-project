import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CreateCertificateHolderDialogComponent } from './dialogs/create-certificate-holder.dialog/create-certificate-holder.dialog';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderService } from 'src/app/core/services/certificate-holder.service';
import { BehaviorSubject } from 'rxjs';

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
    console.log("usao sam u ngAfterContentInit")
    this.certificateHolderService.getAllCertificateHolders().subscribe({
      next : (result: any) => {
        console.log("Rezultat stigao sa beka poruka iz ngAfterContentInit" )
        console.log(result);
        console.log("poruka iz ngAfterContentInit")
        this.certificateHolders = result;
        this.certificateHolders$.next(this.certificateHolders);
      },
      error : (error:any) => {
        console.log(error);
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
}
