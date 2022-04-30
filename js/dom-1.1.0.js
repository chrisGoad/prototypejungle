// Copyright 2019 Chris Goad
// License: MIT

// the environment for this module

//import * as core from "/js/core-1.1.0.min.js";
import * as core from "/js/core-1.1.0.js";
//import * as geom from "/js/geom-1.1.0.min.js";
import * as geom from "/js/geom-1.1.0.js";

const codeRoot = core.codeRoot;
//const geomr = pjr.geom;
const Point = geom.Point;
const Rectangle = geom.Rectangle;
const Transform = geom.Transform;

export const vars = core.ObjectNode.mk();

// Copyright 2019 Chris Goad
// License: MIT

let data = codeRoot.set("data",core.ObjectNode.mk());
  data.__builtIn = true;

/* utilities for data
* A scale desaibes a mapping from data space to image space. The coverage of a scale is an interval
* in data space, and its extent an interval in image space
*/


    
data.set("LinearScale",core.ObjectNode.mk()).__namedType();
data.LinearScale.set("coverage",geom.Interval.mk(0,100));
data.LinearScale.set("extent",geom.Interval.mk(0,100));



data.LinearScale.setExtent = function (xt) {
  this.set("extent",(typeof xt ==="number")?geom.Interval.mk(0,xt):xt);
}

data.LinearScale.mk = function (cv,xt) {
  let rs = data.LinearScale.instantiate();
  if (cv) {
    rs.set("coverage",cv);
  }
  if (xt) {
    rs.setExtent(xt);
  }
  return rs;
}
  
data.LinearScale.eval = function (v) {
  let cv = this.coverage;
  let xt = this.extent;
  let sc = (xt.ub - xt.lb)/(cv.ub - cv.lb);
  return (this.isY)?xt.ub - sc * (v - cv.lb):xt.lb + sc * (v - cv.lb); // Y up 
}


data.LinearScale.dtToImScale = function () {
   let cv = this.coverage;
   let xt = this.extent;
   return (xt.ub-xt.lb)/(cv.ub - cv.lb);
}


data.LinearScale.label = function (dv) {
  return core.nDigits(dv,3);
}
// Copyright 2019 Chris Goad
// License: MIT

const domr = codeRoot.set("dom",core.ObjectNode.mk());

/* the two varieties of dom elements are svg.shape and html.Element
 * each particular element, such as an svg rect or an html div, is represented by its own prototype.
 */

domr.set("Element",core.ObjectNode.mk()).__namedType();
let Element = domr.Element;
/* how dom objects are represented: <tag att1=22 att2=23>abcd <tag2 id="abc"></tag2>
 The tag  names the prototype of this item. In svg mode the attributes are primitive __properties of the item.
 The id attribute determines the __name. Shorthand; instead of id="abc"  #abc will also work.

 example
 <chart.component.bubble <#caption>foob</#caption><#value>66</#value>
 item.bubbe.caption
 item.set("rectP","<rectangle style='color:red'>
dom.set("Style",core.ObjectNode.mk()).namedType();
*/
  
  
domr.set("Style",core.ObjectNode.mk()).__namedType();

let Style = domr.Style;

Style.mk = function (o) { 
  let rs = Object.create(Style);
  core.extend(rs,o);
  return rs;   
}
  

const parseStyle = function(st,dst) {
   let rs = dst?dst:Style.mk();
   let sp0 = st.split(';');
   sp0.forEach(function (c) {
     let sp1 = c.split(":");
     if (sp1.length===2) {
       rs[sp1[0]] = sp1[1];
     }
   });
   return rs;
 }


  
core.ObjectNode.__tag = function () {
  // march two prototypes p0 p1, adjacent elements of the prototype chain, down the chain
  // until p1 === svg.shape
  let p0 = this;
  let p1 = Object.getPrototypeOf(p0);
  while (true) {
    if ((p1 === SvgElement) || (codeRoot.html && (p1 === codeRoot.html.Element))) {
      return p0.__name;
    }
    if (p1 === core.ObjectNode) {
      return undefined;
    }
    p0 = p1;
    p1 = Object.getPrototypeOf(p1);
  }
}
// an Array functions as a <g>
core.ArrayNode.__tag = function () {
  return "g";
}

const isSvgTag = function (itag) {
  if (svg) {
    let tag = svg.tag;
    if (tag) {
      return tag[itag];
    }
  }
}
 
const toCamelCase = function (str) {
  let dashPos = str.indexOf("-"),
    beforeDash,oneAfterDash,rs;
  if (dashPos < 0) {
    return str;
  }
  beforeDash = str.substr(0,dashPos);
  oneAfterDash = str.substr(dashPos+2);
  rs = beforeDash + str[dashPos+1].toUpperCase() + oneAfterDash;
  return rs;
}
  
  
domr.Element.__setStyle = function () {
  let st = this.style;
  let el = this.__element;
  if (st && el) {
    core.mapNonCoreLeaves(st,function (sv,iprop) {
      let prop = toCamelCase(iprop); 
      el.style[prop] = sv;
    });
  }
}

Element.__applyDomMap = function () {
  let transfers = this.__domTransfers;
  let el = this.__element;
  let thisHere = this;
  if (transfers) {
    transfers.forEach(function (att) {
			
      let val = thisHere[att];
			/*if (att === 'points') {
				debugger;
			}*/
			if ((att === 'width') && (val < 0)) {
				debugger;
			}
      if (val !== undefined) {
        el.setAttribute(att,val);
      }
    });
  }
  if (this.setDomAttributes) {
    this.setDomAttributes(el);
  }
}

Element.__setAttributes = function (tag) {
  let forSvg = isSvgTag(tag);
  let tagv = forSvg?svg.tag[tag]:codeRoot.html.tag[tag];
  if (!tagv) {
     core.error('dom','uknown tag '+tag);
  }
  let el = this.__get("__element");
  let id,xf,tc,cl;
  if (!el) {
    return;
  }
  id = this.__svgId?this.__svgId:(this.id?this.id:this.__name);
  this.__applyDomMap();
  this.__setStyle();
  el.setAttribute('id',id);
  xf = this.transform;
  if (xf) {
    el.setAttribute("transform",xf.toSvg());
  }
  tc = this.text;
  if (tc  && (tag==="text")) {
    this.updateSvgText();
  }
  cl = this.class;
  if (cl) {
    el.className = cl;
  }
}


Element.__setAttribute = function (att,av) {
  let el;
  this[att] = av;
  el = this.__get("__element");
  if (el) {
    el.setAttribute(att,av);
  }
}

Element.setDomAttribute = Element.__setAttribute;

// the only attribute that an Array has is an id. This is only for use as the g element in svg
core.ArrayNode.__setAttributes = function () {
  let el = this.__get("__element");
  let id,vis;
  if (!el) {
    return;
  }
  id = this.id?this.id:this.__name;
  el.setAttribute("id",id);
  vis = this.visibility;
  if (vis) {
    el.setAttribute("visibility",vis);
  }
};
  
Element.__removeAttribute = function (att) {
  let el = this.__element;
  if (el) {
    el.removeAttribute(att);
  }
}
  
  
const stashDom = function (nd,stash) {
  let el = nd.__element;
  let cn = nd.__container;
  if (!(el||cn)) {
    return;
  }
  if (el) {
    stash.__element = el;
  }
  if (cn) {
    stash.__container = cn;
  }
  delete nd.__element;
  delete nd.__container;
  //delete nd.__domAttributes;
  core.forEachTreeProperty(nd,function (v,k) {
      let chst;
      if (stash) {
        chst = stash[k] = {};
      } else {
        chst = undefined;
      }
      stashDom(v,chst);
    });  
}

const restoreDom = function (nd,stash) {
  if (!stash) {
    return;
  }
  if (stash.__element) {
    nd.__element = stash.__element;
  }
  if (stash.__container) {
    nd.__container = stash.__container;
  }
  core.forEachTreeProperty(nd,function (ch,k) {
    let stch = stash[k];
    restoreDom(ch,stch);
  });
}
  

  
 
// for adding event listeners to the DOM for newly added Elements
const addEventListeners = function (el) {
  let cv = el;
  let eel = el.__element;
  let done = false;
  let evl;
  while (!done) {
    evl = cv.__get("__eventListeners");
    if (evl) {
      core.mapOwnProperties(evl,function (fns,nm) {
        fns.forEach(function (f) {eel.addEventListener(nm,f);});
      });
    }
    cv = Object.getPrototypeOf(cv);
    done = cv === Element;
  }
}
  
/* add this one element to the DOM. Does not recurse.
 * todo need to take __setIndex of this into account
 * appends to to the element of the parent, if present, ow uses rootEl
 */
Element.__addToDom1 = function (itag,rootEl) {
  let pr,pel,isLNode,forSvg,tag;
  let cel = this.__get("__element");
  if (cel) {
    return cel;
  }
  pr = this.__parent;
  if (pr) {
    pel = pr.__get("__element");
  }
  if (rootEl && !pel) {
    pel = rootEl;
    this.__container  = pel;//=rootEl;
  } else {
    if (!pel) {
      return;
    }
  }
  isLNode = core.ArrayNode.isPrototypeOf(this);
  forSvg =  isSvgTag(itag);
  tag = itag?itag:this.tagOf();
  cel = forSvg?document.createElementNS("http://www.w3.org/2000/svg",tag):document.createElement(tag);
  this.__element = cel;
  cel.__prototypeJungleElement = this;
  this.__setAttributes(tag,forSvg);
  if (!pel || !pel.appendChild) {
     core.error('dom','unexpected condition'); 
  }
  pel.appendChild(cel);
  if (this.__color__) {
    $(cel).spectrum({change:this.__newColor__,
      color:this.__color__,showInput:true,showInitial:true,preferredFormat:"rgb"});
  }
  if (!forSvg && this.text) {
    cel.innerHTML = this.text;
  }
   if (!isLNode && !forSvg)  {
    addEventListeners(this);
  }
  return cel;
}

  
  core.ArrayNode.__addToDom1 = Element.__addToDom1

