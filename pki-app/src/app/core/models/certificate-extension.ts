import {CertificateExtensionType} from "./certificate-extension-type";

export class CertificateExtension {
  extensionValue: string = "";
  extensionType: string = CertificateExtensionType.AUTHORITY_INFO_ACCESS;
  critical: boolean = false;

  public constructor(obj?: any) {
    if (obj) {
      this.extensionValue = obj.extensionValue;
      this.extensionType = obj.certificateExtensionType;
      this.critical = obj.critical;
    }
  }
}
