import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Certificate } from 'src/app/core/models/certificate';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';
import { CertificateHolderType } from 'src/app/core/models/certificate-holder-type';
import { CertificateType } from 'src/app/core/models/certificate-type';

const CERTIFICATE_HOLDERS: CertificateHolder[] = []

const CERTIFICATES: Certificate[] = [];

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