Element.__addToDom =  function (rootEl,idepth) {
  let depth = idepth?idepth:0;
  let el = this.__get("__element");
  let tg = this.__tag();
  let wr;
  if (el) {
    this.__setAttributes(tg); // update 
  } else {
    if (this.visibility === 'hidden') {
      return;
    }
    wr = this.__wraps;// if this wraps an element already on the page, no need for a root.
    if (wr) {
      el = document.getElementById(wr);
      if (!el) {
        core.error('Missing element for wrap of ',wr);
        return;
      }
      if (el.tagName.toLowerCase() !== tg) {
        core.error('Tag mismatch for wrap of ',wr);
        return;
      }
      this.__element = el;
      this.__setAttributes(tg); // update 
    } else {
      el = this.__addToDom1(tg,rootEl);
    }
  }
  if (el) {
    this.__iterDomTree(function (ch) {
      ch.__addToDom(undefined,depth+1);
    },true); // iterate over objects only
  }
}
  
core.ArrayNode.__addToDom = function (unused,idepth) {
 let depth = idepth?idepth:0;
  Element.__addToDom.call(this,undefined,depth+1);
}

Element.draw = Element.__addToDom;

Element.updateAndDraw = function ()  {
  if (this.update) {
    this.update();
  } else {
    this.__update();
  }
  this.draw();
}

core.ArrayNode.draw = Element.__addToDom;
  
  Element.__installChild = function (nd) {
   let el = this.__element;
   let nel;
   if (!el) {
    return;
   }
   nel = core.getval(nd,"__element");
   if (nel) {
    return;
   }
   nd.__addToDom(el);
 }
 
 core.ArrayNode.__installChild = Element.__installChild;
 
  
Element.__mkFromTag = function (itag) {
  let tag = itag;
  let tv,rs,html,dv;
  if (tag) {
    tv = (svg&&(svg.tag))?svg.tag[tag]:undefined;
  }
  if (tv) {
    rs  = Object.create(tv);
  } else {
    html = codeRoot.html;
    if (!html) {
      core.error("No definition for tag",tag);
    }
    dv = html.tag[tag];
    if (dv) {
      rs = dv.instantiate();
    } else{
      core.error("No definition for tag",tag);
    }
  }
  return rs;
}


const __isDomEl = function (x) {
    if (core.ArrayNode.isPrototypeOf(x)) {
      return !x.__notInDom
    } else {
      return Element.isPrototypeOf(x);
    }
  }
  
  
        
Element.push = function (ind) {
  let nd,scnt;
  if (typeof ind === "string") {
    core.error("OBSOLETE option");
  } else {
    nd = ind;
    if (!__isDomEl(nd)) {
      core.error("Expected dom Element");
    }
  }
  scnt = core.getval(this,'__setCount');
  scnt = scnt?scnt+1:1;
  nd.__name  = scnt;
  this.__setCount = scnt;
  this[scnt] = nd;
  nd.__parent = this;
  this.__installChild(nd);
}
  
  
const removeElement = function (x) {
  let el = x.__element;
  if (el) {
    let pel = el.parentNode;
    if (pel) {
      pel.removeChild(el);
    }
  } 
  delete x.__element;
 // delete x.__domAttributes; 
}
  
  core.removeHooks.push(removeElement);

  // called just  before the main reparenting 
const reparentElement = function (x,newParent,newName) {
  let el = x.__element;
  let npEl = newParent.__element;
  let pel;
  if (el) {
    if (!npEl) {
      core.error(newParent.__name," is not in the svg tree in reparent");
    }
    pel = el.parentNode;
    if (pel) {
      pel.removeChild(el);
    }
    npEl.appendChild(el);
    if (!el.id) {
     el.setAttribute("id",newName);
    }
  } 
}

core.reparentHooks.push(reparentElement);

  
  
let tryParse = false;
let alwaysXMLparse = true; // didn't have luck with the html variant, for some reason. Later, use resig's javascript html parser
const parseWithDOM = function (s,forXML) {
  let  domParser,rs,dm;
  let prs = domParser;
  if (!prs) {
    domParser = prs = new DOMParser();// built into js
  }
  dm = prs.parseFromString(s,forXML||alwaysXMLparse?'application/xml':'text/html');
  if ((!dm) || (!dm.firstChild) || (dm.firstChild.tagName === "html")) { // an error message
    core.error("Error in parsing XML",s);
  }
  if (tryParse) {
    try {
      rs = domToElement(dm.childNodes[0],forXML);// the DOMParser returns the node wrapped in a document object
    } catch (e) {
      core.error("Error in parsing XML",s);
    }
  } else {
    rs = domToElement(dm.childNodes[0],forXML);// the DOMParser returns the node wrapped in a document object
  }
  return rs;
}

const sortByIndex = function (ar) {
  let cmf = function (a,b) {
    let ai = a.__setIndex;
    let bi;
    if (ai === undefined) {
      ai = parseInt(a.__name);
    }
    ai = isNaN(ai)?0:ai;
    bi = b.__setIndex;
    if (bi === undefined) {
      bi = parseInt(b.__name);
    }
    bi = isNaN(bi)?0:bi;
    return (ai < bi)?-1:1;
  }
  ar.sort(cmf);
}
  
  
  
core.ObjectNode.__iterDomTree = function (fn) {
  let ownprops = Object.getOwnPropertyNames(this);
  let thisHere = this;
  let sch = [];
  ownprops.forEach(function (k) {
    let ch;
    if (core.treeProperty(thisHere,k,true,true))  { //true: already known to be an owned property
      ch = thisHere[k];
      if (__isDomEl(ch)) {
        sch.push(ch);
      }
    }
  });// now sort by __setIndex
  sortByIndex(sch);
  sch.forEach(function (ch) {
    fn(ch,ch.__name);
  });
  return this;
}
  
core.ArrayNode.__iterDomTree = function (fn) {
  this.forEach((ch) => {
    if (__isDomEl(ch) && (ch.__parent === this)) {
      fn(ch);
    }
  });
  return this;
}
  
// this causes sets of ELements to be added to the DOM
 core.preSetChildHooks.push(function(node,nm) {
  // this needs to work before core.ComputedField is defined
  let prv = node.__get(nm);
  if (prv && __isDomEl(prv)) {
    let isArray = Array.isArray(node);
    removeElement(prv);
   // prv.remove(); changed to removeElement 3/22/19
  }
});
  
  
  
/* since order is important for drawing, order of set operations is preserved here.
 * specifically, each Object has a __setCount just counting how many sets have been done over time
 * each of its Node __children has a __setIndex, which was the value of __setCount when it was set
 * then drawing draws __children in setIndex order
 */

let disableAdditionToDomOnSet = false;


core.setChildHooks.push(function(node,nm,c) {
 // this needs to work before core.ComputedField is defined
 let scnt;
 if (disableAdditionToDomOnSet) {
   return;
 }
 if (__isDomEl(node)) {
   // keep track of shape and Arrays __children order
   if ((nm === "transform") && Transform.isPrototypeOf(c)) { //special treatment for transforms
     node.realizeTransform();
     return;
   }
   if (__isDomEl(c)) {
     scnt = node.__setCount;
     if (scnt === undefined) {
       scnt = 0;
     }
     scnt = scnt?scnt+1:1;
     node.__setCount = scnt;
     c.__setIndex = scnt;
     node.__installChild(c);
   }
 }
});


core.addToArrayHooks.push(function (node,c) {
  let ndom = __isDomEl(node),
    cdom = __isDomEl(c);
    
  if ((ndom || core.ArrayNode.isPrototypeOf(node)) && (cdom || core.ArrayNode.isPrototypeOf(c)) && (ndom || cdom)) {
    node.__installChild(c);
  }
});
   
   // an Element may have a property __eventListeners, which is a dictionary, each of whose
   // values is an array of functions, the listeners for the id of that value
  Element.addEventListener = function (id,fn) {
   let listeners = this.__get("__eventListeners");
   let element,listenerArray;
   if (!listeners) {
     listeners = core.ObjectNode.mk();
     this.set("__eventListeners",listeners);
   }
   element = this.__element;
   listenerArray = listeners[id]; 
   if (listenerArray===undefined) {
     listenerArray = listeners.set(id,core.ArrayNode.mk());
   }
   listenerArray.push(fn);
   if (element) {
     element.addEventListener(id,fn);
   }    
 }
  
  // remove listener needs to be applied at each object in the prototype chain, since __eventListeners can appear at various levels
Element.__removeEventListener1 = function (nm,f) {
  let ev = this.__get("__eventListeners");
  let evl,eel;
  if (!ev) {
    return;
  }
  evl = ev[nm];
  eel = this.__element;
  if (evl) {
    if (f === undefined) { // remove all listeners of this type
      delete ev[nm];
      if (eel) {
        evl.forEach(function (ff) {
          eel.removeEventListener(nm,ff);
        });
      }
    } else {
      let idx = evl.indexOf(f);
      if (idx >= 0) {
        evl.splice(idx,1);
      }
    }
  }
}
  
