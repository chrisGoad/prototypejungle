import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';

import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_11');
let ht= 1000;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,minSeparation:6,numRings:2}
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
  this.circleP.fill = 'white';
  this.circleP['stroke-width'] = 0;
}  


rs.segParams = function (np) {
  let r = Math.random();
 // let np = 4;
  let angle = (np === -1)?Math.PI/2:Math.floor(r*np)* (Math.PI/np)
  let length = 30;// + Math.floor(r*np)*4;
  return {angle,length};
} 	


rs.generateDrop= function (p) {
  let {height:ht,dropParams,circleP,lineP,minSeparation,numRings:nr} = this;
  debugger;
  let p0 = Point.mk(0,0);
  let hht = 0.5*ht;
  let d = p.length();
  if (d>=hht) {
    return;
  }
  let rn = Math.floor(nr*d/hht);
  let mixedRing = !rn%2;
  if (mixedRing) {
    let sp = this.segParams(2);
    let {angle,length} = sp;
    let seg = LineSegment.mkAngled(p0,angle,length);
    debugger;
    let lseg = LineSegment.mkAngled(p0,angle,length+minSeparation);
    let ln = this.genLine(seg,lineP);
    return {geometries:[lseg],shapes:[ln]}; 
  }       
  let rd = 4;
  //console.log('ring','fr',fr,'i',i,'szi',szi,'rd',rd);
  let crc = Circle.mk(rd);
  let crcs = this.genCircle(crc,circleP,0.5);
  return {geometries:[crc],shapes:[crcs]};
}

rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams} = this;
  this.addFrame();
  let drops =  this.generateDrops(dropParams);
  //this.installCircleDrops(drops,circleP);
}


export {rs};



