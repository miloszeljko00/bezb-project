import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
     @Inject(MAT_DIALOG_DATA) public data: CertificateHolder[]) {
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
    //TODO: NAPRAVITI NEKU VALIDACIJU DA SE NE MOZE BAS BILO STA SLATI NA FRONT
    console.log(this.selectedRadioOption);
    console.log(this.createCertificateHolderForm);
    if(this.selectedRadioOption == "entity") {
      this.certificateHolderService.createCertificateHolderEntity(this.createCertificateHolderForm).subscribe({
        next: (result: any) => {
          this.toastrService.success("Certificate Holder Entity created successfully!");
          console.log(result);
        },
        error: (error: any) => {
          this.toastrService.error(error);
          console.log(error);
        }
      });
    }
    else if(this.selectedRadioOption == "certificate authority") {
      this.certificateHolderService.createCertificateHolderCA(this.createCertificateHolderForm).subscribe({
        next: (result: any) => {
          this.toastrService.success("Certificate Holder CA created successfully!");
          console.log(result);
        },
        error: (error: any) => {
          this.toastrService.error(error);
          console.log(error);
        }
      });
    }
  }
}
