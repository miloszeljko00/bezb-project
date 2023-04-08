import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CreateCertificateHolderDialogComponent } from './dialogs/create-certificate-holder.dialog/create-certificate-holder.dialog';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderType } from 'src/app/core/models/certificate-holder-type';


const CERTIFICATE_HOLDERS: CertificateHolder[] = [
  {
    id: 'axdasdxas-dxa-dax-sdx-asxasx',
    email: 'ca@email.com',
    type: CertificateHolderType.CERTIFICATE_AUTHORITY,
    commonName: 'Pera Peric',
    country: 'Serbia',
    locality: 'Novi Sad',
    state: 'Vojvodina',
    organization: 'WeDoSOFTWARE',
    organizationalUnit: 'WebTeam',
  },
  {
    id: 'asdafgfa-dasd-asdasa-hhgds-gasfsas',
    email: 'entity@email.com',
    type: CertificateHolderType.ENTITY,
    commonName: 'Djoka Djokic',
    country: 'Bosna i Hercegovina',
    locality: 'Banjaluka',
    state: 'Republika Srpska',
    organization: 'WeDoSOFTWARE',
    organizationalUnit: 'AITeam',
  }
]


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss']
})
export class AccountsPage {

  data: CertificateHolder[] = CERTIFICATE_HOLDERS;
  constructor(
    public toastrService: ToastrService,
    public dialog : MatDialog
     ) {}

  openCreateCertificateHolderDialog(){
    const dialogRef = this.dialog.open(CreateCertificateHolderDialogComponent, {
      width: '70%',
      height: '60%',
      autoFocus: false,
      restoreFocus: false,
      data: CERTIFICATE_HOLDERS
    });
    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
      },
      error: (error:any) => {
      }
    })
  }
}
