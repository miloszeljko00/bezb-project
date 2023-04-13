import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Certificate } from 'src/app/core/models/certificate';
import { CertificateExtensionType, KeyUsages } from 'src/app/core/models/certificate-extension-type';
import { CertificateType } from 'src/app/core/models/certificate-type';

@Component({
  selector: 'app-extensions-dialog',
  templateUrl: './extensions.dialog.html',
  styleUrls: ['./extensions.dialog.scss']
})
export class ExtensionsDialog {

  /**
   *
   */
  constructor( 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ExtensionsDialog>) {
    console.log(data.type)
    if(data.type == CertificateType.ENTITY_CERTIFICATE){
      this.extensions.basicConstraints = false;
    }
    
  }
  keyUsages = [
    {
      value:KeyUsages.digitalSignature,
      displayValue: "digitalSignature"
    },
    {
      value:KeyUsages.nonRepudiation,
      displayValue: "nonRepudiation"
    },
    {
      value:KeyUsages.keyEncipherment,
      displayValue: "keyEncipherment"
    },
    {
      value:KeyUsages.dataEncipherment,
      displayValue: "dataEncipherment"
    },
    {
      value:KeyUsages.keyAgreement,
      displayValue: "keyAgreement"
    },
    {
      value:KeyUsages.keyCertSign,
      displayValue: "keyCertSign"
    },
    {
      value:KeyUsages.cRLSign,
      displayValue: "cRLSign"
    },
    {
      value:KeyUsages.encipherOnly,
      displayValue: "encipherOnly"
    },
    {
      value:KeyUsages.decipherOnly,
      displayValue: "decipherOnly"
    },
  ]
  extensions = {
    authorityInfoAccess : "",
    authorityInfoAccessCritical: false,
    basicConstraints:true,
    basicConstraintsCritical: true,
    subjectAltName: "",
    subjectAltNameCritical: false,
    privateKeyUsagePeriod: {
      //@ts-ignore
      notBefore: undefined as Date,
      //@ts-ignore
      notAfter: undefined as Date,
    },
    privateKeyUsagePeriodCritical: false,
    keyUsage: undefined,
    keyUsageCritical: false,
    issuerAltName: "",
    issuerAltNameCritical: false,
    crlDistributionPoints: "",
    crlDistributionPointsCritical: false,
  }
  createExtensions() {
    const extenstionsPrepakovane = this.prepakuj();
    this.dialogRef.close(extenstionsPrepakovane);
  }
  private prepakuj(){
    let extensionsPrepakovane = [];
    if(this.extensions.authorityInfoAccess!=""){
      let authorityInfoAccess = {
        extensionType: CertificateExtensionType.AUTHORITY_INFO_ACCESS,
        extensionValue: this.extensions.authorityInfoAccess,
        critical: this.extensions.authorityInfoAccessCritical,
      }
      extensionsPrepakovane.push(authorityInfoAccess)
    }
    if(this.extensions.basicConstraints){
      let basicConstraints = {
        extensionType: CertificateExtensionType.BASIC_CONSTRAINTS,
        extensionValue: 1,
        critical: this.extensions.basicConstraintsCritical,
      }
      extensionsPrepakovane.push(basicConstraints)
    }
    if(this.extensions.subjectAltName!=""){
      let subjectAltName = {
        extensionType: CertificateExtensionType.SUBJECT_ALT_NAME,
        extensionValue: this.extensions.subjectAltName,
        critical: this.extensions.subjectAltNameCritical,
      }
      extensionsPrepakovane.push(subjectAltName)
    }
    
    
    if(this.extensions.privateKeyUsagePeriod.notAfter && this.extensions.privateKeyUsagePeriod.notBefore){
      const date1 = this.extensions.privateKeyUsagePeriod.notBefore;
      const year = date1.getFullYear();
      const month = ('0' + (date1.getMonth() + 1)).slice(-2); // Months are zero-indexed, so add 1 and pad with a leading zero if necessary
      const day = ('0' + date1.getDate()).slice(-2); // Pad with a leading zero if necessary
      const formattedDate = `${year}-${month}-${day}`;

      const date2 = this.extensions.privateKeyUsagePeriod.notAfter;
      const year2 = date2.getFullYear();
      const month2 = ('0' + (date2.getMonth() + 1)).slice(-2); // Months are zero-indexed, so add 1 and pad with a leading zero if necessary
      const day2 = ('0' + date2.getDate()).slice(-2); // Pad with a leading zero if necessary
      const formattedDate2 = `${year2}-${month2}-${day2}`;
      let privateKeyUsagePeriod = {
        extensionType: CertificateExtensionType.PRIVATE_KEY_USAGE_PERIOD,
        extensionValue: formattedDate + ',' + formattedDate2,
        critical: this.extensions.privateKeyUsagePeriodCritical,
      }
      
      extensionsPrepakovane.push(privateKeyUsagePeriod)
  }
    
    if(this.extensions.keyUsage){
      let keyUsage = {
        extensionType: CertificateExtensionType.KEY_USAGE,
        extensionValue: this.extensions.keyUsage,
        critical: this.extensions.keyUsageCritical,
      }
      extensionsPrepakovane.push(keyUsage)
    }
    
    if(this.extensions.issuerAltName!=""){
      let issuerAltName = {
        extensionType: CertificateExtensionType.ISSUER_ALT_NAME,
        extensionValue: this.extensions.issuerAltName,
        critical: this.extensions.issuerAltNameCritical,
      }
      extensionsPrepakovane.push(issuerAltName)
    }
    
    if(this.extensions.crlDistributionPoints!=""){
      let crlDistributionPoints = {
        extensionType: CertificateExtensionType.CRL_DISTRIBUTION_POINTS,
        extensionValue: this.extensions.crlDistributionPoints,
        critical: this.extensions.crlDistributionPointsCritical,
      }
      extensionsPrepakovane.push(crlDistributionPoints)
    }
    
    
    
    return extensionsPrepakovane;
  }
}
