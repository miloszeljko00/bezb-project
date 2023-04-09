/*This code go from an article written some time ago (nov 2006) by Emilio Cortegoso Lobato:
 https://www.codeproject.com/Articles/16192/Graphic-JavaScript-Tree-with-Layout
//@ts-ignore
Please, don't remove the comment
 */
// @ts-ignore
// tslint:disable-next-line:no-empty
export interface IECONode
{
  data:any;
  linkColor?:string;
  background?:string;
  color?:string;
  width?:number;
  height?:number;
  children?:IECONode[];
}
//@ts-ignore
export enum Orientation {
  RO_TOP,
  RO_BOTTOM,
  RO_RIGHT,
  RO_LEFT
}
export enum Aligment {
  NJ_TOP,
  NJ_CENTER,
  NJ_BOTTOM
}//@ts-ignore
export enum Fill {
  NF_GRADIENT,
  NF_FLAT
}//@ts-ignore
export enum Colorize {
  CS_NODE,
  CS_LEVEL
}
//Search method: Title, metadata or both
export enum Search {
  SM_DSC,
  SM_META,
  SM_BOTH
}
//Selection mode: single, multiple, no selection
export enum Select {
  SL_MULTIPLE,
  SL_SINGLE,
  SL_NONE
}

export class ECONode {
  id?;
  pid?;
  dsc?;
  w?;
  h?;
  c?;
  bc?;
  linkColor?;
  data?;

  siblingIndex? = 0;
  dbIndex? = 0;

  XPosition? = 0;
  YPosition? = 0;
  prelim? = 0;
  modifier? = 0;
  leftNeighbor? = null;
  rightNeighbor? = null;
  nodeParent? = null;
  nodeChildren? = [];

  isCollapsed? = false;
  canCollapse? = false;

  isSelected? = false;

  constructor(id:any, pid:any, dsc:any, w:any, h:any, c:any, bc:any, lc:any, meta:any) {
    this.id = id;
    this.pid = pid;
    this.dsc = dsc;
    this.w = w;
    this.h = h;
    this.c = c;
    this.bc = bc;
    this.linkColor = lc;
    this.data = meta;

    this.siblingIndex = 0;
    this.dbIndex = 0;

    this.XPosition = 0;
    this.YPosition = 0;
    this.prelim = 0;
    this.modifier = 0;
    this.leftNeighbor = null;
    this.rightNeighbor = null;
    this.nodeParent = null;
    this.nodeChildren = [];

    this.isCollapsed = false;
    this.canCollapse = false;

    this.isSelected = false;
  }

  _getLevel() {
    //@ts-ignore
    if (this.nodeParent.id == -1) {
      return 0;
      //@ts-ignore
    } else return this.nodeParent._getLevel() + 1;
  }

  _isAncestorCollapsed() {
    //@ts-ignore
    if (this.nodeParent.isCollapsed) {
      return true;
    } else {
      //@ts-ignore
      if (this.nodeParent.id == -1) {
        return false;
      } else {
        //@ts-ignore
        return this.nodeParent._isAncestorCollapsed();
      }
    }
  }

  _setAncestorsExpanded() {
    //@ts-ignore
    if (this.nodeParent.id == -1) {
      return;
    } else {
      //@ts-ignore
      this.nodeParent.isCollapsed = false;
      //@ts-ignore
      return this.nodeParent._setAncestorsExpanded();
    }
  }

  _getChildrenCount() {
    if (this.isCollapsed) return 0;
    if (this.nodeChildren == null) return 0;
    else return this.nodeChildren.length;
  }

  _getLeftSibling() {
    if (
      this.leftNeighbor != null &&
      //@ts-ignore
      this.leftNeighbor.nodeParent == this.nodeParent
    )
      return this.leftNeighbor;
    else return null;
  }

