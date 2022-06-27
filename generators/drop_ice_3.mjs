
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
  let hht = height/2;
  let qht = height/4;
  let segs = this.rectangleSegments(width,height); // rectangleSegments is defined in segsets.mjs
  let seg0 = LineSegment.mk(Point.mk(0,-hht),Point.mk(0,-qht));
  segs.push(seg0);
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
  console.log('p',p);
  if (Math.random() < 0.1) {
    let crc = Circle.mk(4);
    let crcs = crc.toShape(this.circleP);
    return {geometries:[crc],shapes:[crcs]};
  }
  let p0 = Point.mk(0,0);
  let {minSeparation,lineP} = this;
  let {length,angle} = this.segParams();
  let seg = LineSegment.mkAngled(p0,angle,length);
  debugger;
  let lseg = LineSegment.mkAngled(p0,angle,length+minSeparation);
  let ln = seg.toShape(lineP);
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



