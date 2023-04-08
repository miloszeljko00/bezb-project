import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Certificate } from 'src/app/core/models/certificate';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderType } from 'src/app/core/models/certificate-holder-type';
import { CertificateType } from 'src/app/core/models/certificate-type';

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
const CERTIFICATES: Certificate[] = [
  { 
    serialNumber: '1', 
    type: CertificateType.ROOT_CERTIFICATE, 
    issuer: CERTIFICATE_HOLDERS[0], 
    subject: CERTIFICATE_HOLDERS[0], 
    iat: new Date(2023, 4, 7, 15, 15, 0), 
    exp: new Date(2024, 4, 7, 15, 15, 0), 
    publicKey: 'gsracxASJTSDFGADFA',
  },
  { 
    serialNumber: '2', 
    type: CertificateType.INTERMEDIATE_CERTIFICATE, 
    issuer: CERTIFICATE_HOLDERS[0], 
    subject: CERTIFICATE_HOLDERS[1], 
    iat: new Date(2023, 4, 7, 15, 15, 0), 
    exp: new Date(2024, 4, 7, 15, 15, 0), 
    publicKey: 'jgdhsfgfdasdfacasrfvq',
  },
  { 
    serialNumber: '3', 
    type: CertificateType.INTERMEDIATE_CERTIFICATE, 
    issuer: CERTIFICATE_HOLDERS[0], 
    subject: CERTIFICATE_HOLDERS[1], 
    iat: new Date(2023, 1, 1, 12, 0, 0), 
    exp: new Date(2024, 1, 1, 12, 0, 0), 
    publicKey: 'hjegdsdcatyjuadacadacsda'
  }
];

@Component({
  selector: 'app-certificates-table',
  templateUrl: './certificates-table.component.html',
  styleUrls: ['./certificates-table.component.scss']
})
export class CertificatesTableComponent implements AfterViewInit{

  @Output() addClicked = new EventEmitter<void>();
  @Output() revokeClicked = new EventEmitter<Certificate>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['serialNumber', 'type', 'issuer', 'subject', 'iat', 'exp', 'publicKey', 'actions'];
  dataSource = new MatTableDataSource(CERTIFICATES);

  applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }
}
