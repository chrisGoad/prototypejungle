import {rs as circlePP} from '/shape/circle.mjs';

import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addForestDropMethods} from '/mlib/dropForest.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);
addForestDropMethods(rs);

rs.setName('drop_dandelion_with_circles');
let ht = 360;
let wd = 1* ht;

let topParams = {width:wd,height:ht,framePadding:0.15*ht};  

let forestDropParams = {fromEnds:1, extendWhich:'first', sepNext:0.01, dropTries:10, sepNext:0.1, maxDrops:Infinity, doNotExit:[geom.Circle.mk(Point.mk(0,0),0.5*ht)], splitChance:.40, splitAmount:0.05*Math.PI, directionChange:0.0*Math.PI, randomDirectionChange:0.025*Math.PI, segLength:5,maxDrops:10000};

let ringParams = {numSeeds:15,ringRadius:0.15 * 0.5 * wd};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .5;
    this.circleP = circlePP.instantiate();
  this.circleP.fill = 'white';
  this.circleP['stroke-width'] = 0;
}
let dropParams = {dropTries:150,maxDrops:10}

rs.generateDrop= function (p) {
  let {height:ht,radius} = this;
  debugger;
  let hht = 0.5*ht;
  //let fr = (p.y + hht)/ht;
  let d = p.length();
  if (d>=hht) {
    return;
  } 
  let crc = Circle.mk(10);
  let crcs = crc.toShape(this.circleP);
  return {geometries:[crc],shapes:[crcs]}
}

rs.initialForestDrop = function () {
  let segs = this.ringSeeds(ringParams); 
  let lines = segs.map((sg) => sg.toShape(this.lineP)); 
  return {geometries:segs,shapes:lines};
}

rs.generateForestDrop = function (p) {
  let segs = this.generateFan(p);
  let lines = segs.map( s => s.toShape(this.lineP));
  return {geometries:segs,shapes:lines};
}

rs.initialize = function () {
  debugger;
  this.initProtos();
  this.addFrame();
  this.generateDrops(dropParams);
  this.generateForestDrops(forestDropParams);
}

export {rs};



