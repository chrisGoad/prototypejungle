
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPointMethods} from '/mlib/pointGen.mjs';	
import {rs as addWebMethods} from '/mlib/web.mjs';	

let rs = basicP.instantiate();
addPointMethods(rs);
addWebMethods(rs);
rs.setName('web_grid');
let ht= 1000;
let wd = ht;
let  topParams = {width:wd,height:ht,framePadding:1.2*ht};
let  webParams = {webTries:1000,minConnectorLength:0,maxConnectorLength:400,angleMin:-10,angleMax:10};
let gridParams = {width:ht,height:ht,numRows:20,numCols:20};
Object.assign(rs,topParams);

rs.initProtos = function () {	
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .1;
  this.lineP['stroke-width'] = 5;
}  

rs.initialize = function () {
  this.initProtos();
  webParams.lineP = this.lineP;
  let points = this.gridPoints(gridParams);
  this.generateWeb(Object.assign(webParams,{points}));
  this.addFrame();
}

export {rs};