  _getRightSibling() {
    if (
      this.rightNeighbor != null &&
      //@ts-ignore
      this.rightNeighbor.nodeParent == this.nodeParent
    )
      return this.rightNeighbor;
    else return null;
  }
//@ts-ignore
  _getChildAt(i) {//@ts-ignore
    return this.nodeChildren[i];
  }
//@ts-ignore
  _getChildrenCenter(tree) {
    const node = this._getFirstChild();
    const node1 = this._getLastChild();
    return (//@ts-ignore
      node.prelim + (node1.prelim - node.prelim + tree._getNodeSize(node1)) / 2
    );
  }

  _getFirstChild() {
    return this._getChildAt(0);
  }

  _getLastChild() {
    return this._getChildAt(this._getChildrenCount() - 1);
  }
//@ts-ignore
  _drawChildrenLinks(tree) {
    let s = [];
    let xa = 0,
      ya = 0,
      xb = 0,
      yb = 0,
      xc = 0,
      yc = 0,
      xd = 0,
      yd = 0;
    let node1 = null;

    switch (tree.config.iRootOrientation) {
      case Orientation.RO_TOP://@ts-ignore
        xa = this.XPosition + this.w / 2;
        ya = this.YPosition + this.h;
        break;

      case Orientation.RO_BOTTOM://@ts-ignore
        xa = this.XPosition + this.w / 2;//@ts-ignore
        ya = this.YPosition;
        break;

      case Orientation.RO_RIGHT://@ts-ignore
        xa = this.XPosition;//@ts-ignore
        ya = this.YPosition + this.h / 2;
        break;

      case Orientation.RO_LEFT:
        xa = this.XPosition + this.w;//@ts-ignore
        ya = this.YPosition + this.h / 2;
        break;
    }
//@ts-ignore
    for (let k = 0; k < this.nodeChildren.length; k++) {//@ts-ignore
      node1 = this.nodeChildren[k];

      switch (tree.config.iRootOrientation) {
        case Orientation.RO_TOP://@ts-ignore
          xd = xc = node1.XPosition + node1.w / 2;//@ts-ignore
          yd = node1.YPosition;
          xb = xa;
          switch (tree.config.iNodeJustification) {
            case Aligment.NJ_TOP:
              yb = yc = yd - tree.config.iLevelSeparation / 2;
              break;
            case Aligment.NJ_BOTTOM:
              yb = yc = ya + tree.config.iLevelSeparation / 2;
              break;
            case Aligment.NJ_CENTER:
              yb = yc = ya + (yd - ya) / 2;
              break;
          }
          break;

        case Orientation.RO_BOTTOM://@ts-ignore
          xd = xc = node1.XPosition + node1.w / 2;//@ts-ignore
          yd = node1.YPosition + node1.h;
          xb = xa;
          switch (tree.config.iNodeJustification) {
            case Aligment.NJ_TOP:
              yb = yc = yd + tree.config.iLevelSeparation / 2;
              break;
            case Aligment.NJ_BOTTOM:
              yb = yc = ya - tree.config.iLevelSeparation / 2;
              break;
            case Aligment.NJ_CENTER:
              yb = yc = yd + (ya - yd) / 2;
              break;
          }
          break;

        case Orientation.RO_RIGHT://@ts-ignore
          xd = node1.XPosition + node1.w;//@ts-ignore
          yd = yc = node1.YPosition + node1.h / 2;
          yb = ya;
          switch (tree.config.iNodeJustification) {
            case Aligment.NJ_TOP:
              xb = xc = xd + tree.config.iLevelSeparation / 2;
              break;
            case Aligment.NJ_BOTTOM:
              xb = xc = xa - tree.config.iLevelSeparation / 2;
              break;
            case Aligment.NJ_CENTER:
              xb = xc = xd + (xa - xd) / 2;
              break;
          }
          break;

        case Orientation.RO_LEFT://@ts-ignore
          xd = node1.XPosition;//@ts-ignore
          yd = yc = node1.YPosition + node1.h / 2;
          yb = ya;
          switch (tree.config.iNodeJustification) {
            case Aligment.NJ_TOP:
              xb = xc = xd - tree.config.iLevelSeparation / 2;
              break;
            case Aligment.NJ_BOTTOM:
              xb = xc = xa + tree.config.iLevelSeparation / 2;
              break;
            case Aligment.NJ_CENTER:
              xb = xc = xa + (xd - xa) / 2;
              break;
          }
          break;
      }

      switch (tree.config.linkType) {
        case "M":
          s.push(
            "M" +
              xa +
              " " +
              ya +
              " L" +
              xb +
              " " +
              yb +
              " L" +
              xc +
              " " +
              yc +
              " L" +
              xd +
              " " +
              yd
          );
          break;

        case "B":
          s.push(
            "M" +
              xa +
              " " +
              ya +
              " C" +
              xb +
              " " +
              yb +
              " " +
              xc +
              " " +
              yc +
              " " +
              xd +
              " " +
              yd
          );
          break;
        case "L":
          if (tree.config.iRootOrientation == Orientation.RO_BOTTOM) {
            s.push("M" + xa + " " + ya + " L" + xd + " " + yd);
          } else {
            s.push("M" + xa + " " + ya + " L" + xd + " " + yd);
          }
          break;
      }
    }
    return s.join("");
  }
}

