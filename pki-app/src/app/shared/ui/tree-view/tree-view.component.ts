// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Component, Input,TemplateRef } from '@angular/core';
import { ECOTree,Orientation,Aligment,Search,Select } from "./econode";


@Component({
  selector: 'tree-view',
  template: `
  <div class="tree" *ngIf="tree.width && tree.height">
  <div class="wrapper">
    <svg class="treeLink" [style.width]="tree.width+'px'" [style.height]="tree.height+'px'">
      <path *ngFor="let node of tree.nDatabaseNodes;let i=index" [attr.stroke]="node.linkColor || null"
        [attr.d]="!node._isAncestorCollapsed()?node._drawChildrenLinks(tree):null" />
    </svg>
    <ng-container *ngFor="let node of tree.nDatabaseNodes;let i=index">
      <div *ngIf="!node._isAncestorCollapsed()" class="item"
        [ngStyle]="{left:node.XPosition+'px',top:node.YPosition+'px',width:node.w+'px',height:node.h+'px','background-color':node.bc,color:node.c}">
        <ng-container *ngTemplateOutlet="template?template:defaultTemplate;context:{$implicit:node}"></ng-container>

      </div>
    </ng-container>
  </div>
</div>
<ng-template #defaultTemplate let-node>
{{node.id}}
</ng-template>
  `,
  styles: [`
  .item{
  display:flex;
  justify-content:center;
  align-items:center;
  background-color:white;
  position:absolute;
  overflow: hidden;
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
  border-radius:5px;
}
.tree{
  position:relative;
}
.treeLink {
	stroke: red;
  fill:transparent;
}
  `]
})
export class TreeViewComponent  {

  // @ts-ignore
  @Input() template: TemplateRef<any>;// @ts-ignore
  @Input() set data(value){
     this.tree=new ECOTree();
     this.addNodes(this.tree,value)
     this.tree.UpdateTree();
  }
  update(){
    this.tree.UpdateTree();
  }
  get config(){
    return this.tree.config;
  }
  tree:ECOTree=new ECOTree();
  addNodes(tree:ECOTree,node:any,parent:any=null)
  {
    parent=parent || {id:-1,width:null,height:null,color:null,background:null,linkColor:null}
    node.width=node.width || parent.width
    node.height=node.height || parent.height
    node.color=node.color || parent.color
    node.background=node.background || parent.background
    node.linkColor=node.linkColor || parent.linkColor
    node.id=tree.nDatabaseNodes.length
      tree.add(node.id,parent.id,node.title, node.width, node.height, node.color, node.background, node.linkColor, node.data)
      if (node.children)
      {
      node.children.forEach((x:any)=>{
        this.addNodes(tree,x,node)
      })
      }
  }
}