Element.removeEventListener = function (nm,f) {
 let eel = this.__element;
 let cv,done;
 if (eel && (f !== undefined)) { // remove all listeners of this type
   eel.removeEventListener(nm,f);
 }

 cv = this;
 done = false;
 while (!done) {
   cv.__removeEventListener1(nm,f);
   done = cv === Element;
   cv = Object.getPrototypeOf(cv);
 }
}
  
  
const getStyle = function (e) {
  let cst = e.style;
  if (!cst) {
    cst = Style.mk();
    e.set("style",cst);
  }
  return cst;
}
  
Element.__rootElement = function () { // find the most distant ancestor which is an Element
  let cv  = this;
  let nv;
  while (true) {
    nv = cv.__parent;
    if (!Element.isPrototypeOf(nv)) {
      return cv;
    }
    cv = nv;
  }
}
  
  // dom events are transduced into PrototypeJungle events if they are listened for  (not in use as of 2/18)
  
const findAncestorListeningFor = function (nd,evn) {
  let cv = nd;
  let lf;
  while (true) {
    lf = cv.__listenFor;
    if (lf && (lf.indexOf(evn)>=0)) {
      return cv;
    }
    cv = cv.__parent;
  }
}
const eventTransducer = function (e) {
  let trg = e.target.__prototypeJungleElement;
  let evn = e.type;
  let ev = core.Event.mk(trg,"dom_"+evn);
  ev.domEvent = e;
  ev.emit();
}
  
const addTransducers = function (nd,events) {
  let el = this.__element;
  if (el) {
    events.forEach(function (evn) {el.addEventListener(evn,svg.eventTransducer)});
  }
}
  
Element.__listenFor = function (events) {
    let el = this.__element;
    let prv = this.__listenFor;
    if (prv) {
      events.forEach(function (evn) {
        if (prv.indexOf(evn)<0) {
          prv.push(evn);
          if (el) {
            el.addEventListener(evn,svg.eventTransducer);
          }
        }
      });
    } else {
      this.set("__listenFor",core.lift(events));
      addTransducers(this,events);
    }
  }
 
  // used when nd is first added to the DOM
const addListenFors = function (nd) {
  let lf = nd.__listenFor;
  if (lf) {
    addTransducers(nd,lf);
  }
}
   
const elementWidth = function (node) {
  let el = node.__element;
  if (el) {
    return el.offsetWidth;
  }
}
  
  
const parentElementWidth = function (node) {
  let el = node.__element;
  let cel;
  if (el) {
    cel = el.parentNode;
    return cel.offsetWidth;
  }
}

  

const elementHeight = function (node) {
  let el = node.__element;
  if (el) {
    return el.offsetHeight;
  }
}
  
  
const parentElementHeight = function (node) {
  let el = node.__element;
  if (el) {
    let cel = el.parentNode;
    return cel.offsetHeight;
  }
}



core.ObjectNode.setData = function (xdt,dontUpdate) {
 this.data = xdt;
 this.__newData = true;
 if (!dontUpdate)  {
    this.__update();
  }
}
// sometimes, data needs processing. In this case, the internalized data is put in __idata
//core.ObjectNode.__dataInInternalForm  = function () {
core.ObjectNode.getData  = function () {
  return this.data;
}

export {Style,removeElement,parseWithDOM};


  // turning DOM object into JSON trees
// from https://developer.mozilla.org/en-US/docs/JXON
/*\
|*|
|*|  JXON Snippet #3 - Mozilla Developer Network
|*|
|*|  https://developer.mozilla.org/en-US/docs/JXON
|*|
\*/


// modified by cg to build PrototypeJungle dom.Elements rather than plain javascript object trees
function parseText (sValue) {
  if (/^\s*$/.test(sValue)) { return null; }
  if (/^(?:true|false)$/i.test(sValue)) { return sValue.toLowerCase() === "true"; }
  if (isFinite(sValue)) { return parseFloat(sValue); }
  return sValue;
}


function getJXONTree (oXMLParent,forXML) {
  var tv,nodeId, nLength = 0, sCollectedTxt = "",xf;
  var tag = oXMLParent.tagName;
  if (tag === "parsererror") {
    throw tag;
  }
  var vResult = Element.__mkFromTag(tag);
  if (oXMLParent.attributes) { // cg added the check for existence of method
    // cg also modified this to stash in attributes rather than things named @att
    for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
      var oAttrib = oXMLParent.attributes.item(nLength);
      var attName = oAttrib.name;//.toLowerCase();
      var attValue = parseText(oAttrib.value.trim());
      if (attName === "style") {
        var st = parseStyle(attValue);
        vResult.set("style",st);
      } else if (attName === "id") {
        vResult.__name = attValue; 
      } else if (attName === "transform") {
        var gxf = svg.stringToTransform(attValue);
        if (gxf) {
          vResult.set("transform",gxf);
        }
      } else {
        vResult[attName] = attValue;
      }
    }
  }
  if (oXMLParent.hasChildNodes()) {
    for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
      oNode = oXMLParent.childNodes.item(nItem);
      if (oNode.nodeType === 4) { sCollectedTxt += oNode.nodeValue; } /* nodeType is "CDATASection" (4) */
      else if (oNode.nodeType === 3) { sCollectedTxt += oNode.nodeValue.trim(); } /* nodeType is "Text" (3) */
      else if (oNode.nodeType === 1 && !oNode.prefix) { /* nodeType is "Element" (1) */
        if (nLength === 0) { }
        vContent = getJXONTree(oNode,oNode.tagName);
        var nm = vContent.__get("__name");
        if (nm) {
          vResult.set(nm,vContent);
        } else {
          vResult.push(vContent);
        }
        nLength++;
      }
    }
  }
  if (sCollectedTxt) {
    vResult.text= parseText(sCollectedTxt);
  }
  return vResult;
}

const domToElement = function (dm,forXML) {
  var tr = getJXONTree(dm);
  var rs = forXML||alwaysXMLparse?tr: tr[2][1];// wrapped in html/body if parsing html
  return  rs;
}


// Copyright 2019 Chris Goad
// License: MIT


// started, but not finished, obviously - cg 8/19
const compressTheNumbers = function (str) {
 /* let reg = RegExp('(\-*)(\d*)(\.*)(\d*)','g');
  let matches = str.matchAll(reg);
  for (const match of matches) {
    debugger;
  } */
  return str;
}

  
const  svg = codeRoot.set('svg',core.ObjectNode.mk());//just for supporting an old naming scheme svg.Element, as a synonym for dom.SvgElement
const mkWithVis = function (pr) {
  let rs = Object.create(pr);
  rs.visibility = "inherit";
  return rs;
}

const lessDigits = (n) => core.nDigits(n,5);

let svgNamespace = "http://www.w3.org/2000/svg";

// a Root is separate svg element. At the moment only one is in use: svgMain
let SvgRoot = Object.create(Element).__namedType();

SvgRoot.mk = function (container) {
  let rs = Object.create(SvgRoot);
  let cel,wd,ht;
  rs.fitFactor = 0.8; // a default;
  cel = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  cel.setAttribute("version","1.1");
  cel.style.background = 'white';
  cel.addEventListener("dragstart",function (event) {
    event.preventDefault();
  });
  rs.__element = cel;
  rs.__aPoint = cel.createSVGPoint();
  if (container) {
    rs.__container = container;
    container.appendChild(cel);
    wd = Math.max(container.offsetWidth-2,1);// -2 motivated by jsfiddle (ow boundary of containing div not visible)
    ht = Math.max(container.offsetHeight-2,1);
    cel.setAttribute('height',ht);
    cel.setAttribute('width',wd);
  }
 // rs.set("transform",vars.defaultTransform);

  return rs;
}

SvgRoot.cursorPoint = function (evt) {
  let core = this.__aPoint;
  let rs;
  core.x = evt.clientX;
  core.y = evt.clientY;
  rs = core.matrixTransform(this.__element.getScreenCTM().inverse());
  return Point.mk(rs.x,rs.y);
}

  
  
  
const wrapAsSvgRoot = function (node) {
  let rs = Object.create(SvgRoot);
  let cel;
  rs.contents = node;
  cel = node.__element;
  if (cel) {
    cel.addEventListener("dragstart",function (event) {
      event.preventDefault();
    });
    rs.__element = cel;
  }
  return rs;
}

let svgMain;
const setSvgMain = function (node) {
  svgMain = node;//svg.wrapAsRoot(node);
}

const fullUpdate = () => {
  svgMain.updateAndDraw();
}

SvgRoot.resize = function (wd,ht) {
  let cel = this.__element;
  if (cel) {
    cel.setAttribute("width",wd)
    cel.setAttribute("height",ht);
  }
  if (this.aRect) {
    this.addBackground();
  }
}
 
let SvgElement = Object.create(Element).__namedType();
SvgElement.mk = function () {
  let enm = SvgElement?SvgElement:'<g/>';
  return Object.create(enm)
};

svg.Element = SvgElement;

SvgElement.__svgStringR = function (dst) {
  let el;
  if (this.__hidden()) {
    return;
  }
  el = this.__element;
  if (el) {
    dst[0] += this.__outerHTML();
  }
}

SvgElement.__addChildren = function (ch) {
  let thisHere = this;
  ch.forEach(function (c) {
    thisHere.push(c);
  });
  return this;
}
  
/* outerHTML is not defined in IE edge or safari 
 * From http://www.yghboss.com/outerhtml-of-an-svg-element/
 * with jquery: $('<div>').append($(svgElement).clone()).html(); */

SvgElement.__outerHTML = function() {
  let el = this.__element;
  let oh,node,temp;
  if (!el) {
    return undefined;
  }
  oh = el.outerHTML;
  if (oh) {
    return oh;
  }
  temp = document.createElement('div');
  node = el.cloneNode(true);
  temp.appendChild(node);
  return temp.innerHTML;
}

