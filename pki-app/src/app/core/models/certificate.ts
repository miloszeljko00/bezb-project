import { CertificateHolder } from "./certificate-holder";
import { CertificateType } from "./certificate-type";

export interface Certificate {
  serialNumber: string
  type: CertificateType
  issuer: CertificateHolder
  subject: CertificateHolder
  iat: Date
  exp: Date
  revoked: boolean
  issuedCertificates: Certificate[]
}