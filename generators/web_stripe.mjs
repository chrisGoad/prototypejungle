
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPointGenMethods} from '/mlib/pointGen.mjs';	
import {rs as addWebMethods} from '/mlib/web.mjs';	

let rs = basicP.instantiate();
addPointGenMethods(rs);
addWebMethods(rs);
rs.setName('web_stripe');

rs.initProtos = function (clr='white') {	
  let lineP = this.lineP = linePP.instantiate();
	this.lineP.stroke = clr;
	this.lineP['stroke-width'] = 3;
}  
let wd= 2000;
let ht = 0.2*wd;
let nr = 2;

let  topParams = {width:wd,height:ht,numRows:2,numCols:1000,minConnectorLength:0.5*ht,maxConnectorLength:1.2*ht,webTries:1000,maxLoopss:100000};

Object.assign(rs,topParams);

debugger;

//let  topParams {width:wd,height:ht,numRows:2,numCols:100,frameWidth:1.2*wd,frameHeight:1.2*wd,frameVisible:0,minConnectorLength:0.5*ht,maxConnectorLength:1.2*ht}

let  gridParams = {width:wd,height:ht,numRows:nr,numCols:200}

rs.initialize = function (clr) { 
debugger;
  this.initProtos(clr);
	let points = this.gridPoints(gridParams);
  this.generateWeb({points});
}


export {rs};