SvgElement.__visible = function () {
  let v = this.visibility;
  return (v===undefined) || (v==="visible")||(v==="inherit");
}

  
  
SvgElement.__bringToFront = function () {
  let el = this.__element;
  let pel;
  if (el) {
    pel = el.parentNode;
    if (pel) {
      pel.removeChild(el);
    //svg.frontShape = this;
      pel.appendChild(el);
    }
  }
}

SvgElement.__moveToBack = function () {
  let el = this.__element;
  let pel;
  let exceptThis = [];
  if (el) {
    pel = el.parentNode;
    if (pel) {
      let cnt = 2;
      let children = this.__parent.__children();
      sortByIndex(children);
      this.__setIndex = 1;
      children.forEach( (child) => {
        if (child !== this) {
          let el = child.__element;
          if (el) {
            exceptThis.push(el);
            pel.removeChild(el);
            child.__setIndex = cnt++;
          }
        }
      });
      exceptThis.forEach((childEl) => {
        pel.appendChild(childEl);
      });
    }
  }
}

SvgElement.__children = function () {
  let rs = [];
  core.forEachTreeProperty(this,function (node) {
    if (SvgElement.isPrototypeOf(node)) {
      rs.push(node);
    }
  });
  return rs;
}

core.ArrayNode.__children = SvgElement.__children;

// readd all of the children with indices > index
SvgElement.__removeChildrenInFront = function (index) {
  let children = this.__children();
  sortByIndex(children);
  let pel = this.__element;
  let rs = [];
  children.forEach(function (child) {
    if (child.__setIndex > index) {
      let el = child.__element;
      if (el) {
        rs.push(el);
        pel.removeChild(el);
      }
    }
  });
  return rs;
}

core.ArrayNode.__removeChildrenInFront = SvgElement.__removeChildrenInFront;


// replaces a child while keeping the order of children
SvgElement.__replaceChild = function(child,replacement) {
  let vis = child.__visible();
  let pel = this.__element;
  let idx = child.__setIndex;
  let name = child.__name;
  let removed = this.__removeChildrenInFront(idx);
  if (vis) {
    replacement.unhide();
  }
  this.set(name,replacement);
  replacement.__setIndex = idx;
  removed.forEach(function (el) {
    pel.appendChild(el);
  });
}

core.ArrayNode.__replaceChild =  SvgElement.__replaceChild;

SvgElement.__reorderBySetIndex = function() {
  let pel = this.__element;
  let removed = this.__removeChildrenInFront(-1);//removes all children, and returns them in setIndex order
  removed.forEach(function (el) {
    pel.appendChild(el);
  });
}

SvgElement.__hidden = function () {
  return this.visibility === "hidden";
}

SvgElement.hidden = function () {
  return this.visibility === "hidden";
}

core.ArrayNode.__hidden = SvgElement.__hidden;

SvgElement.hide = function () {
  this.visibility = "hidden";
  if (this.__element) {
    this.draw();
  }
  return this;
}

SvgElement.show = function () {
  this.visibility = "inherit";
 // this.__isPrototype = false; //prototypes are never shown
  if (this.__get('__parent')) {
    this.draw();
  }
  return this;
}

SvgElement.unhide = function () {
  this.visibility = "inherit";
  return this;
}

SvgRoot.draw = function () {  
  let st = Date.now();
  let cn = this.contents;
  let tm;
  if (cn  && cn.__addToDom) {
    cn.__addToDom(this.__element);
  }
  tm = Date.now() - st;
  core.log("svg","Draw time",tm);
}

export function svgDraw () {
  if (svgMain) {
    svgMain.draw();
  }
}

SvgRoot.width = function () {
  let rs;
  let element = this.__element;
  if (element) {
    rs = element.clientWidth;
    if (rs === undefined) {
      return parseFloat(element.attributes.width.nodeValue);
    }
    return rs;
  }
}
  
SvgRoot.height = function () {
  let rs;
  let element = this.__element;
  if (element) {
    //rs = element.offsetHeight;
    rs = element.clientHeight;
    if (rs === undefined) {
      return parseFloat(element.attributes.height.nodeValue);
    }
    return rs;
  }
}

      
const svgCommonTransfers = ['visibility','stroke','stroke-opacity','stroke-width','stroke-linecap','fill','fill-opacity','filter'];


let tag = svg.set("tag",core.ObjectNode.mk());
tag.set("svg",SvgElement.mk()).__namedType();

tag.svg.__domTransfers = ['width','height','viewBox'];

tag.svg.mk = function () {
  return Object.create(tag.svg);
}


tag.set("g",SvgElement.mk()).__namedType();

tag.g.__domTransfers =svgCommonTransfers;


tag.g.mk = function () {
  return mkWithVis(tag.g);
}
// this is used for importing a svg document into PrototypeJungle

tag.set("svgDoc",SvgElement.mk()).__namedType();

tag.svgDoc.mk = function (content) {
  this.content = content;
}


tag.svgDoc.__svgStringR = function (dst) {
  let el;
  if (this.__hidden()) {
    return;
  }
  el = this.__element;
  if (el) {
    dst[0] += this.content;
  }
}


tag.set("image",SvgElement.mk()).__namedType();

tag.image.__domTransfers = ['width','height','href'];


tag.image.mk = function (width,height,url) {
  let rs = mkWithVis(tag.image);
  rs.href = url;
  rs.width = width;
  rs.height = height;
  rs.aspectRatio = width/height;
  return rs;
}


tag.image.setDomAttributes = function (element) {
  element.setAttribute('x',-0.5*this.width);
  element.setAttribute('y',-0.5*this.height);
};



tag.image.__svgStringR = function (dst) {
  let el;
  if (this.__hidden()) {
    return;
  }
  el = this.__element;
  vars.imageFound = true;
  let irs = this.__outerHTML().replace('href','xlink:href');
  if (el) {
    dst[0] += irs;
  } 
}

tag.set("line",SvgElement.mk()).__namedType();

tag.line.__domTransfers = svgCommonTransfers.concat(['x1','y1','x2','y2']);

const primSvgStringR = function(dst) {
  let el;
  if (this.__hidden()) {
    return;
  }
  el = this.__element;
  if (el) {
    let str = this.__outerHTML();
    let cstr = compressTheNumbers(str);;
    dst[0] += str;
  }
 }
  
tag.line.__svgStringR = function (dst) {
  let el;
  if (this.__hidden()) {
    return;
  }
  el = this.__element;
  if (el) {
    
    dst[0] += this.__outerHTML();
  }
}
  
tag.line.end1 = function () {
  return Point.mk(this.x1,this.y1);
}

tag.line.end2 = function () {
  return Point.mk(this.x2,this.y2);
}


tag.line.setEnd1 = function (p) {
  this.x1 = p.x;
  this.y1 = p.y;
}

tag.line.setEnd2 = function (p) {
  this.x2 = p.x;
  this.y2 = p.y;
}


tag.line.setEnds = function (e1,e2) {
  this.setEnd1(e1);
  this.setEnd2(e2);
}
  
  
tag.set("rect",SvgElement.mk()).__namedType();
tag.rect.__domTransfers = svgCommonTransfers.concat(['x','y','rx','ry','width','height']);

tag.rect.mk = function (x,y,width,height) {
  let rs = mkWithVis(tag.rect);
  if (x === undefined) {
    return rs;
  }
  rs.x = x;
  rs.y = y;
  rs.width = width;
  rs.height = height;
  return rs;
}
  

tag.rect.toRectangle = function (dst) {
  let crn,xt;
  if (dst) {
    crn = dst.corner;
    xt = dst.extent;
    crn.x = this.x;
    crn.y = this.y;
    xt.x = this.width;
    xt.y = this.height;
    return dst;
  } else {
    crn = Point.mk(this.x,this.y);
    xt = Point.mk(this.width,this.height);
    return Rectangle.mk(crn,xt);
  }
}
  

//tag.rect.__adjustable = true;

tag.rect.setColor = function (color) {
  this.fill = color;
}
Rectangle.toRect = function () {
  let rs = tag.rect.mk();
  rs.__enactBounds(this);
}




tag.rect.__svgStringR = function (dst) {
  let el;
  if (this.__hidden()) {
    return;
  }
  el = this.__element;
  if (el) {
    dst[0] += this.__outerHTML();
  }
}



  
tag.set("ellipse",SvgElement.mk()).__namedType();
tag.ellipse.__domTransfers = svgCommonTransfers.concat(['rx','ry','width','height']);



tag.ellipse.setColor = function (color) {
  this.fill = color;
}

tag.ellipse.__svgStringR = primSvgStringR;


const lessStringData = function (str) {
  let reg = /=\"(-?\d*\.?\d*)\"/g;
  let m = [...str.matchAll(reg)];
 // debugger;
  return m;
}

  
Transform.svgString = function () {
  let rs = 'transform="'
  let tr = this.translation;
  let sc;
  if (tr) {
    rs += 'translate('+lessDigits(tr.x)+' '+lessDigits(tr.y)+')'
  }
  sc = this.scale;
  if (typeof sc === 'number') {
    if (sc!==1) {
      rs += 'scale('+lessDigits(sc)+')';
    }
  } else if (sc) {
    rs += 'scale('+lessDigits(sc.x)+' '+lessDigits(sc.y)+')';
  }
  rs += '"';
  return rs;
}


tag.set("path",SvgElement.mk()).__namedType();

tag.path.__domTransfers = svgCommonTransfers.concat(['d']);

tag.path.__svgStringR = function (dst) {
  let el;
  if (this.__hidden()) {
    return;
  }
  el = this.__element;
  if (el) {
    let ohtml = this.__outerHTML();
    dst[0] += ohtml;
  }
}
tag.set("polyline",SvgElement.mk()).__namedType();

