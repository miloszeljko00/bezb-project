import { ChangeDetectorRef, Component, Input,TemplateRef } from '@angular/core';
import { ECOTree,ECONode } from "./econode";


@Component({
  selector: 'tree-view',
  template: `
  <div class="tree" *ngIf="tree.width && tree.height">
  <div class="wrapper">
    <svg class="treeLink" [style.width]="tree.width+'px'" [style.height]="tree.height+'px'">
    <ng-container *ngFor="let node of tree.nDatabaseNodes">
      <path *ngFor="let path of node._drawChildrenLinks(tree);let i=index" [attr.stroke]="node.nodeChildren[i].isSelected?node.linkColor || null:null"
        [attr.d]="!node._isAncestorCollapsed()?path:null" />
        </ng-container>
    </svg>
    <ng-container *ngFor="let node of tree.nDatabaseNodes;let i=index">
      <div *ngIf="!node._isAncestorCollapsed()" 
        [ngStyle]="{position:'absolute',left:node.XPosition+'px',top:node.YPosition+'px',width:node.w+'px',height:node.h+'px'}">
        <ng-container *ngTemplateOutlet="template?template:defaultTemplate;context:{$implicit:node}" ></ng-container>

      </div>
    </ng-container>
  </div>
</div>
<ng-template #defaultTemplate let-node>
<div class="item" [ngStyle]="{'background-color':node.bc,color:node.c}">
{{node.id}}
</div>
</ng-template>
  `,
  styles: [`
  .item{
  width:100%;
  height:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  background-color:white;
  overflow: hidden;
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
  border-radius:5px;
}
.tree{
  position:relative;
}
.treeLink {
	stroke: silver;
  fill:transparent;
}
  `],
})
export class TreeViewComponent  {

  //@ts-ignore
  @Input() template: TemplateRef<any>;
    //@ts-ignore
  @Input() set data(value){
     this.tree=new ECOTree();
     this.addNodes(this.tree,value)
     this.tree.UpdateTree();
    this.cdr.detectChanges()
    }
  constructor(private cdr: ChangeDetectorRef) {}

  update(){
    this.tree.UpdateTree();
    this.cdr.detectChanges()
  }
  get config(){
    return this.tree.config;
  }
  get nodes(){
    return this.tree.nDatabaseNodes
  }
  tree:ECOTree=new ECOTree();

  getChildren(node:ECONode,nodes:ECONode[]=[])
  {
     const children=node.nodeChildren;
     if (children && children.length){
        nodes=[...nodes,...children]
        children.forEach(x=>{
          nodes=this.getChildren(x,nodes)
        })
     }
     return nodes
  }
  getParent(node:ECONode,nodes:ECONode[]=[])
  {
     if (node.nodeParent){
        nodes=[...nodes,node.nodeParent]
        nodes=this.getParent(node.nodeParent,nodes)
     }
     return nodes
  }

  getSlibingNodes(node:ECONode){
     return [...this.getParent(node),...this.getChildren(node)]
  }

  private addNodes(tree:ECOTree,node:any,parent:any=null)
  {
    parent=parent || {id:-1,width:null,height:null,color:null,background:null,linkColor:null}
    node.width=node.width || parent.width
    node.height=node.height || parent.height
    node.color=node.color || parent.color
    node.background=node.background || parent.background
    node.linkColor=node.linkColor || parent.linkColor
    node.id=tree.nDatabaseNodes.length
      tree.add(node.id,parent.id,node.title, node.width, node.height, node.color, node.background, node.linkColor, node.data,node.selected)
      if (node.children)
      {
      node.children.forEach((x:any)=>{
        this.addNodes(tree,x,node)
      })
      }
  }
}
