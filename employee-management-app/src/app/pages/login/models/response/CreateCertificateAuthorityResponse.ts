import { CertificateHolderType } from "src/app/core/models/certificate-holder-type";

export class CreateCertificateAuthorityResponse {
  id: string;
  email: string;
  type: string;
  commonName: string;
  country: string;
  state: string;
  locality: string;
  organization: string;
  organizationalUnit: string;

  constructor(
      id: string,
      email: string,
      commonName: string,
      country: string,
      state: string,
      locality: string,
      organization: string,
      organizationalUnit: string
  ) {
      this.id = id;
      this.email = email;
      this.type = CertificateHolderType.CERTIFICATE_AUTHORITY;
      this.commonName = commonName;
      this.country = country;
      this.state = state;
      this.locality = locality;
      this.organization = organization;
      this.organizationalUnit = organizationalUnit;
  }
}