tag.polyline.__domTransfers =svgCommonTransfers.concat(['points']);

tag.polyline.__svgStringR = function (dst) {
  let el;
  if (this.__hidden()) {
    return;
  }
  el = this.__element;
  if (el) {
    dst[0] += this.__outerHTML();
  }
}
  
  
  
  tag.set("polygon",SvgElement.mk()).__namedType();
  
tag.polygon.__domTransfers = svgCommonTransfers.concat(['points']);

tag.polygon.__svgStringR = function (dst) {
  let el;
  if (this.__hidden()) {
    return;
  }
  el = this.__element;
  if (el) {
    dst[0] += this.__outerHTML();
  }
}


tag.set("linearGradient",SvgElement.mk()).__namedType();

tag.linearGradient.__domTransfers = svgCommonTransfers.concat(['x1','y1','x2','y2','gradientTransform']);

tag.set("radialGradient",SvgElement.mk()).__namedType();

tag.radialGradient.__domTransfers = svgCommonTransfers.concat(['r','cx','cy','fx','fy']);

tag.set("stop",SvgElement.mk()).__namedType();


tag.stop.__domTransfers = svgCommonTransfers.concat(['offset','stop-color','stop-opacity']);


tag.set("filter",SvgElement.mk()).__namedType();

//tag.radialGradient.__domTransfers = svgCommonTransfers.concat(['r','cx','cy','fx','fy']);
tag.set("feGaussianBlur",SvgElement.mk()).__namedType();

tag.feGaussianBlur.__domTransfers = svgCommonTransfers.concat(['stdDeviation','in']);


  /* For setting the points field of a polyline or polygon from an array of point, and from a mapping on the plane */
 
const toSvgPoints = function (points,f) {
  let rs = "";
  let p,mp;
  let n = points.length;
  for (let i=0;i<n;i++) {
    p = points[i];
    mp = f?f(p):p;
    rs += mp.x +",";
    rs += mp.y;
    if (i<n-1) {
      rs += ",";
    }
  }
  return rs;
}

SvgElement.hasHiddenDescendant  = function () {
  return !!core.findDescendant(this,function (node) {
    return node.visibility === 'hidden';
  });
}

SvgElement.boundsWithHidden = function (rt) {
  let el = this.__element;
  if (el) {
    let bb = el.getBBox();
    return tag.rect.toRectangle.call(bb);
  }
}

core.ArrayNode.boundsWithHidden = SvgElement.boundsWithHidden;


/* returns bound of this in the coordinates of rt, if rt is supplied; ow in this's own coords */
SvgElement.bounds = function (rt) {
  core.log('bounds','getBounds');
  let el = this.__element;
  let bb,gc,sc,grs;
  let localBnds,overallBnds;
  if (el) {
    let rects = [];
    if (this.visibility === 'hidden') {
      return undefined;
    }
    // for navaho.js the recursion fails for the root - unknown why
    if ((this !== core.root) && this.hasHiddenDescendant()) { // bbox includes hidden parts, but we do not wish to include them, so have to recurse
      core.log('bounds','has hidden descendant');
      let thisHere = this;
      core.forEachTreeProperty(this,function (child) {
        if ((child.__element) && (child.visibility !== 'hidden') && (child.bounds)) {
          let cbnds = child.bounds(thisHere);
          if (cbnds) {
            let ext = cbnds.extent;
            if ((ext.x !==0)||(ext.y !==0)) {
              rects.push(cbnds);
            }
          }
        } else {
          return undefined;
        }
      });
      if (rects.length === 0) {
        return undefined;
      } else if (rects.length === 1) {
        localBnds = rects[0];
      } else {
        localBnds = geom.boundsForRectangles(rects);
      }      
    } else {
      if (!el.getBBox) {
        core.log("svg","Missing getBBox method");
        return;
      }
      bb = el.getBBox();
      core.log("svg","BBOX ",bb);
      localBnds  = tag.rect.toRectangle.call(bb);
      
    }
    if (rt) {
      gc = this.toAncestorCoords(localBnds.corner,rt);
      sc = this.scalingRelAncestor(rt);
      core.log("svg","scaling down here",sc);
      grs = Rectangle.mk(gc,localBnds.extent.times(sc));
      core.log("svg","scaling ",sc,'extent',grs.extent.x,grs.extent.y);
      return grs;
    } else {
      return localBnds;
    }
  }
}

const centerOnOrigin = function (iitem) {
  let item = iitem?iitem:core.root;
  let bnds = item.bounds();
  let mcenter = bnds.center().minus();
  core.forEachTreeProperty(item,function (child) {
    if (SvgElement.isPrototypeOf(child)) {
      let tr = child.getTranslation();
      let newPos = tr.plus(mcenter);
      child.moveto(newPos);
    }
  });
  let xt=bnds.extent;
  item.width = xt.x;
  item.height = xt.y;
  
  
}
    

  
// mostly used for debugging
const showRectangle = function (bnds) {
  let ext = bnds.extent;
  let crn = bnds.corner;
  let nm =   core.autoname(core.root,'rectangle');
  core.root.set(nm,SvgElement.mk(
   '<rect x="'+crn.x+'" y="'+crn.y+'" width="'+ext.x+'" height="'+ext.y+
   '" stroke="red" stroke-width="2" fill="transparent"/>'));
}

const visibleSvgChildren = function (node) {
  let allVisible = true;
  let noneVisible = true;
  let rs = [];
  core.forEachTreeProperty(node,function (child) {
    if (SvgElement.isPrototypeOf(child)) {
      if  (child.visibility === "hidden") {
        allVisible = false;
      } else {
        noneVisible = false;
        rs.push(child);
      }
    }
  });
  return noneVisible?rs:(allVisible?"all":rs);
}
   
// only goes one layer deep; used to exclude surrounders from root, currently
const boundsOnVisible = function  (node,root) {
  let visChildren = visibleSvgChildren(node);
  let rs;
  if (visChildren === "all") {
    return node.bounds(root);
  } else {
    if (visChildren.length === 0) {
      return undefined;
    }
    visChildren.forEach(function (child) {
      let bnds = child.bounds(root);
      if (rs) {
        rs = rs.extendBy(bnds);
      } else {
        rs = bnds;
      }
    });
    return rs;
  }
}
  

  let highlights = [];
  let highlightedNodes = []
  //let numHighlightsInUse = 0;
let stdHighlightFill = "rgba(0,0,255,0.4)";

const allocateHighlights = function (n) {
  let ln = highlights.length;
  for (let i=ln;i<n;i++) {
    let highlight = document.createElementNS("http://www.w3.org/2000/svg",'rect');
    svgMain.contents.__element.appendChild(highlight);
    highlight.setAttribute("fill",stdHighlightFill);
    highlight.setAttribute("stroke","rgba(255,0,0,0.4)");
    highlight.setAttribute("stroke-width","5");
    highlight.style["pointer-events"] = "none";
    highlights.push(highlight);
  }
}

let highlightBounds;

const highlightNode = function (node,highlight,isExtra) {
  let bounds,root,ebounds;
  if (!node.bounds) {
    return;
  }
  bounds = node.bounds(core.root);//svgMain);
  if (bounds) {
    ebounds = bounds.expandBy(20,20);
    if (isExtra) {
      highlightBounds = ebounds;
    }
    highlight.style.display = "block";
    let extent,corner;
    ({extent,corner} = ebounds);
    highlight.setAttribute("width",extent.x)
    highlight.setAttribute("height",extent.y);
    highlight.setAttribute("x",corner.x);
    highlight.setAttribute("y",corner.y);
    node.__highlight = highlight;
    highlightedNodes.push(node);
  }
}

const changeHighlightColor = function (highlight,color) {
  highlight.setAttribute("fill",color);
}
let extraNodeHighlighted;
// needed for addToCohort
const highlightExtraNode = function (node) {
  let ln = highlightedNodes.length;
  let ui = core.ui;
  if (extraNodeHighlighted) {
    if (extraNodeHighlighted === node) {
      return;
    } else if (node) { // replace the node begin highlighted
      highlightedNodes.pop();
      highlightNode(node,highlights[ln-1],true);
      extraNodeHighlighted = node;
    } else {
      highlights[ln-1].style.display = "none";
      highlightedNodes.pop();
      extraNodeHighlighted = undefined;
      highlightBounds = undefined;

    }
  } else if (node) { // add a node to highlight
    allocateHighlights(ln+1);
    highlightNode(node,highlights[ln],true);
    extraNodeHighlighted = node;
  } else {
    extraNodeHighlighted = undefined;
    highlightBounds = undefined;
  }
} 
  
const highlightNodes = function (inodes) {
  highlightExtraNode(undefined);
  let nodes = inodes.filter(function (node) {return node.__hidden && !node.__hidden()});
  highlightedNodes.length = 0;
  let ln = nodes.length;
  allocateHighlights(ln);
  for (let i=0;i<ln;i++) {
    highlightNode(nodes[i],highlights[i]);
  }
}



const unhighlight = function () {
  highlights.forEach(function (highlight) {
    highlight.style.display = "none";
    highlight.setAttribute("fill",stdHighlightFill);

  });
  highlightedNodes.forEach(function (node) {
    node.__highlight = undefined;
  });
  extraNodeHighlighted = undefined;
  highlightBounds = undefined;
}
  

SvgElement.getBBox = function () {
  core.log('bounds','getBBox');
  let el = this.__element;
  if (el) {
    return el.getBBox();
  }
}

