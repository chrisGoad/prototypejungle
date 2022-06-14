
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();

addDropMethods(rs);
addRandomMethods(rs);
addSegsetMethods(rs);
rs.setName('drop_ice');
let wd = 100;
let nr = 50;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,minSeparation:2,framePadding:20}
let dropParams = {dropTries:100,maxDrops:4000}

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'yellow';
  this.lineP['stroke-width'] = .3; 
  this.circleP = circlePP.instantiate();
  this.circleP.stroke = 'yellow';
  this.circleP['stroke-width'] = 0;
}  

rs.initialDrop = function () {
debugger;
  let {width,height,lineP} = this;
  let segs = this.rectangleSegments(width,height); // rectangleSegments is defined in segsets.mjs
  let lines = segs.map((sg) => this.genLine(sg,lineP));  
  return {geometries:segs,shapes:[]};
}

rs.segParams = function (np) {
  let r = Math.random();
 // let np = 4;
  let angle = (np === -1)?Math.PI/2:Math.floor(r*np)* (Math.PI/np)
  let length = 2;// + Math.floor(r*np)*4;
  return {angle,length};
} 	

rs.generateDrop = function (p,rvs) {
  console.log('p',p);
  debugger;
  let d = 2*(p.length())/wd;
  if (d > 1) {
   // return;
  }
  let {x,y} = p;
  let cross = (Math.abs(y) < 0.125*wd)||(Math.abs(x) < 0.125*wd)
  let md = (Math.abs(y) < 0.125*wd)&&(Math.abs(x) < 0.125*wd)
  let v = rvs.v;
  let clr = `rgb(${v},${v},${v})`;
  let p0 = Point.mk(0,0);
  let {minSeparation,lineP} = this;
  let {length,angle} = this.segParams(md?4:(Math.abs(y)>0.125*wd?-1:1));
  if (cross && !md) {
    let seg = LineSegment.mkAngled(p0,angle,length);
    debugger;
    let lseg = LineSegment.mkAngled(p0,angle,length+minSeparation);
    let ln = this.genLine(seg,lineP);
    ln .stroke = clr;
    ln['stroke-width'] = .3;
    // the segment is minSeparation longer than the line, meaning that lines extended by this much
    // which intersect existing dropStructs are rejected as drop candidates
    return {geometries:[lseg],shapes:[ln]};
  } else {
    let crc = Circle.mk(1);
    let crcs = this.genCircle(crc,this.circleP,0.5);
    crcs .fill = clr;

    return {geometries:[crc],shapes:[crcs]};
 }

}
 
rs.initialize = function () {
  this.initProtos();
  this.setupRandomGridForShapes('v',{step:10,min:160,max:255});
  //this.setupRandomGridForShapes('which',{step:0.3,min:0,max:1});

  this.generateDrops(dropParams);
  this.addFrame();
}

export {rs};



