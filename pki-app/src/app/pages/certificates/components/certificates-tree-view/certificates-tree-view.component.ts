import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Certificate } from 'src/app/core/models/certificate';
import { CertificateType } from 'src/app/core/models/certificate-type';
import { ECONode, IECONode, Orientation } from 'src/app/shared/ui/tree-view/econode';
import { TreeViewComponent } from 'src/app/shared/ui/tree-view/tree-view.component';

@Component({
  selector: 'app-certificates-tree-view',
  templateUrl: './certificates-tree-view.component.html',
  styleUrls: ['./certificates-tree-view.component.scss']
})
export class CertificatesTreeViewComponent {  
  nodeSelected: ECONode|null = null;

  @Input() certificates$: Observable<Certificate[]> = of([])

  @ViewChildren('treeView') treeViews?: QueryList<any>;
  
  data:IECONode[] = [];

  ngOnInit() {
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
  }
}