SvgElement.__getCTM = function () {
  let el = this.__element;
  if (el) {
    return el.getCTM();
  }
}
SvgElement.__getHeight = function () {
  let el = this.__element;
  if (el) {
    return el.getBBox().height;
  } else {
    return 0;
  }
}


tag.set("circle",SvgElement.mk()).__namedType();
tag.circle.__domTransfers = svgCommonTransfers.concat(['cx','cy','r']);

//tag.circle.set("attributes",core.lift({r:"N",cx:"N",cy:"S"}));

tag.circle.setColor = function (color) {
  this.fill = color;
}
tag.circle.__getExtent = function () {
  let diam = 2 * this.r;
  return Point.mk(diam,diam);
}


//tag.circle.__adjustable = true;

tag.circle.__svgStringR = primSvgStringR;

tag.set("text",SvgElement.mk()).__namedType();
tag.text.set({"font-family":"Arial","font-size":"10",fill:"black","stroke-width":0.5,"text-anchor":"middle","alignment-baseline":"central"});
//tag.text.set({"font-family":"Arial","font-size":"10",fill:"black","stroke-width":0.5,"alignment-baseline":"central"});
tag.text.mk = function (txt) {
  let rs = mkWithVis(tag.text);
  if (txt!==undefined) {
    rs.setText(txt);
  }
  return rs;
}

tag.text.__domTransfers =  
svgCommonTransfers.concat(['x','y','stroke-width','font-style','font-weight','font-family',
                          //'font-size','alignment-baseline']);
                          'font-size','alignment-baseline','text-anchor']);


tag.text.update = function () {
  let d = this.__data;
  let tp = typeof d;
  if (tp === "number") {
    this.setText(String(d));
  } else if (tp === "string") {
    this.setText(d);
  }
}


let defaultTextPropertyValues = 
         {"font-size":"12",
         "font-style":"normal",
         "font-family":"arial",
         "font-weight":"normal",
         "stroke":"black"
         };


let textProperties = Object.getOwnPropertyNames(defaultTextPropertyValues);

tag.set("tspan",SvgElement.mk()).__namedType();
tag.tspan.mk = function () {return Object.create(tag.tspan)};

tag.tspan.__domTransfers  = svgCommonTransfers.concat(['x','y','dx','dy','font-family','font-size']);
  
tag.text.__svgStringR = function (dst) {
  let el;
  if (this.__hidden()) {
    return;
  }
  el = this.__element;
  if (el) {
    dst[0] += this.__outerHTML();
  }
}
const SvgElementPath = function (el) {
  let rs = [];
  let cel = el;
  while (cel.tagName !== "svg") {
    rs.push(cel.id);
    cel = cel.parentNode;
  }
  rs.pop(); // don't need that last step
  rs.reverse();
  return rs;
}
  
core.ObjectNode.__isShape = function () {
  return SvgElement.isPrototypeOf(this);
}

core.ArrayNode.__isShape = function () {
  return true; 
}

tag.text.setText = function (itxt)  {
  let txt = String(itxt);
  this.text = txt;
   if (itxt === '\n') {
    return;
  }
  this.updateSvgText();
} 
  
   
tag.text.center = function () {
  let size = this['font-size']; 
  this.y = size/3;  
}

  
  tag.text.updateSvgText  = function ()  {
   let el = this.__get("__element");
   let fc,txt,tn;
   if (!el) {
    return;
   }
   fc = el.firstChild;
   txt = this.text;
   //txt = 'ab \u0398';
   if (txt === '\n') {
     return;
   }
   if (fc && (fc.nodeType === 3)) {
     fc.textContent = txt;
   } else { // needs to be added
     tn = document.createTextNode(txt);
     el.appendChild(tn);
   }
 }
  
tag.set("clipPath",SvgElement.mk()).__namedType(); //tags are lower case
tag.set("defs",SvgElement.mk()).__namedType();


tag.defs.__domTransfers = ['gradient'];
  
const stringToSvgTransform = function (s) {
    let mt = s.match(/translate\(([^ ]*)( +)([^ ]*)\)/)
    if (mt) {
      return geom.mkTranslation(parseFloat(mt[1]),parseFloat(mt[3]));
    }
  }
    
Transform.toSvg = function () {
  let tr = this.translation;
  let sc = this.scale;
  let rt = this.rotation;
  let {x,y} = tr;
  if (isNaN(x)||isNaN(y)||isNaN(sc)) {
    core.error('svg','NaN in transform');
  }
  let rs = 'translate('+tr.x+' '+tr.y+')';
  if (sc) {
    rs += 'scale('+sc+')';
  }
  if (rt) {
    rs += 'rotate('+rt+')';
  }
  return rs;
}
  // bounds computations:
  
  
 
  
svg.set("Rgb",core.ObjectNode.mk()).__namedType();

SvgElement.realizeTransform  = function () {
  let xf = this.transform;
  let el = this.__element;
  let svgXf;
  if (el && xf) {
    svgXf = xf.toSvg();
    el.setAttribute("transform",svgXf);
  }
}
      
   
 
  // returns the transform that will fit bnds into the svg element, with fit factor ff (0.9 means the outer 0.05 will be padding)
 SvgRoot.fitBoundsInto = function (bnds,fitFactor) {
  let ff = fitFactor?fitFactor:this.fitFactor;
  let wd = this.__container.offsetWidth;
  let ht = this.__container.offsetHeight;
   let dst = Point.mk(wd,ht).toRectangle().scaleCentered(ff);
   let rs = bnds.transformTo(dst);
   core.log("svg","fitting ",bnds," into ",wd,ht," factor ",ff);
   return rs;
 }
 
 SvgRoot.boundsFitIntoPanel  = function (fitFactor) {
  let cn = this.contents;
  let bnds = cn.bounds();
  let cxf = cn.transform;
  let tbnds = bnds.applyTransform(cxf);
  let ff = fitFactor?fitFactor:this.fitFactor;
  let wd = this.__container.offsetWidth;
  let ht = this.__container.offsetHeight;
  let dst = Point.mk(wd,ht).toRectangle().scaleCentered(ff);
  return dst.containsRectangle(tbnds);
 }
 

svg.stdExtent = Point.mk(400,300);
svg.fitStdExtent = true; 
SvgRoot.fitContentsTransform = function (fitFactor) {
  let cn = this.contents;
  let bnds;
  if (!cn) {
    return undefined;
  }
  if (!cn.bounds) {
    return undefined;
  }
  bnds = cn.bounds();
  // don't take the Element's own transform into account; that is what we are trying to compute!
  if (!bnds) {
    return;
  }
  let zeroBnds = (bnds.extent.x === 0) && (bnds.extent.y === 0);
  ///let expanded = svg.fitStdExtent?bnds.expandTo(svg.stdExtent.x,svg.stdExtent.y):bnds;
  let expanded = zeroBnds?bnds.expandTo(svg.stdExtent.x,svg.stdExtent.y):bnds;
  return this.fitBoundsInto(expanded,fitFactor);
}
 
SvgRoot.fitItem = function (item,fitFactor) {
  let bnds = item.bounds();
  let xf = this.fitBoundsInto(bnds,fitFactor);
  let cn = this.contents;
  cn.set("transform",xf);
  cn.draw();

}
SvgRoot.fitContents = function (fitFactor,dontDraw,onlyIfNeeded) {
  let cn = this.contents;
  let ff,fitAdjust,cxf,xf;
  if (!dontDraw) {
    cn.draw();
  }
  ff = fitFactor?fitFactor:this.fitFactor;
  if (!ff) {
    ff = this.fitFactor;
  }
  fitAdjust = this.contents.fitAdjust;
  if (onlyIfNeeded) {
    if (this.boundsFitIntoPanel(ff)) {
      return;
    }
  }
  let newXf = this.fitContentsTransform(ff);
  if (!newXf) {
    newXf = vars.defaultTransform;
  }
  cxf = cn.transform;
  if (cxf) {
	cxf.copyto(newXf);
  } else {
	cn.set("transform",newXf);
  }
  if (fitAdjust) {
    cn.transform.translation.copyto(newXf.translation.plus(fitAdjust));
  }
  cn.draw();
}

SvgRoot.fitContentsIfNeeded = function(fitFactor,dontDraw) {
  let ff = fitFactor?fitFactor:0.8;
  this.fitContents(ff,dontDraw,true);
}
  
 
   
SvgRoot.fitBounds = function (fitFactor,bounds) {
  let cn = this.contents;
  let xf = this.fitBoundsInto(bounds,fitFactor);
  //return xf;
  let cxf = cn.transform;
  if (cxf) {
    cn.__removeAttribute("transform");
  }
  this.contents.set("transform",xf);
  this.draw();
}

  
svg.drawAll = function () { // svg and trees
  svg.draw();//  __get all the latest into svg
  svgMain.fitContents();
  svg.draw();
}

svg.fitContents = function (ifit) {
  let fit = ifit?ifit:0.9
   svgMain.fitContents(fit);
}
core.ArrayNode.__svgClear = function () { 
  let el = this.__element;
  if (el) {
    this.forEach(function (x) {
      if (typeof x === 'object') {
        x.remove();
      }
    });
  }
  this.length = 0;
}


core.ObjectNode.__svgClear = function () {
  let el = this.__element;
  if (el) {
    this.__iterDomTree(function (x) {
      x.remove();
    });
  }
}

SvgElement.mk = function (s) {
  let enm = s?s:'<g/>';
  if (!s) {
    debugger;
  }
  let hasVis = false;
  let rs,ops,pv;
  if (enm) {
    rs = parseWithDOM(enm,true);
    // introduce computed __values
    ops = Object.getOwnPropertyNames(rs);
    ops.forEach(function (p) {
      if (p === "visibility") {
        hasVis = true;
      }
      pv = rs[p];
      if (typeof pv==="string") {
        if (pv.indexOf("function ")===0) {
          rs.setcf(p,pv);
        }
      }
    });
  } else {
    rs = Object.create(SvgElement);
  }
  if (!hasVis) {
    rs.visibility = "inherit";
  }
  return rs;
}
  
