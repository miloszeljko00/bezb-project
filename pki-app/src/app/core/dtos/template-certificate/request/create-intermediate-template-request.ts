import {CertificateExtension} from "../../../models/certificate-extension";
import {CertificateHolder} from "../../../models/certificate-holder";

export class IntermediateTemplateRequestDto {

 // parentCertificateSerialNumber : string | undefined;
  exp : Date | null = new Date();
 // subjectId : string | undefined;
  certificateExtensions : CertificateExtension[] = [];

  public constructor(obj?: any) {
    if (obj) {
    //  this.parentCertificateSerialNumber = obj.parentCertificateSerialNumber;
      this.exp = obj.exp;
    //  this.subjectId = obj.subjectId;
      this.certificateExtensions = obj.certificateExtensions;
    }

  }
}
