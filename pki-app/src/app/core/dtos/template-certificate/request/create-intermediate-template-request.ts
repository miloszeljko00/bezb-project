import {CertificateExtension} from "../../../models/certificate-extension";
import {CertificateHolder} from "../../../models/certificate-holder";

export class IntermediateTemplateRequestDto {

  name: string = "";
 // parentCertificateSerialNumber : string | undefined;
  exp : Date | null = new Date();
 // subjectId : string | undefined;
  extensions : CertificateExtension[] = [];

  public constructor(obj?: any) {
    if (obj) {
      this.name = obj.name;
    //  this.parentCertificateSerialNumber = obj.parentCertificateSerialNumber;
      this.exp = obj.exp;
    //  this.subjectId = obj.subjectId;
      this.extensions = obj.certificateExtensions;
    }

  }
}
