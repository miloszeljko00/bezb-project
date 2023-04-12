import {Component} from '@angular/core';
import {CertificateHolder} from "../../../../core/models/certificate-holder";
import {CertificateHolderType} from "../../../../core/models/certificate-holder-type";
import {SelectOption} from "../../../../shared/ui/input/components/select-field/select-field.component";
import {CertificateType} from "../../../../core/models/certificate-type";
import {AuthService} from "../../../../core/auth/services/auth.service";
import {CertificateService} from "../../../../core/services/certificate.service";
import {CertificateExtensionType} from "../../../../core/models/certificate-extension-type";
import {filter} from "rxjs";
import {CertificateExtension} from "../../../../core/models/certificate-extension";

const CERTIFICATE_HOLDERS: CertificateHolder[] = [
  {
    id: 'axdasdxas-dxa-dax-sdx-asxasx',
    email: 'ca@email.com',
    type: CertificateHolderType.CERTIFICATE_AUTHORITY,
    commonName: 'Pera Peric',
    country: 'Serbia',
    locality: 'Novi Sad',
    state: 'Vojvodina',
    organization: 'WeDoSOFTWARE',
    organizationalUnit: 'WebTeam',
  },
  {
    id: 'asdafgfa-dasd-asdasa-hhgds-gasfsas',
    email: 'entity@email.com',
    type: CertificateHolderType.ENTITY,
    commonName: 'Djoka Djokic',
    country: 'Bosna i Hercegovina',
    locality: 'Banjaluka',
    state: 'Republika Srpska',
    organization: 'WeDoSOFTWARE',
    organizationalUnit: 'AITeam',
  }
]

@Component({
  selector: 'app-templates-form',
  templateUrl: './templates-form.component.html',
  styleUrls: ['./templates-form.component.scss']
})
export class TemplatesFormComponent {

  certificateTypes: SelectOption[] = []
  certificateHolders: SelectOption[] = CERTIFICATE_HOLDERS.map((certificateHolder) => {
    return {value: certificateHolder, displayValue: certificateHolder.commonName}
  })
  templateTypes: checkboxes[] = []
  extensionList: CertificateExtension[] = [];
  certificateForm = {
    type: null as CertificateType|null,
    issuer: null as CertificateHolder|null,
    subject: null as CertificateHolder|null,
    exp: null as Date|null,
  }

  canEditIssuer = false

  todayDate = new Date()

  syncIssuerAndSubject = false

  direction_icon = ''

  constructor(
    private authService: AuthService,
    public certificateService: CertificateService
  ) {
    this.updateCertificateTypes()
    this.canEditIssuer = !this.authService.isAdmin()

    this.templateTypes = [
      {
        value: CertificateExtensionType.AUTHORITY_INFO_ACCESS,
        displayValue: 'AUTHORITY_INFO_ACCESS',
        isSelected :false
      },
      {
        value: CertificateExtensionType.CERTIFICATE_POLICIES_EXT,
        displayValue: 'CERTIFICATE_POLICIES_EXT',
        isSelected :false
      },
      {
        value: CertificateExtensionType.AUTHORITY_KEY_IDENTIFIER,
        displayValue: 'AUTHORITY_KEY_IDENTIFIER',
        isSelected :false
      },
      {
        value: CertificateExtensionType.BASIC_CONSTRAINTS,
        displayValue: 'BASIC_CONSTRAINTS',
        isSelected :false
      },
      {
        value: CertificateExtensionType.CRL_DISTRIBUTION_POINTS,
        displayValue: 'CRL_DISTRIBUTION_POINTS',
        isSelected :false
      },
      {
        value: CertificateExtensionType.EXT_KEY_USAGE,
        displayValue: 'EXT_KEY_USAGE',
        isSelected :false
      },
      {
        value: CertificateExtensionType.ISSUER_ALT_NAME,
        displayValue: 'ISSUER_ALT_NAME',
        isSelected :false
      },
      {
        value: CertificateExtensionType.KEY_USAGE,
        displayValue: 'KEY_USAGE',
        isSelected :false
      },
      {
        value: CertificateExtensionType.NAME_CONSTRAINTS,
        displayValue: 'NAME_CONSTRAINTS',
        isSelected :false
      },
      {
        value: CertificateExtensionType.OCSP_NO_CHECK,
        displayValue: 'OCSP_NO_CHECK',
        isSelected :false
      },
      {
        value: CertificateExtensionType.POLICY_CONSTRAINTS,
        displayValue: 'POLICY_CONSTRAINTS',
        isSelected :false
      },
      {
        value: CertificateExtensionType.POLICY_MAPPINGS,
        displayValue: 'POLICY_MAPPINGS',
        isSelected :false
      },
      {
        value: CertificateExtensionType.PRIVATE_KEY_USAGE_PERIOD,
        displayValue: 'PRIVATE_KEY_USAGE_PERIOD',
        isSelected :false
      },
      {
        value: CertificateExtensionType.SUBJECT_ALT_NAME,
        displayValue: 'SUBJECT_ALT_NAME',
        isSelected :false
      },
      {
        value: CertificateExtensionType.SUBJECT_DIRECTORY_ATTRIBUTES,
        displayValue: 'SUBJECT_DIRECTORY_ATTRIBUTES',
        isSelected :false
      },
      {
        value: CertificateExtensionType.SUBJECT_KEY_IDENTIFIER,
        displayValue: 'SUBJECT_KEY_IDENTIFIER_EXT',
        isSelected :false
      }
    ];

  }

