import { CertificateHolder } from "./certificate-holder";
import { CertificateType } from "./certificate-type";

export interface Certificate {
  id: string
  type: CertificateType
  issuer: CertificateHolder
  subject: CertificateHolder
  iat: Date
  exp: Date
  revoked: boolean
  issuedCertificates: Certificate[]
}