SvgRoot.eventToNode = function (e) {
  return e.target.__prototypeJungleElement;
}


SvgRoot.addBackground = function () {
   let cl = this.contents?this.contents.backgroundColor:"white";
   let el =  this.__element;
   if (el) {
     el.style["background-color"] = cl;
   }
}
  
svg.__rootElement = function (nd) {
  let cv =nd;
  let pr;
  while (true) {
    pr = cv.__get('__parent');
    if (!(core.SvgElement.isPrototypeOf(pr)||core.ArrayNode.isPrototypeOf(pr))) {
      return cv;
    }
    cv = pr;
  }
}


vars.fullUpdateHooks = [];

SvgRoot.updateAndDraw = function (doFit,newFrame=true) {
  let itm = this.contents;
  if (itm.update) {
    itm.__update();
  } else {
    core.updateParts(itm,function (part) {
      return (!core.isPrototype(part)) && SvgElement.isPrototypeOf(part) && part.__visible();
    });
  }
  vars.fullUpdateHooks.forEach((fn) => fn());
  if (itm.draw) {
    itm.draw();
    this.addBackground(); 
    if (doFit) {
      this.fitContents();
    }
  }
}
    
 
svg.stdColors = ["rgb(100,100,200)","rgb(100,200,100)","red","yellow","red","rgb(244,105,33)","rgb(99,203,154)","rgb(207,121,0)","rgb(209,224,58)","rgb(51, 97, 204)","rgb(216,40,165)",
                   "rgb(109,244,128)","rgb(77,134,9)","rgb(1,219,43)","rgb(182,52,141)","rgb(48,202,20)","rgb(191,236,152)",
                   "rgb(112,186,127)","rgb(45,157,87)","rgb(80,205,24)","rgb(250,172,121)","rgb(200,109,204)","rgb(125,10,91)",
                   "rgb(8,188,123)","rgb(82,108,214)"];
const stdColor = function (n) {
  if (n < svg.stdColors.length) {
    return svg.stdColors[n];
  } else {
    return svg.randomRgb();
  }
}
  
  // fills in an  array mapping categories to colors with default values
svg.stdColorsForCategories = function (colors,categories) {
  let cnt = 0;
  let ln = svg.stdColors.length;
  categories.forEach(function (category) {
    if (!colors[category]) {
      colors[category] = svg.stdColors[cnt%ln];
    }
    cnt++;
  });
}

core.defineSpread(tag.g.mk);

const isGeometric = function (nd) {
  return SvgElement.isPrototypeOf(nd);
}
geom.defineGeometric(SvgElement,isGeometric); 

svg.svgAncestor = function (node) {
  let current = node;
  while (true) {
    if (svg.tag.svg.isPrototypeOf(current)) {
      return current;
    } else {
      if (current.__container) {
        return svgMain;
      }
      current = current.__parent;
      if (!current) {
        return undefined;
      }
    }
  }
}

tag.text.__getExtent = function () {
  let bb = this.getBBox();
  return Point.mk(bb.width,bb.height);
}

tag.text.__holdsExtent = function () {
  return this.hasOwnProperty('font-size');
}

SvgElement.__getExtent = function () {
  return Point.mk(this.width,this.height);
}


SvgElement.__removeIfHidden = function () {
  if (this.__hidden()) {
    this.remove();
  } else {
    this.__iterDomTree(function (ch) {
        ch.__removeIfHidden();
      },true); 
  }
}

SvgElement.getScale = function () {
  let xf = this.transform;
  if (xf) {
    return xf.scale;
  }
  return 1;
}
core.ArrayNode.__removeIfHidden = SvgElement.__removeIfHidden;


// color utilities

svg.colorTable = {blue:'#0000FF',
                  red:'#FF0000',
                  green:'#00FF00'};
                  
const parseColor  =  function (color) {
  if (color[0] === '#') {
    return {r:parseInt(color.substr(1,2),16),
            g:parseInt(color.substr(3,2),16),
            b:parseInt(color.substr(5,2),16)};
  }
  let m = color.match(/^rgb\( *(\d*) *, *(\d*) *, *(\d*) *\)$/);
  if (m) {
    return {r:Number(m[1]),g:Number(m[2]),b:Number(m[3])}
  } else {
    let lkup = svg.colorTable[color];
    if (lkup) {
      return svg.parseColor(lkup);
    } else {
      return null;
    }
  }
}

const isVisible =  function (inh) {
      return SvgElement.isPrototypeOf(inh) && inh.__visible()
    //code
};

core.ObjectNode.__updateVisibleInheritors = function () {
  core.updateInheritors(this,function (x) {x.__update()},isVisible);
 
}


core.ObjectNode.__forVisibleInheritors = function (fn) {
  core.forInheritors(this,fn,isVisible);
}

const updateVisibleParts = function (node) {
  core.updateParts(node,
    function (part) {
      return SvgElement.isPrototypeOf(part) && part.__visible();
  });
}

const newDomItem = function () {
  return svg.Element.mk('<g/>');
}

core.setItemConstructor(newDomItem);


const installRoot = function (itm) {
  if (itm) {
    core.setRoot(itm);
  }
  if (svgMain.contents) {
    dom.removeElement(svgMain.contents);
  }
  svgMain.contents=core.root;
  svgDraw();
}

core.vars.installRoot = installRoot;
core.vars.refresh = svgDraw;

core.afterRestoreStateHooks.push(fullUpdate);


const stdTransferredProperties = ['stroke','stroke-width','fill','role','text'];


export {SvgRoot,SvgElement,tag as SvgTag,setSvgMain,svgMain,unhighlight,svg,highlightNodes,highlightBounds,
        highlightExtraNode,centerOnOrigin,fullUpdate,stdTransferredProperties,installRoot,
        defaultTextPropertyValues,textProperties};// Copyright 2019 Chris Goad
// License: MIT

let html =  codeRoot.set("html",core.ObjectNode.mk());

html.set("Element",Object.create(Element)).__namedType(); // dom elements other than svg

let htag = html.set("tag",core.ObjectNode.mk());
htag.set("html",html.Element.instantiate()).__namedType();// the top level doc
htag.set("head",html.Element.instantiate()).__namedType();
htag.set("body",html.Element.instantiate()).__namedType();
htag.set("div",html.Element.instantiate()).__namedType();
htag.set("span",html.Element.instantiate()).__namedType();
htag.set("select",html.Element.instantiate()).__namedType();
htag.set("option",html.Element.instantiate()).__namedType();
htag.set("pre",html.Element.instantiate()).__namedType();
htag.set("img",html.Element.instantiate()).__namedType();
htag.set("p",html.Element.instantiate()).__namedType();
htag.set("a",html.Element.instantiate()).__namedType();
htag.set("input",html.Element.instantiate()).__namedType();
htag.set("iframe",html.Element.instantiate()).__namedType();
htag.set("textarea",html.Element.instantiate()).__namedType();

html.commonTransfers = ['href','type','src','width','height','scrolling'];


html.Element.__domTransfers = html.commonTransfers;

htag.select.__domTransfers = html.commonTransfers.concat(['selectedIndex']);

htag.option.__domTransfers = html.commonTransfers.concat(['selected']);

htag.textarea.__domTransfers = html.commonTransfers.concat(['rows','cols']);
htag.input.__domTransfers = html.commonTransfers.concat(['size','value']);

html.Element.__mkFromTag = function (tag) {
  let tv,rs;
  if (tag) {
    tv = html.tag[tag];
  }
  if (tv) {
    rs  = Object.create(tv);
    rs.set("_eventListeners",core.Object.mk());
  } else {
    core.error("This html tag is not implemented",tag);
  }
  return rs;
}
  
  
html.wrap = function (nm,tg,prps) {
  let el,rs;
  if (nm) {
    el = document.getElementById(nm);
  }
  if (el) {
    if (tg !== el.tagName.toLowerCase()) {
      core.error('Tag mismatch for wrap of ',nm);
      return;
    }
  }    
  rs = Element.__mkFromTag(tg);
  core.setProperties(rs,prps);
  if (el) {
    rs.__element = el;
  }
  rs.__wraps = nm;
  return rs;
}

/* this will be used for compatability with old scheme for a while */
  
html.Element.addChild = function (a1,a2) {
  let ch;
  if (a2 === undefined) {
    ch = a1;
    if (!ch) {
       core.error('html','unexpected condition'); 
    }
    if (ch.__get("__name")) {
      this.set(ch.__name,ch);
    } else {
      this.push(ch);
    }
  } else {
    this.set(a1,a2);
  }
  return this;
}

html.Element.__addChildren = function (ch) {
  let thisHere = this;
  ch.forEach(function (c) {
    if (c) {
      thisHere.addChild(c);
    }
  });
  return this;
}
  
  
html.Element.mk = function (s) {
  let rs;
  if (s) {
    rs = parseWithDOM(s,false);
  }
  if (!rs) {
     core.error('html','unexpected condition'); 
  }
  return rs;
}
  
html.Element.$html = function (h) {
  let eel = this.__element;
  let txt;
  if (typeof h === 'string') {
    this.text = h;
    if (eel) { 
      eel.innerHTML = h;
    }
  } else { 
    if (eel) {
      txt = eel.innerHTML;
      this.text = txt;
      return txt;
    }
  }
}
  
