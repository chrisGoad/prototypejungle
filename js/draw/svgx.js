/*global svgRoot controlled controlActivity controlCenter draggedControlName
draggedCustomControlName clickedInBox protoCustomBox controlCenter: true */


/*
 mouse handling
 
 
 Principle variables:
   
   iselnd: the object that has been selected. This might be a shape (circle etc), or it might be a control box
      There are two kinds of control boxes: the resizer boxes (blue), and the custom control boxes (yellow)
   controlled: the object being controlled (dragged resized etc). If a circle is being resized, for example, controlled will be the circle
     and iselnd will be the little blue box which the user is moving around for the resize
   vars.selectedNode This global is used from other modules. controlled is often selectedNode, but might also be its prototype (causing all instances
                     to be adjusted)
   controlActivity: the kind of control being exercised when the mouse is down. Options:  undefined (when no particular activity has been engaged)
                     draggingResizeControl, draggingCustomControl, shifting (meaning dragging controlled, as when dragging a circle around)
                     and panning
    There are  two other variables which affect the mode of operation: connectMode, and replace
    These are meaningful when shifting, 
                      
properties of a node relevant to mouse control. undraggable,unselectable,resizable


There is also a mode which affects the behavior of mouseDown:   if vars.addToPointSeries is defined,
 clicks do not select objects, as usually happens. Instead, vars.addToPointSeries is called on the clicked point. Escape terminates
*/

const controlActivity = 'panning';
//let SvgRoot
const SvgRoot = dom.SvgRoot;
let cZoomFactor;

let draggedControlName = 0;

const refresh = function (doFit) {
 
  dom.fullUpdate();
}
SvgRoot.visibleBounds = function () {
  let cn = this.contents;
  let cxf = cn.transform;
  let wd = this.__container.offsetWidth;
  let ht = this.__container.offsetHeight;
  let screenBounds = Point.mk(wd,ht).toRectangle();
  let tbnds = screenBounds.applyInverse(cxf);
  return tbnds;
}


SvgRoot.setZoom = function (trns,ns) {
  let cntr = Point.mk(this.width()/2,this.height()/2);// center of the screen
  let ocntr = trns.applyInverse(cntr);
  let ntx,nty,tr;
  trns.scale = ns;
  ntx = cntr.x - (ocntr.x) * ns;
  nty = cntr.y - (ocntr.y) * ns;
  tr = trns.translation;
  tr.x = ntx;
  tr.y = nty;
 // updateBoxSize();
}
  
  
const zoomStep = function (factor) {
	//debugger;
  let trns = dom.svgMain.contents.transform;
  if (!trns) {
    return;
  }
  let s = trns.scale;
  core.log("svg","zoom scaling",s);
  //updateControlBoxes('zooming');
  dom.svgMain.setZoom(trns,s*factor);
  //adjustGrid();
  dom.svgDraw();
}
  
let nowZooming = false;
let zoomFactor = 1.1;
let zoomInterval = 150;
const zoomer = function zoomer() {
  if (nowZooming) {
    zoomStep(cZoomFactor);
    setTimeout(zoomer,zoomInterval);
  }
}


const startZooming = function () {
  core.log("svg","start zoom");
  cZoomFactor = zoomFactor;
  if (!nowZooming) {
    nowZooming = true;
    zoomer();
  }
}
  
const startUnZooming = function () {
  cZoomFactor = 1/zoomFactor;
  if (!nowZooming) {
    nowZooming = true;
    zoomer();
  }
}

const stopZooming = function() {
	//debugger;
  core.log("svg","stop zoom");
  nowZooming = false;
}
  

const selectCallbacks = [];

  
// this is the nearest ancestor of the hovered object which has a forHover method
 
 // the node currently hovered over
 




const mouseMove = function (svgroot,cp)  {
	
  let pdelta,tr,delta,dr,s,npos,drm,xf;
	if (!cp) {
		debugger;//keep
	}

  /*if (nowRecording) {
    addToHistory('move',cp,ovr);
  }*/
  xf = svgroot.contents.transform;
  
  if (!xf) {
    return;
  }
  if (controlActivity === 'panning') {
		if (!svgroot.refPoint) {
			debugger;//keep
			return;
		}
    pdelta = cp.difference(svgroot.refPoint);
    tr = svgroot.contents.getTranslation();
    s = svgroot.contents.transform.scale;
    tr.x = svgroot.refTranslation.x + pdelta.x;// / s;
    tr.y = svgroot.refTranslation.y + pdelta.y;//
    core.log("svg","drag","doPan",pdelta.x,pdelta.y,s,tr.x,tr.y);
  //  adjustGrid();
    dom.svgMain.draw();
    return;
  }
 
}