export class ECOTree {
  config: any;
  version: any = "1.1";
  canvasoffsetTop: any = 0;
  canvasoffsetLeft: any = 0;

  maxLevelHeight: any = [];
  maxLevelWidth: any = [];
  previousLevelNode: any = [];

  rootYOffset: any = 0;
  rootXOffset: any = 0;

  nDatabaseNodes: any = [];
  mapIDs: any = {};

  root;
  iSelectedNode: any = -1;
  iLastSearch: any = 0;

  width: any = 0;
  height: any = 0;

  constructor() {
    this.config = {
      iMaxDepth: 100,
      iLevelSeparation: 40,
      iSiblingSeparation: 40,
      iSubtreeSeparation: 80,
      iRootOrientation: Orientation.RO_LEFT,
      iNodeJustification: Aligment.NJ_CENTER,
      topXAdjustment: 0,
      topYAdjustment: 0,
      linkType: "B",
      nodeColor: "#333",
      nodeBorderColor: "white",
      nodeSelColor: "#FFFFCC",
      useTarget: true,
      searchMode: Search.SM_DSC,
      selectMode: Select.SL_SINGLE,
      defaultNodeWidth: 100,
      defaultNodeHeight: 50,
    };

    this.version = "1.1";
    this.canvasoffsetTop = 0;
    this.canvasoffsetLeft = 0;

    this.maxLevelHeight = [];
    this.maxLevelWidth = [];
    this.previousLevelNode = [];

    this.rootYOffset = 0;
    this.rootXOffset = 0;

    this.nDatabaseNodes = [];
    this.mapIDs = {};

    this.root = new ECONode(-1, null, null, 2, 2, null, null, null, null);
    this.iSelectedNode = -1;
    this.iLastSearch = 0;
  }

/*  _canvasNodeClickHandler(tree, target, nodeid) {
    if (target != nodeid) return;
    tree.selectNode(nodeid, true);
  }
*///@ts-ignore
  //Layout algorithm
  _firstWalk(tree, node, level) {
    var leftSibling = null;

    node.XPosition = 0;
    node.YPosition = 0;
    node.prelim = 0;
    node.modifier = 0;
    node.leftNeighbor = null;
    node.rightNeighbor = null;
    tree._setLevelHeight(node, level);
    tree._setLevelWidth(node, level);
    tree._setNeighbors(node, level);
    if (node._getChildrenCount() == 0 || level == tree.config.iMaxDepth) {
      leftSibling = node._getLeftSibling();
      if (leftSibling != null)
        node.prelim =
          leftSibling.prelim +
          tree._getNodeSize(leftSibling) +
          tree.config.iSiblingSeparation;
      else node.prelim = 0;
    } else {
      const n = node._getChildrenCount();
      for (let i = 0; i < n; i++) {
        const iChild = node._getChildAt(i);
        this._firstWalk(tree, iChild, level + 1);
      }

      let midPoint = node._getChildrenCenter(tree);
      midPoint -= tree._getNodeSize(node) / 2;
      leftSibling = node._getLeftSibling();
      if (leftSibling != null) {
        node.prelim =
          leftSibling.prelim +
          tree._getNodeSize(leftSibling) +
          tree.config.iSiblingSeparation;
        node.modifier = node.prelim - midPoint;
        this._apportion(tree, node, level);
      } else {
        node.prelim = midPoint;
      }
    }
  }
//@ts-ignore
  _apportion(tree, node, level) {
    let firstChild = node._getFirstChild();
    let firstChildLeftNeighbor = firstChild.leftNeighbor;
    let j = 1;
    for (
      let k = tree.config.iMaxDepth - level;
      firstChild != null && firstChildLeftNeighbor != null && j <= k;

    ) {
      let modifierSumRight = 0;
      let modifierSumLeft = 0;
      let rightAncestor = firstChild;
      let leftAncestor = firstChildLeftNeighbor;
      for (let l = 0; l < j; l++) {
        rightAncestor = rightAncestor.nodeParent;
        leftAncestor = leftAncestor.nodeParent;
        modifierSumRight += rightAncestor.modifier;
        modifierSumLeft += leftAncestor.modifier;
      }

      let totalGap =
        firstChildLeftNeighbor.prelim +
        modifierSumLeft +
        tree._getNodeSize(firstChildLeftNeighbor) +
        tree.config.iSubtreeSeparation -
        (firstChild.prelim + modifierSumRight);
      if (totalGap > 0) {
        let subtreeAux = node;
        let numSubtrees = 0;
        for (
          ;
          subtreeAux != null && subtreeAux != leftAncestor;
          subtreeAux = subtreeAux._getLeftSibling()
        )
          numSubtrees++;

        if (subtreeAux != null) {
          let subtreeMoveAux = node;
          let singleGap = totalGap / numSubtrees;
          for (
            ;
            subtreeMoveAux != leftAncestor;
            subtreeMoveAux = subtreeMoveAux._getLeftSibling()
          ) {
            subtreeMoveAux.prelim += totalGap;
            subtreeMoveAux.modifier += totalGap;
            totalGap -= singleGap;
          }
        }
      }
      j++;
      if (firstChild._getChildrenCount() == 0)
        firstChild = tree._getLeftmost(node, 0, j);
      else firstChild = firstChild._getFirstChild();
      if (firstChild != null) firstChildLeftNeighbor = firstChild.leftNeighbor;
    }
  }
//@ts-ignore
  _secondWalk(tree, node, level, X, Y) {
    if (level <= tree.config.iMaxDepth) {
      let xTmp = tree.rootXOffset + node.prelim + X;
      let yTmp = tree.rootYOffset + Y;
      let maxsizeTmp = 0;
      let nodesizeTmp = 0;
      let flag = false;

      switch (tree.config.iRootOrientation) {
        case Orientation.RO_TOP:
        case Orientation.RO_BOTTOM:
          maxsizeTmp = tree.maxLevelHeight[level];
          nodesizeTmp = node.h;
          break;

        case Orientation.RO_RIGHT:
        case Orientation.RO_LEFT:
          maxsizeTmp = tree.maxLevelWidth[level];
          flag = true;
          nodesizeTmp = node.w;
          break;
      }
      switch (tree.config.iNodeJustification) {
        case Aligment.NJ_TOP:
          node.XPosition = xTmp;
          node.YPosition = yTmp;
          break;

        case Aligment.NJ_CENTER:
          node.XPosition = xTmp;
          node.YPosition = yTmp + (maxsizeTmp - nodesizeTmp) / 2;
          break;

        case Aligment.NJ_BOTTOM:
          node.XPosition = xTmp;
          node.YPosition = yTmp + maxsizeTmp - nodesizeTmp;
          break;
      }
      if (flag) {
        let swapTmp = node.XPosition;
        node.XPosition = node.YPosition;
        node.YPosition = swapTmp;
      }
      switch (tree.config.iRootOrientation) {
        case Orientation.RO_BOTTOM:
          node.YPosition = -node.YPosition - nodesizeTmp;
          break;

        case Orientation.RO_RIGHT:
          node.XPosition = -node.XPosition - nodesizeTmp;
          break;
      }
      if (node._getChildrenCount() != 0)
        this._secondWalk(
          tree,
          node._getFirstChild(),
          level + 1,
          X + node.modifier,
          Y + maxsizeTmp + tree.config.iLevelSeparation
        );
      const rightSibling = node._getRightSibling();
      if (rightSibling != null)
        this._secondWalk(tree, rightSibling, level, X, Y);
    }
  }

