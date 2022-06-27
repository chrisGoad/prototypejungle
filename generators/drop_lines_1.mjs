import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_lines_1');
let ht= 1000;
let wd = 1.5*ht
let topParams = {width:wd,height:ht,framePadding:0.1*ht,minSeparation:60,numRings:2}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,maxDrops:10000,scale:0.5,radius:50,sizes:[27,9,3]}

rs.setDimension = function (dim) {
  this.width = dim;
  this.height = dim;
}

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 3; 
  this.circleP = circlePP.instantiate();
  this.circleP.fill = 'rgb(0,0,0)';
  this.circleP['stroke-width'] = 0;
}  


rs.generateDrop= function (p) {
  let {width:wd,dropParams,circleP,lineP,minSeparation,numRings:nr} = this;
  debugger;
  if (Math.random() <0.6) {
    let crc = Circle.mk(20);
    let crcs = crc.toShape(this.circleP);
    return {geometries:[crc],shapes:[crcs]}; 
  }
  let frx = (p.x + wd/2)/wd;
  let p0 = Point.mk(0,0);
  //let angle = Math.random() > frx?Math.PI/2:0;//1;//Math.random() < 0.5?0:1;
  let angle = frx * Math.PI;
  console.log('frx',frx,'angle',angle);
  let length = 60;
  let seg = LineSegment.mkAngled(p0,angle,length);
  let lseg = LineSegment.mkAngled(p0,angle,length+minSeparation);
  let ln = seg.toShape(lineP);
  return {geometries:[lseg],shapes:[ln]}; 
}       
 

rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams} = this;
  this.addFrame();
  let drops =  this.generateDrops(dropParams);
  //this.installCircleDrops(drops,circleP);
}


export {rs};



