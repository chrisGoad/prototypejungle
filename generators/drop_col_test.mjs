import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_2');
let ht= 1000;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white'}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,maxDrops:10000,scale:0.5,radius:50}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'transparent';
  circleP.fill = 'transparent';
  circleP.stroke = 'white'
  circleP['stroke-width'] = 1;
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 3; 
  
}

rs.generateDrop= function (p) {
  let {height:ht} = this;
  let p0 = Point.mk(0,0);
  if (Math.random() < 1 ){
    let rd = 2 + 50*Math.random();
    let crc = Circle.mk(rd);
    crc.isDisk = 0;
    let crcs = this.genCircle(crc,this.circleP);
    return {geometries:[crc],shapes:[crcs]}
  } else {
    let angle = Math.random() * Math.PI/2;
    let length = 5 + 50*Math.random();
    let seg = LineSegment.mkAngled(p0,angle,length);
    let ln = this.genLine(seg,this.lineP);
    return {geometries:[seg],shapes:[ln]}
  }
}

rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams} = this;
  this.addFrame();
  let drops =  this.generateDrops(dropParams);
  //this.installCircleDrops(drops,circleP);
}

export {rs};