  createCertificate() {

    let i = 0;
    let extension = new CertificateExtension();
    this.extensionList = [];
    let selectedCheckBoxes = this.templateTypes.filter(checkboxes => checkboxes.isSelected === true);
  //bag ispisuje mi pogresne ekstenzije

    for( i = 0; i < selectedCheckBoxes.length; i++){

      extension.extensionName = selectedCheckBoxes[i].displayValue;
      extension.extensionValue = selectedCheckBoxes[i].value;
      console.log(extension);
    }

  //  this.certificateService.Create(this.certificateForm)
  }

  issuerSelected(selected: CertificateHolder) {
    this.certificateForm.issuer = selected
    if(this.syncIssuerAndSubject) this.certificateForm.subject = selected
  }

  subjectSelected(selected: CertificateHolder) {
    this.certificateForm.subject = selected
    if(this.syncIssuerAndSubject) this.certificateForm.issuer = selected
  }

  adjustFormForCertificateType(selected: CertificateType) {
    if(selected == CertificateType.ROOT_CERTIFICATE) {
      this.direction_icon = '='
      this.syncIssuerAndSubject = true
      this.certificateForm.subject = this.certificateForm.issuer
    }else {
      this.direction_icon = 'arrow_forward'
      this.syncIssuerAndSubject = false
    }

  }

  private updateCertificateTypes() {
    if (this.authService.isAdmin()) {
      this.updateCertificateTypesForAdmin();
    } else if (this.authService.isCertificateAuthority()) {
      this.updateCertificateTypesForCA();
    }
  }

  private updateCertificateTypesForCA() {
    this.certificateTypes = [
      {
        value: CertificateType.INTERMEDIATE_CERTIFICATE,
        displayValue: 'INTERMEDIATE CERTIFICATE',
      },
      {
        value: CertificateType.ENTITY_CERTIFICATE,
        displayValue: 'ENTITY CERTIFICATE',
      }
    ];
  }

  private updateCertificateTypesForAdmin() {
    this.certificateTypes = [
      {
        value: CertificateType.ROOT_CERTIFICATE,
        displayValue: 'ROOT CERTIFICATE',
      },
      {
        value: CertificateType.INTERMEDIATE_CERTIFICATE,
        displayValue: 'INTERMEDIATE CERTIFICATE',
      },
      {
        value: CertificateType.ENTITY_CERTIFICATE,
        displayValue: 'ENTITY CERTIFICATE',
      }
    ];
  }
}
class checkboxes{
  isSelected: boolean = false;
  value: CertificateExtensionType = CertificateExtensionType.CERTIFICATE_POLICIES_EXT;
 displayValue: string = 'CERTIFICATE_POLICIES_EXT';
}
