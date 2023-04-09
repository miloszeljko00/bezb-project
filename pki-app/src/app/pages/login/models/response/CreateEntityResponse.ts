import { CertificateHolderType } from "src/app/core/models/certificate-holder-type";

export class CreateEntityResponse {
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
      this.type = CertificateHolderType.ENTITY;
      this.commonName = commonName;
      this.country = country;
      this.state = state;
      this.locality = locality;
      this.organization = organization;
      this.organizationalUnit = organizationalUnit;
  }
}