  _positionTree() {
    this.maxLevelHeight = [];
    this.maxLevelWidth = [];
    this.previousLevelNode = [];
    this._firstWalk(this, this.root, 0);

    switch (this.config.iRootOrientation) {
      case Orientation.RO_TOP:
      case Orientation.RO_LEFT:
        this.rootXOffset = this.config.topXAdjustment + this.root.XPosition;
        this.rootYOffset = this.config.topYAdjustment + this.root.YPosition;
        break;

      case Orientation.RO_BOTTOM:
      case Orientation.RO_RIGHT:
        this.rootXOffset = this.config.topXAdjustment + this.root.XPosition;
        this.rootYOffset = this.config.topYAdjustment + this.root.YPosition;
    }

    this._secondWalk(this, this.root, 0, 0, 0);
  }
//@ts-ignore
  _setLevelHeight(node, level) {//@ts-ignore
    if (this.maxLevelHeight[level] == null) this.maxLevelHeight[level] = 0;
    if (this.maxLevelHeight[level] < node.h)//@ts-ignore
      this.maxLevelHeight[level] = node.h;
  }
//@ts-ignore
  _setLevelWidth(node, level) {//@ts-ignore
    if (this.maxLevelWidth[level] == null) this.maxLevelWidth[level] = 0;//@ts-ignore
    if (this.maxLevelWidth[level] < node.w) this.maxLevelWidth[level] = node.w;
  }
//@ts-ignore
  _setNeighbors(node, level) {
    node.leftNeighbor = this.previousLevelNode[level];
    if (node.leftNeighbor != null) node.leftNeighbor.rightNeighbor = node;//@ts-ignore
    this.previousLevelNode[level] = node;
  }
//@ts-ignore
  _getNodeSize(node) {
    switch (this.config.iRootOrientation) {
      case Orientation.RO_TOP:
      case Orientation.RO_BOTTOM:
        return node.w;

      case Orientation.RO_RIGHT:
      case Orientation.RO_LEFT:
        return node.h;
    }
    return 0;
  }
//@ts-ignore
  _getLeftmost(node, level, maxlevel) {
    if (level >= maxlevel) return node;
    if (node._getChildrenCount() == 0) return null;

    const n = node._getChildrenCount();
    for (let i = 0; i < n; i++) {
      const iChild = node._getChildAt(i);//@ts-ignore
      const leftmostDescendant = this._getLeftmost(iChild, level + 1, maxlevel);
      if (leftmostDescendant != null) return leftmostDescendant;
    }

    return null;
  }
//@ts-ignore
  _selectNodeInt(dbindex, flagToggle) {
    if (this.config.selectMode == Select.SL_SINGLE) {
      if (this.iSelectedNode != dbindex && this.iSelectedNode != -1) {//@ts-ignore
        this.nDatabaseNodes[this.iSelectedNode].isSelected = false;
      }
      this.iSelectedNode =//@ts-ignore
        this.nDatabaseNodes[dbindex].isSelected && flagToggle ? -1 : dbindex;
    }//@ts-ignore
    this.nDatabaseNodes[dbindex].isSelected = flagToggle//@ts-ignore
      ? !this.nDatabaseNodes[dbindex].isSelected
      : true;
  }
// @ts-ignore
// tslint:disable-next-line:no-empty
  _collapseAllInt(flag) {
    let node = null;
    for (let n = 0; n < this.nDatabaseNodes.length; n++) {
      node = this.nDatabaseNodes[n];//@ts-ignore
      if (node.canCollapse) node.isCollapsed = flag;
    }
    this.UpdateTree();
  }
//@ts-ignore
  _selectAllInt(flag) {
    let node = null;
    for (let k = 0; k < this.nDatabaseNodes.length; k++) {
      node = this.nDatabaseNodes[k];//@ts-ignore
      node.isSelected = flag;
    }
    this.iSelectedNode = -1;
    this.UpdateTree();
  }

