import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Certificate } from 'src/app/core/models/certificate';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';


@Component({
  selector: 'app-certificate-holders-table',
  templateUrl: './certificate-holders-table.component.html',
  styleUrls: ['./certificate-holders-table.component.scss']
})
export class CertificateHoldersTableComponent implements AfterViewInit, OnInit{

  @Input() data : CertificateHolder[] = [];
  @Output() addClicked = new EventEmitter<void>();
  @Output() revokeClicked = new EventEmitter<Certificate>();

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'email', 'type', 'commonName', 'country', 'state', 'locality', 'organization', 'organizationalUnit'];
  dataSource = new MatTableDataSource<CertificateHolder>();

  constructor(public dialog: MatDialog) {
    console.log(this.data);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }
}
