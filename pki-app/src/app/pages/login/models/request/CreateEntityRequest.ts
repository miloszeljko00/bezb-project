export class CreateEntityRequest {
  email: string;
  password: string;
  commonName: string;
  country: string;
  state: string;
  locality: string;
  organization: string;
  organizationalUnit: string;

  constructor(
      email: string,
      password: string,
      commonName: string,
      country: string,
      state: string,
      locality: string,
      organization: string,
      organizationalUnit: string
  ) {
      this.email = email;
      this.password = password;
      this.commonName = commonName;
      this.country = country;
      this.state = state;
      this.locality = locality;
      this.organization = organization;
      this.organizationalUnit = organizationalUnit;
  }
}