  // ECOTree API begins here...

  UpdateTree() {
    this._positionTree();
    this.width =
      this.config.iRootOrientation == Orientation.RO_RIGHT//@ts-ignore
        ? Math.max(...this.nDatabaseNodes.map(x => -x.XPosition+x.w))//@ts-ignore
        : Math.max(...this.nDatabaseNodes.map(x => x.XPosition + x.w));
    this.height =
      this.config.iRootOrientation == Orientation.RO_BOTTOM//@ts-ignore
        ? Math.max(...this.nDatabaseNodes.map(x => -x.YPosition+x.h))//@ts-ignore
        : Math.max(...this.nDatabaseNodes.map(x => x.YPosition + x.h));

    if (this.config.iRootOrientation == Orientation.RO_BOTTOM) {// @ts-ignore
      this.nDatabaseNodes.forEach(x => {//@ts-ignore
        x.YPosition = x.YPosition + this.height;
      });
    }
    if (this.config.iRootOrientation == Orientation.RO_RIGHT) {
      // @ts-ignore
      this.nDatabaseNodes.forEach(x => {//@ts-ignore
        x.XPosition = x.XPosition + this.width;
      });
    }
  }
//@ts-ignore
  add = function(id, pid, dsc, w, h, c, bc, lc, meta) {//@ts-ignore
    const nw = w || this.config.defaultNodeWidth; //@ts-ignore //Width, height, colors, target and metadata defaults...
    const nh = h || this.config.defaultNodeHeight;//@ts-ignore
    const color = c || this.config.nodeColor;//@ts-ignore
    const border = bc || this.config.nodeBorderColor;
    const metadata = typeof meta != "undefined" ? meta : "";

    let pnode = null; //Search for parent node in database
    if (pid == -1) {//@ts-ignore
      pnode = this.root;
    } else {//@ts-ignore
      for (let k = 0; k < this.nDatabaseNodes.length; k++) {//@ts-ignore
        if (this.nDatabaseNodes[k].id == pid) {//@ts-ignore
          pnode = this.nDatabaseNodes[k];
          break;
        }
      }
    }

    const node = new ECONode(id, pid, dsc, nw, nh, color, border, lc, metadata); //New node creation...
    node.nodeParent = pnode; //Set it's parent
    pnode.canCollapse = true; //It's obvious that now the parent can collapse//@ts-ignore
    //@ts-ignore
    const i = this.nDatabaseNodes.length; //Save it in database
    //@ts-ignore
    node.dbIndex = this.mapIDs[id] = i;
    //@ts-ignore
    this.nDatabaseNodes[i] = node;
    h = pnode.nodeChildren.length; //Add it as child of it's parent
    node.siblingIndex = h;
    pnode.nodeChildren[h] = node;
  };
//@ts-ignore
  searchNodes(str) {
    let node = null;
    const m = this.config.searchMode;
    const sm = this.config.selectMode == Select.SL_SINGLE;

    if (typeof str == "undefined") return;
    if (str == "") return;

    let found = false;
    let n = sm ? this.iLastSearch : 0;
    if (n == this.nDatabaseNodes.length) n = this.iLastSearch = 0;

    str = str.toLocaleUpperCase();

    for (; n < this.nDatabaseNodes.length; n++) {
      node = this.nDatabaseNodes[n];
      if (//@ts-ignore
        node.dsc.toLocaleUpperCase().indexOf(str) != -1 &&
        (m == Search.SM_DSC || m == Search.SM_BOTH)
      ) {//@ts-ignore
        node._setAncestorsExpanded();//@ts-ignore
        this._selectNodeInt(node.dbIndex, false);
        found = true;
      }
      if (//@ts-ignore
        node.meta.toLocaleUpperCase().indexOf(str) != -1 &&
        (m == Search.SM_META || m == Search.SM_BOTH)
      ) {//@ts-ignore
        node._setAncestorsExpanded();//@ts-ignore
        this._selectNodeInt(node.dbIndex, false);
        found = true;
      }
      if (sm && found) {
        this.iLastSearch = n + 1;
        break;
      }
    }
    this.UpdateTree();
  }

