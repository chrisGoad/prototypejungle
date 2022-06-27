
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPointMethods} from '/mlib/pointGen.mjs';	
import {rs as addWebMethods} from '/mlib/web.mjs';	

let rs = basicP.instantiate();
addPointMethods(rs);
addWebMethods(rs);

rs.setName('web_diamond');
let ht= 3000;
let nrc=64;
let mcl = 50
let minc = 20;


let  topParams = {frameStroke:'rgb(52,52,52)',framePadding:0.1*ht,width:ht,height:ht,};

Object.assign(rs,topParams);

let webParams = {webTries:100, minConnectorLength:mcl, maxConnectorLength:mcl+minc, webTries:1000,maxDropss:10000,lengthenBy:-0.01};

let gridParams =  {width:ht,height:ht,numRows:nrc,numCols:nrc};

rs.initProtos = function () {	
  let lineP = this.lineP = linePP.instantiate();
  lineP['stroke-width'] = 7;
}  

const interpolate = function (v1,v2,f) {
  return v1 + (v2-v1)*f;
}

rs.inDiamond = function (p) {
  let width = this.width;
  let bd = p.boxcarDistance(Point.mk(0,0));
  return bd < 0.5 * width;
}

const inSquare = function (p,hw) {
  return (-hw < p.x) && (p.x < hw) && (-hw < p.y) && (p.y < hw);
  
}

const inCircle = function (p,d) {
  let dist = p.distance(Point.mk(0,0));
  return dist < d;
}

rs.colorFromPoint = function (p) {
  let w = this.width;
  if (inCircle(p,0.2  * w)) {
    return 'rgb(0,100,250)';
  }
  if (inSquare(p,0.7 * 0.5 * w)) {
    return 'red';
  }
  if (this.inDiamond(p)) {
    return 'gray';
  } 
  return 'transparent';  
}

rs.pairFilter = function (i,j) {
  let {maxConnectorLength:mxCln,minConnectorLength:mnCln=0,width,height,cPoints} = this;
  let pi = cPoints[i];
  let pj = cPoints[j];
  let d = pi.distance(pj);
  let bd = pi.boxcarDistance(Point.mk(0,0));
  mnCln = 50;
  if (inCircle(pi,0.2*width)) {
    mxCln = mnCln+50;
  }
  else if (this.inDiamond(pi)) {
    mxCln = mnCln + 20;
  } else {
    mxCln = mnCln + 50;
  }
  return (mnCln < d) && (d < mxCln);
}

rs.initialize = function () {
  debugger;
  this.initProtos();  
  webParams.lineP = this.lineP;
  this.addFrame();
  let points = this.gridPoints(gridParams);
  this.generateWeb(Object.assign(webParams,{points}));
}

export {rs};


