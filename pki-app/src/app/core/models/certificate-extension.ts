import {CertificateExtensionType} from "./certificate-extension-type";

export class CertificateExtension {
  extensionValue: string = "";
  certificateExtensionType: string = CertificateExtensionType.AUTHORITY_INFO_ACCESS;
  critical: boolean = false;

  public constructor(obj?: any) {
    if (obj) {
      this.extensionValue = obj.extensionValue;
      this.certificateExtensionType = obj.certificateExtensionType;
      this.critical = obj.critical;
    }
  }
}