  selectAll() {
    if (this.config.selectMode != Select.SL_MULTIPLE) return;
    this._selectAllInt(true);
  }

  unselectAll() {
    this._selectAllInt(false);
  }

  collapseAll() {
    this._collapseAllInt(true);
  }

  expandAll() {
    this._collapseAllInt(false);
  }
//@ts-ignore
  collapseNode(nodeid, upd) {//@ts-ignore
    const dbindex = this.mapIDs[nodeid];//@ts-ignore
    this.nDatabaseNodes[dbindex].isCollapsed = !this.nDatabaseNodes[dbindex]//@ts-ignore
      .isCollapsed;
    if (upd) this.UpdateTree();
  }
//@ts-ignore
  selectNode(nodeid, upd) {//@ts-ignore
    this._selectNodeInt(this.mapIDs[nodeid], true);
    if (upd) this.UpdateTree();
  }
//@ts-ignore
  setNodeTitle(nodeid, title, upd) {//@ts-ignore
    const dbindex = this.mapIDs[nodeid];//@ts-ignore
    this.nDatabaseNodes[dbindex].dsc = title;
    if (upd) this.UpdateTree();
  }
//@ts-ignore
  setNodeMetadata(nodeid, meta, upd) {//@ts-ignore
    const dbindex = this.mapIDs[nodeid];//@ts-ignore
    this.nDatabaseNodes[dbindex].meta = meta;
    if (upd) this.UpdateTree();
  }

/*
  setNodeTarget(nodeid, target, upd) {
    const dbindex = this.mapIDs[nodeid];
    this.nDatabaseNodes[dbindex].target = target;
    if (upd) this.UpdateTree();
  }
*///@ts-ignore
  setNodeColors(nodeid, color, border, upd) {//@ts-ignore
    const dbindex = this.mapIDs[nodeid];//@ts-ignore
    if (color) this.nDatabaseNodes[dbindex].c = color;//@ts-ignore
    if (border) this.nDatabaseNodes[dbindex].bc = border;
    if (upd) this.UpdateTree();
  }

  getSelectedNodes() {
    let node = null;
    const selection = [];
    let selnode = null;

    for (let n = 0; n < this.nDatabaseNodes.length; n++) {
      node = this.nDatabaseNodes[n];//@ts-ignore
      if (node.isSelected) {
        selnode = {//@ts-ignore
          id: node.id,//@ts-ignore
          dsc: node.dsc,//@ts-ignore
          meta: node.meta
        };
        selection[selection.length] = selnode;
      }
    }
    return selection;
  }
}
