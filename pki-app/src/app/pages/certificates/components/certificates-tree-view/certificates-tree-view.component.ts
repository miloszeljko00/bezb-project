import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Certificate } from 'src/app/core/models/certificate';
import { CertificateType } from 'src/app/core/models/certificate-type';
import { ECONode, IECONode } from 'src/app/shared/ui/tree-view/econode';
import { auto } from '@popperjs/core';
import { ToastrService } from 'ngx-toastr';
import { CertificateService } from 'src/app/core/services/certificate.service';
import { CreateRootCertificateRequest } from 'src/app/core/dtos/certificate/request/create-root-certificate-request';
import { NewRootCertificateDialog } from '../../dialogs/new-root-certificate-dialog/new-root-certificate.dialog';
import { CertificateOverviewDialog } from '../../dialogs/certificate-overview-dialog/certificate-overview.dialog';
import { User } from 'src/app/core/auth/models/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-certificates-tree-view',
  templateUrl: './certificates-tree-view.component.html',
  styleUrls: ['./certificates-tree-view.component.scss']
})
export class CertificatesTreeViewComponent {
  nodeSelected: ECONode|null = null;
  user: User|null = null
  @Input() certificates$: Observable<Certificate[]> = of([])
  @Output() updateViewEvent = new EventEmitter();
  @ViewChildren('treeView') treeViews?: QueryList<any>;

  data:IECONode[] = [];

  constructor(
    public dialog : MatDialog,
    public toastr: ToastrService,
    public certificateService: CertificateService,
    private authService: AuthService,
    ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.certificates$.subscribe({
      next: (certificates: Certificate[]) => {
        this.data = this.convertCertificatesToNodes(certificates);
      },
      error: (error: Error) => {
        console.log(error)
      }
    })
  }

  private convertCertificatesToNodes(certificates: Certificate[]): IECONode[]{
    let nodes: IECONode[] = []
    for(let certificate of certificates){
      nodes.push(this.convertCertificateToNode(certificate))
    }
    return nodes
  }

  private convertCertificateToNode(certificate: Certificate): IECONode{
    return {
      data: certificate,
      background: this.getNodeColor(certificate),
      color: 'white',
      linkColor: this.getNodeColor(certificate),
      children: this.convertCertificatesToNodes(certificate.issuedCertificates),
      selected: true
    }
  }

  private getNodeColor(certificate: Certificate): string {
    switch(certificate.type) {
      case CertificateType.ROOT_CERTIFICATE: return 'black'
      case CertificateType.INTERMEDIATE_CERTIFICATE: return 'red'
      case CertificateType.ENTITY_CERTIFICATE: return 'orange'
    }
  }
  selectSlibingNodes(treeView: Event, node: ECONode) {
    let element = (treeView.target as HTMLElement)
    let classes = element?.classList

    if(classes?.contains('hovered')) {
      element?.classList.remove('hovered')
    }else {
      element?.classList.add('hovered')
    }
  }
  openInfoDialog(node: ECONode) {
    console.log(node.data)
    const dialogRef = this.dialog.open(CertificateOverviewDialog, {
      width: '50%',
      height: auto,
      autoFocus: false,
      restoreFocus: false,
      data: node.data
    });

    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        this.updateViewEvent.emit();
      },
      error: (error: any) => {

      }
    })
  }

  openNewRootCertificateDialog() {
    const dialogRef = this.dialog.open(NewRootCertificateDialog, {
      width: '50%',
      height: auto,
      autoFocus: false,
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        var createRootCertificateRequest : CreateRootCertificateRequest = {
          exp : result.exp,
          certificateExtensions: result.extensions
        }
        this.certificateService.createRootCertificate(createRootCertificateRequest).subscribe({
          next: (result: any) => {
            this.toastr.success("Root certificate created successfully!")
            this.updateViewEvent.emit();
          }
        })
      },
      error: (error: any) => {
        this.toastr.error("Something went wrong while creating root certificate :/");
      }
    })
  }
}