html.Element.$focus = function () {
  let eel = this.__element;
  if (eel) {
    eel.focus();
  }
}
  
    
html.Element.$select = function () {
  let eel = this.__element;
  if (eel) {
    eel.select();
  }
}
  
  
  
html.styleToString = function (st) {
  let prps=Object.getOwnPropertyNames(st);
  let cl = prps.map(function (p) {return '"'+p+'":"'+st[p]+'"'});
  return cl.join(";");
}
  

html.Element.$css = function (ist,v) {
  let cst = getStyle(this);
  let eel,st,prps;
  if (typeof ist === "string") {
    if (v) {
      cst[ist] = v;
      eel =  this.__element;
      if (eel) {
        eel.style[ist] = v;
      }
      return;
    }
    st = parseStyle(ist);
  } else {
    st = ist;
  }
  prps=Object.getOwnPropertyNames(st);
  prps.forEach(function (p) {cst[p] = st[p]});
  this.__setStyle();
}

html.Element.$attr = function (att,v) {
  let prps;
  if (typeof att==="string") {
    this.__setAttribute(att,v);
  } else {
    prps=Object.getOwnPropertyNames(att);
    prps.forEach(function (p) {this[p] = att[p]});
    this.__setAttributes();
  }
}

  
html.Element.$prop= function (p,v) {
  let eel;
  this[p] = v;
  eel = this.__element;
  if (eel) {
    eel[p] = v;
  }
}


html.Element.$setStyle = function (att,value) {
  let cst = getStyle(this);
  let eel;
  cst[att] = value;
  eel = this.__element;
  if (eel) {
    eel.style[att] = value;
  }
}

html.Element.$hide = function () {
  this.$setStyle('display','none');
}

html.Element.$show = function () {
  this.$setStyle('display','');
}

html.Element.setVisibility = function (v) {
  if (v) {
    this.$show();
  } else {
    this.$hide();
  }
}


html.Element.$click = function (fn) {
  this.addEventListener("click",fn);
}


html.Element.$mouseup = function (fn) {
  this.addEventListener("mouseup",fn);
}
  
  
html.Element.$change = function (fn) {
  this.addEventListener("change",fn);
}


html.Element.$enter = function (fn) {
  this.addEventListener("enter",fn);
}
  
  
  
html.Element.$dblclick = function (fn) {
   this.addEventListener("dblclick",fn);
}
  
  
html.Element.$offset = function () {
  let eel = this.__element;
  let rect,x,y;
  if (eel) {
    rect = eel.getBoundingClientRect();
    y = rect.top + document.body.scrollTop;
    x = rect.left + document.body.scrollLeft;
    return Point.mk(x,y);
  }
}
  
Element.$height = function () {
  let eel = this.__element;
  if (eel) {
    return eel.offsetHeight;
  }
}


Element.$width = function () {
  let eel = this.__element;
  if (eel) {
    return eel.offsetWidth;
  }
}
  
html.Element.$prop = function (nm,v) {
  let eel = this.__element;
  if (eel !== undefined) {
    if (v !== undefined) {
      eel[nm] = v;
    } else {
      return eel[nm];
    }
  }
}
  
html.Element.$empty = function () {                            
  this.$html('');
  this.__iterDomTree(function (ch) {
    ch.remove();
  },true); // iterate over objects only
}

export {html};
// Copyright 2019 Chris Goad
// License: MIT

// some state of an item is not suitable for saving (eg all of the dom links). This sta

let propsToStash = ["__container","__controlBoxes","__customBoxes"];
let computeStash;
let domStash;
let stateStash;
  
const stashPreSave = function (itm,needRestore,removeComputed=true) {
  stateStash = needRestore?{}:undefined;
  domStash = needRestore?{}:undefined;
  stashDom(itm,domStash);
  
  if (needRestore) {
    core.setProperties(stateStash,itm,propsToStash,true);
  }
  propsToStash.forEach(function (p) {
    delete itm[p];
  });
  //domStash = needRestore?{}:undefined;
  //stashDom(itm,domStash);
  if (removeComputed) {
    computeStash = needRestore?{}:undefined;
    core.removeComputed(itm,computeStash);
  }
} 
  
  
core.beforeSerialize.push( function (itm) {stashPreSave(itm,1)});
core.beforeSerializeState.push( function (itm) {stashPreSave(itm,1,false)});

const restoreAfterSave = function (itm,restoreComputed=true) {
  core.setProperties(itm,stateStash,propsToStash,true,true);//fromOwn,dontCopy
  if (restoreComputed) {
    core.restoreComputed(itm,computeStash);
  }
  restoreDom(itm,domStash);
}
    
core.afterSerialize.push(restoreAfterSave);
core.afterSerializeState.push(function (itm) {restoreAfterSave(itm,false)});

// Copyright 2019 Chris Goad
// License: MIT

vars.svgIncludeIds = true;

// svg serialization:for writing out the svg dom as a string, so that it can be shown independent of PrototypeJungle
/* Example use:
  dom.svgMain.svgString(200,10);
*/

const compressNumber = function (s) {
  let numc,trailingComma;
  if (s[s.length-1] ===',') {
    numc = s.substring(0,s.length-1);
    trailingComma = ',';
  } else {
    numc = s;
    trailingComma = '';
  }
  if (isNaN(Number(numc))) {
    return numc+trailingComma;
  }
  let m = numc.match(/(\-*)(\d*)(\.*)(\d*)(e*)(.*)/);
  let mn = m[1];
  let intp =  m[2];
  let decp = m[3];
  let decimals = m[4];
  let ep = m[5];
  let exp = m[6];
  let rs = mn + intp + decp + decimals.substring(0,5) + ep + exp+trailingComma;
  return rs;
}


const compressNumbers = function (str) {
  let sp = str.split(' ');
  let mp = sp.map(compressNumber);
  return mp.join(' ');
}
  
  

const toPointsString = function (pnts) {
  let rs = "";
  let numd = 4;
  let first = true;
  pnts.forEach(function (p) {
    if (!first) {
      rs += " ";
    }
    first = false;
    rs += core.nDigits(p.x,numd)+","+core.nDigits(p.y,numd);
  });
  return rs;
}
  // for the outermost g, a transform is sent in
svg.tag.g.__svgStringR = function (dst,itr) {
  let tr;
  if (this.__hidden()) {
    return;
  }
  if (itr) {
    dst[0] += '<g id="outerG" '+itr+'>\n';
  } else {
    let ids = vars.svgIncludeIds?'id="'+core.stringPathOf(this,core.root,'_')+'" ':'';
    tr = this.transform;
    if (tr) {
      dst[0] +="<g "+ids+tr.svgString()+">\n";
    } else {
      dst[0] += "<g "+ids+">\n";
    }
  }
  this.__iterDomTree(function (ch) {
    if (core.ArrayNode.isPrototypeOf(ch) || SvgElement.isPrototypeOf(ch)) {
      ch.__svgStringR(dst);
    }
  });
  dst[0] += "\n</g>\n";
}
  
  
  
core.ArrayNode.__svgStringR = svg.tag.g.__svgStringR;

svg.tag.g.svgString = function () {
  let dst = [""];
  this.__svgStringR(dst);
  return dst[0];
}
  
 
const genFitfun = function (bnds) {
  let rs = "function fit() {\n";
  rs += ' var ff = 0.9;\n';
  rs += '  var wd = '+bnds.extent.x+';\n';
  rs += '  var ht = '+bnds.extent.y+';\n';
  rs += '  var xtr = '+bnds.corner.x+'-(0.5*wd*(1-ff));\n';
  rs += '  var ytr = '+bnds.corner.y+'-(0.5*ht*(1-ff));\n';
  rs += '  var wnwd = window.innerWidth;\n';
  rs += '  var wnht = window.innerHeight*(0.90);\n';
  rs += '  var swd = wnwd/wd;\n';
  rs += '  var sht = wnht/ht;\n';
  rs += '  var s = Math.min(swd,sht)*ff;\n';
  rs += '  var og = document.getElementById("outerG");\n';
  rs += '  og.setAttribute("transform","translate("+(-xtr*s)+" "+(-ytr*s)+") scale("+s+")");\n';
  rs += '}\n'
  return rs;
}
  
const genHtmlPreamble = function () {
  let rs = "<!DOCTYPE html>\n";
  rs += '<html>\n<body style="overflow:hidden">\n<script>\n';
  rs += '</script>\n';
  return rs;
}


 // write out a complete svg file for this root
SvgRoot.svgString = function (viewWd,padding,aspectRatio) {
  let ar;
  let cn = this.contents;
  cn.__removeIfHidden(); 
  let bnds = cn.bounds();
  let ex = bnds.extent;
  if (aspectRatio) {
    ar = aspectRatio;
  } else if (ex.y === 0) {
    ar = 10;
  } else {
    ar = Math.min(10,ex.x/ex.y);
  }
  vars.svgAspectRatio = ar;
  let viewHt = viewWd / ar;
  vars.svgAspectRatio = ar;
  let color = core.root.backgroundColor;
  let destrect = Rectangle.mk(Point.mk(padding,padding/ar),Point.mk(viewWd-2*padding,viewHt-2*padding/ar));
  let tr = 'transform = "'+bnds.transformTo(destrect).toSvg()+'"';
  let rs = '<svg id="svg" baseProfile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" ';
  if (color) {
    rs += 'style = "background:'+color+'" ';
  }
  rs += 'viewBox="0 0 '+ viewWd + ' ' + viewHt + '">\n';
  let dst = [rs];
  this.contents.__svgStringR(dst,tr);
  dst += '</svg>';
  let cdst = compressNumbers(dst); 
  return cdst;
}
 
 export {compressNumber,compressNumbers};
