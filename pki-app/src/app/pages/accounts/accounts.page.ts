import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CertificateHolderService } from 'src/app/core/services/certificate-holder.service';
import { RadioOption } from 'src/app/shared/ui/radio/components/radio-button/radio-button.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss']
})
export class AccountsPage {
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
  selectedRadioOption : RadioOption;
  radioOptions: RadioOption[] = [];
  constructor(public toastrService: ToastrService, private certificateHolderService: CertificateHolderService) {
    this.radioOptions.push({
      value: "entity",
      displayValue: "Entity"
    }, {
      value: "certificate authority",
      displayValue: "Certificate Authority"
    })
    this.selectedRadioOption = this.radioOptions[0];
  }
  createCertificateHolder(){
    console.log(this.selectedRadioOption);
    console.log(this.createCertificateHolderForm);
    if(this.selectedRadioOption.value == "entity") {
      this.certificateHolderService.createCertificateHolderEntity(this.createCertificateHolderForm).subscribe({
        next: (result: any) => {
          this.toastrService.success("pogodjen end point!");
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
