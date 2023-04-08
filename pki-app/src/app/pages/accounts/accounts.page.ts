import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CreateCertificateHolderDialogComponent } from './dialogs/create-certificate-holder.dialog/create-certificate-holder.dialog';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderService } from 'src/app/core/services/certificate-holder.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss']
})
export class AccountsPage implements OnInit{

  certificateHolders$: Observable<CertificateHolder[]> = of([]);
  constructor(
    public toastrService: ToastrService,
    public dialog : MatDialog,
    public certificateHolderService: CertificateHolderService
     ) {
     }

  ngOnInit() {
    this.certificateHolders$ = this.certificateHolderService.getAllCertificateHolders();
  }

  openCreateCertificateHolderDialog(){
    const dialogRef = this.dialog.open(CreateCertificateHolderDialogComponent, {
      width: '70%',
      height: '60%',
      autoFocus: false,
      restoreFocus: false,
      data: this.certificateHolders$
    });
    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
      },
      error: (error:any) => {
      }
    })
  }
}
