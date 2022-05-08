
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_dandelion');
let ht = 360;
let wd = 1* ht;

let topParams = {width:wd,height:ht,framePadding:0.15*ht,segLength:5,sepNext:0.01};  
//parameters to generateDrop 
let dropParams = {fromEnds:1,extendWhich:'first',sepNext:0.01,dropTries:10,maxDrops:Infinity,doNotExit:[geom.Circle.mk(Point.mk(0,0),0.5*ht)]};
//parameters to generateFan
let fanParams = {splitChance:.40,splitAmount:0.05 *Math.PI,directionChange:0.0*Math.PI,randomDirectionChange:0.025*Math.PI};
// parameters to ringSeeds
let ringParams = {numSeeds:15,ringRadius:0.15 * 0.5 * wd};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .5;
  this.linePinvisible = linePP.instantiate();
  this.linePinvisible.stroke = 'transparent';
  this.linePinvisible['stroke-width'] = 0;

}

rs.initialDrop = function () {
  return this.ringSeeds(ringParams);  
}

rs.dropAt = function (p) {
  return this.generateFan(Object.assign({startingPoint:p},fanParams));
}

rs.initialize = function () {
  this.initProtos();
  ringParams.lineP = this.linePinvisible;
  this.addFrame();
  this.generateDrop(dropParams);
}

export {rs};



