export enum CertificateExtensionType {
  AUTHORITY_INFO_ACCESS = "AUTHORITY_INFO_ACCESS",
  BASIC_CONSTRAINTS = "BASIC_CONSTRAINTS",
  CRL_DISTRIBUTION_POINTS = "CRL_DISTRIBUTION_POINTS",
  ISSUER_ALT_NAME = "ISSUER_ALT_NAME",
  KEY_USAGE = "KEY_USAGE",
  PRIVATE_KEY_USAGE_PERIOD = "PRIVATE_KEY_USAGE_PERIOD",
  SUBJECT_ALT_NAME = "SUBJECT_ALT_NAME",
}

export enum KeyUsages {
  digitalSignature = 0,
  nonRepudiation = 1,
  keyEncipherment = 2,
  dataEncipherment  = 3,
  keyAgreement  = 4,
  keyCertSign  = 5,
  cRLSign  = 6,
  encipherOnly  = 7,
  decipherOnly  = 8,
}