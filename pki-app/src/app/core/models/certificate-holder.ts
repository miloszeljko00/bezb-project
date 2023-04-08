import { CertificateHolderType } from "./certificate-holder-type";
export interface CertificateHolder {
  id: string;
  email: string;
  type: CertificateHolderType;
  commonName: string;
  country: string;
  state: string;
  locality: string;
  organization: string;
  organizationalUnit: string;
}