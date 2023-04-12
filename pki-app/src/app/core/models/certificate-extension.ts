import {CertificateExtensionType} from "./certificate-extension-type";

export class CertificateExtension {
  extensionName: string = "AUTHORITY_INFO_ACCESS";
  extensionValue: CertificateExtensionType = CertificateExtensionType.AUTHORITY_INFO_ACCESS;
  critical: boolean = false;

  public constructor(obj?: any) {
    if (obj) {
      this.extensionName = obj.extensionName;
      this.extensionValue = obj.extensionValue;
      this.critical = obj.critical;
    }
  }
}