const mouseMoveListener = function (svgroot,e) {
  e.preventDefault(); 
  let cp = svgroot.cursorPoint(e);
	if (!cp) {
		debugger;//keep
	}
  //let ovr = overNode(e);
  mouseMove(svgroot,cp);
  
}




let updateOnNextMouseUp = true;

let draggingOver;
let dragOverHighlighted;

const mouseUpOrOutListener = function (svgroot,e) {
  let cp;
  cp = svgroot.cursorPoint(e);
  mouseUpOrOut(svgroot,cp,e);//e.type === 'mouseup');
}

const mouseUpOrOut = function (svgroot,cp,e) {
  let svActivity = controlActivity;
  let svControlled = controlled;
//console.log('ca',controlActivity,'c',controlled);
   let isMouseUp = e.type === 'mouseup';
   /*if (nowRecording) {
    addToHistory('up',cp);
  }*/
  let xf,clickedPoint;
  xf = svgroot.contents.transform;
  clickedPoint = xf.applyInverse(cp);// in coordinates of content
  delete svgroot.refPoint;
  delete svgroot.refPos;
  delete svgroot.dragee;
  delete svgroot.refTranslation;
  core.log('control','controlActivity set to ',controlActivity);
 // showControl();
}

let connectMode = false;

const mouseDownListener = function (svgroot,e) {
	//debugger;
 if (vars.hideFilePulldown) {
    vars.hideFilePulldown();
  }
  core.log('control','MOUSEDOWN');
  //svgRoot = svgroot;

  e.preventDefault();
  let cp = svgroot.cursorPoint(e);
  //let clickedNode = overNode(e,'mousedown');
  mouseDown(svgroot,cp);//clickedNode);
}
let draggingInDiagram,draggingNoDiagram,controlled; //remove
const mouseDown = function (svgroot,cp,clickedNode) {
  //let selectionCandidate,xf,dra,rfp,clickedPoint,diagram;
  let xf,dra,rfp,clickedPoint,diagram;
  /*if (nowRecording) {
    addToHistory('down',cp,clickedNode);
  }*/
  draggingOver = undefined;
  connectMode = false;
  svgroot.refPoint = cp; // refpoint is in svg coords (ie before the viewing transformation)
  core.log('control',svgroot.refPoint);
  xf = svgroot.contents.transform;
  clickedPoint = xf.applyInverse(cp);// in coordinates of content
  svgroot.clickedPoint = clickedPoint;// in coordinates of content
	svgroot.refTranslation = svgroot.contents.getTranslation().copy();
}


SvgRoot.activateInspectorListeners = function () {
  let cel,thisHere;
  if (this.inspectorListenersActivated) {
    return;
  }
  cel = this.__element;
  thisHere = this;
  cel.addEventListener("mousedown",function (e) {mouseDownListener(thisHere,e);});     
  cel.addEventListener("mousemove",function (e) {mouseMoveListener(thisHere,e);});     
  cel.addEventListener("mouseup",function (e) {mouseUpOrOutListener(thisHere,e);});
  cel.addEventListener("mouseleave",function (e) {mouseUpOrOutListener(thisHere,e);});
  cel.addEventListener("dragover",(e) => {dragOverListener(this,e);},false);
  cel.addEventListener("drop",function (e) {dropListener(thisHere,e);});//{once:true});
  this.inspectorListenersActivated = true;
} 
   
// when inspecting dom, the canvas is a div, not really a canvas
SvgRoot.addButtons = function (navTo) {
  let plusbut,minusbut,navbut,div;
  this.navbut = navbut = html.Element.mk('<div class="button" style="position:absolute;top:0px">'+navTo+'</div>');
  navbut.__addToDom(div);
  div = this.__container;
  this.plusbut = plusbut = html.Element.mk('<div class="button" style="position:absolute;top:0px">+</div>');
  this.minusbut = minusbut = html.Element.mk('<div class="button" style="position:absolute;top:0px">&#8722;</div>');
  plusbut.__addToDom(div);
  minusbut.__addToDom(div);
  this.initButtons();
  }
  

SvgRoot.positionButtons = function (wd) {
  this.plusbut.$css({"left":(wd - 50)+"px"});
  this.minusbut.$css({"left":(wd - 30)+"px"});
  this.navbut.$css({"left":"0px"});
}

SvgRoot.initButtons = function () {
  this.plusbut.addEventListener("mousedown",startZooming);
  this.plusbut.addEventListener("mouseup",stopZooming);
  this.plusbut.addEventListener("mouseleave",stopZooming);
  this.minusbut.addEventListener("mousedown",startUnZooming);
  this.minusbut.addEventListener("mouseup",stopZooming);
  this.minusbut.addEventListener("mouseleave",stopZooming);
}

export {refresh,zoomStep};


