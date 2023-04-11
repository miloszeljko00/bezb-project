import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderService } from 'src/app/core/services/certificate-holder.service';
import { RadioOption } from 'src/app/shared/ui/radio/components/radio-button/radio-button.component';

@Component({
  selector: 'app-create-certificate-holder.dialog',
  templateUrl: './create-certificate-holder.dialog.html',
  styleUrls: ['./create-certificate-holder.dialog.scss']
})
export class CreateCertificateHolderDialogComponent {
  createCertificateHolderForm = {
    email: '',
    password: '',
    commonName: '',
    country: '',
    state: '',
    locality: '',
    organization: '',
    organizationalUnit: ''
  }
  selectedRadioOption : any;
  radioOptions: RadioOption[] = [];
  constructor(
    public toastrService: ToastrService,
     private certificateHolderService: CertificateHolderService,
     @Inject(MAT_DIALOG_DATA) public data: CertificateHolder[],
     public dialogRef: MatDialogRef<CreateCertificateHolderDialogComponent>) {
    this.radioOptions.push({
      value: "entity",
      displayValue: "Entity"
    }, {
      value: "certificate authority",
      displayValue: "Certificate Authority"
    })
    this.selectedRadioOption = "entity";
  }
  createCertificateHolder(){
    //TODO: NAPRAVITI NEKU VALIDACIJU DA SE NE MOZE BAS BILO STA SLATI NA BACK
    if(this.selectedRadioOption == "entity") {
      this.certificateHolderService.saveCertificateHolderEntity(this.createCertificateHolderForm).subscribe({
        next: (result: any) => {
          this.toastrService.success("Certificate Holder Entity created successfully!");
          this.dialogRef.close({data:result})
        },
        error: (error: any) => {
          this.toastrService.error("Account with provided email already exist!");
          console.log(error);
        }
      });
    }
    else if(this.selectedRadioOption == "certificate authority") {
      this.certificateHolderService.saveCertificateHolderCA(this.createCertificateHolderForm).subscribe({
        next: (result: any) => {
          this.toastrService.success("Certificate Holder CA created successfully!");
          this.dialogRef.close({data:result})
        },
        error: (error: any) => {
          this.toastrService.error("Account with provided email already exist!");
          console.log(error);
        }
      });
    }
  }
}
