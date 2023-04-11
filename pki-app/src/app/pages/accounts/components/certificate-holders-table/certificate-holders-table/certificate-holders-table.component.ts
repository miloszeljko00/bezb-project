import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { CertificateHolder } from 'src/app/core/models/certificate-holder';


@Component({
  selector: 'app-certificate-holders-table',
  templateUrl: './certificate-holders-table.component.html',
  styleUrls: ['./certificate-holders-table.component.scss']
})
export class CertificateHoldersTableComponent implements AfterViewInit, OnInit{

  @Input() data$ : Observable<CertificateHolder[]> = of([]);
  @Output() addClicked = new EventEmitter<void>();
  @Output() editClicked = new EventEmitter<any>();
  @Output() deleteClicked = new EventEmitter<CertificateHolder>();

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'email', 'type', 'commonName', 'country', 'state', 'locality', 'organization', 'organizationalUnit', 'actions'];
  dataSource = new MatTableDataSource<CertificateHolder>();

  constructor(public dialog: MatDialog) {

  }

  ngOnInit() {
    this.data$.subscribe((data: CertificateHolder[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }
}
