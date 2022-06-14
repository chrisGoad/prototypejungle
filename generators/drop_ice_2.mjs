
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
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
  this.circleP = circlePP.instantiate();
  this.circleP.stroke = 'yellow';
  this.circleP.fill = 'blue';
  this.circleP['stroke-width'] = .15;
}  

rs.initialDrop = function () {
debugger;
  let {width,height,lineP} = this;
  let segs = this.rectangleSegments(width,height); // rectangleSegments is defined in segsets.mjs
  let lines = segs.map((sg) => this.genLine(sg,lineP));  
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
  console.log('p',p);
  if (Math.random() < 0.1) {
    let crc = Circle.mk(2);
    let crcs = this.genCircle(crc,this.circleP);
    return {geometries:[crc],shapes:[crcs]};
  }
  let p0 = Point.mk(0,0);
  let {minSeparation,lineP} = this;
  let {length,angle} = this.segParams();
  let seg = LineSegment.mkAngled(p0,angle,length);
  debugger;
  let lseg = LineSegment.mkAngled(p0,angle,length+minSeparation);
  let ln = this.genLine(seg,lineP);
  // the segment is minSeparation longer than the line, meaning that lines extended by this much
  // which intersect existing dropStructs are rejected as drop candidates
  return {geometries:[lseg],shapes:[ln]};
}
 
rs.initialize = function () {
  this.initProtos();
  this.generateDrops(dropParams);
  this.addFrame();
}

export {rs};



