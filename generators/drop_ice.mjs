
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/newDrop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
let rs = basicsP.instantiate();

addDropMethods(rs);
addSegsetMethods(rs);
rs.setName('drop_ice');
let wd = 100;

let topParams = {width:wd,height:wd,minSeparation:10,framePadding:20}
let dropParams = {dropTries:100,maxDrops:4000}

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'yellow';
  this.lineP['stroke-width'] = .15;
}  

rs.initialDrop = function () {
debugger;
  let {width,height,lineP} = this;
  let segs = this.rectangleSegments(width,height); // rectangleSegments is defined in segsets.mjs
  let lines = segs.map((sg) => sg.toShape(lineP));  
  return {geometries:segs,shapes:lines};
}

rs.segParams = function () {
  let r = Math.random();
  let np = 4;
  let angle = Math.floor(r*np)* (Math.PI/np)
  let length = 2 + Math.floor(r*np)*4;
  return {angle,length};
} 
 
rs.generateDrop = function (p) {
  let p0 = Point.mk(0,0);
  let {minSeparation,lineP} = this;
  let {length,angle} = this.segParams();
  let seg = LineSegment.mkAngled(p0,angle,length);
  let line = seg.toShape(lineP);
  // lseg is minSeparation longer than the seg and line, meaning that lines extended by this much
  // which intersect existing dropStructs are rejected as drop candidates
  let lseg = LineSegment.mkAngled(p0,angle,length+minSeparation);
  return {geometries:[lseg],shapes:[line]};
}
 
rs.initialize = function () {
  this.initProtos();
  this.generateDrops(dropParams);
  this.addFrame();
}

export {rs};



