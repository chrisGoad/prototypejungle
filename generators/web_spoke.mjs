
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPointGenMethods} from '/mlib/pointGen.mjs';	
import {rs as addWebMethods} from '/mlib/web.mjs';	
let rs = basicP.instantiate();

addPointGenMethods(rs);
addWebMethods(rs);

rs.setName('web_spoke');

let webParams,gridParams;

rs.computeParams = function (ht,dir) { // height and direction of the spoke
  webParams = {minConnectorLength:0.5*ht,maxConnectorLength:2.2*ht,webTries:100};
  gridParams = {initialPos:Point.mk(0,0),initialDirection:dir,width:ht,step:0.35*ht,delta:0.02*Math.PI,numSteps:70};
}

rs.initProtos = function () {	
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 3;
}

rs.initialize = function (ht=40,dir=0) {
  this.initProtos();
  this.computeParams(ht,dir);
  let points =this.randomWalkPoints(gridParams);
  this.generateWeb(Object.assign(webParams,{points}));
}
  
export {rs};


