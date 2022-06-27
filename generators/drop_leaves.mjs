
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/dropForest.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();
addDropMethods(rs);
addRandomMethods(rs);
addSegsetMethods(rs);

rs.setName('drop_leaves');
let ht = 300;
let wd = 1.5 * ht;

let topParams = {width:wd,height:ht,framePadding:0.17*ht,segLength:5};

let dropParams = {dropTries:100,maxTotalTries:200000,sepNext:5,maxDrops:10000, fromEnds:1,extendWhich:'first',splitChance:.10,splitAmount:0.005 * Math.PI, directionChange:0.01*Math.PI, randomDirectionChange:0.051*Math.PI, segLength:5};
//let fanParams = {splitChance:.10,splitAmount:0.005 * Math.PI,directionChange:0.0*Math.PI,sepNextt:0.1,randomDirectionChange:0.051*Math.PI};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'gray';
  this.lineP['stroke-width'] = .5;
}  

rs.initialForestDrop = function () {
  let {width,height,lineP} = this;
  let hw = 0.5 * width;
  let hh = 0.5 * height;
  let segs = [];//[segs,lines] = [[],[]];//this.gridSeeds('white');
  let dc = 35;
  let LL = Point.mk(dc - hw,hh-dc);
  let LLS = this.genOneSegment(LL,-0.5*Math.PI,'white');
  segs.push(LLS);
  let UL = Point.mk(dc - hw,dc-hh);
  let ULS = this.genOneSegment(UL,0,'white');
  segs.push(ULS);
   let UR = Point.mk(hw-dc,dc-hh);
  let URS = this.genOneSegment(UR,0.5*Math.PI);
  segs.push(URS);
 
  let LR = Point.mk(hw-dc,hh-dc);
  let LRS = this.genOneSegment(LR,Math.PI,'white');
  segs.push(LRS);
  let rsegs = this.rectangleSegments(width,height);
  let lines = segs.map((sg) => sg.toShape(lineP));  
 // let lines = segs.map((sg) => sg.toShape(lineP));  
  return {geometries:segs,shapes:lines};
}

rs.generateForestDrop = function (p) {
  debugger;
  let segs =  this.generateFan(p);
  let lines = segs.map( s => s.toShape(this.lineP,dropParams.lineExt));
//  let lines = segs.map( s => this.genLine(sthis.lineP,dropParams.lineExt));
  return {geometries:segs,shapes:lines};
}

rs.initialize = function () {
  let {width:wd,height:ht} = this;
 // this.setBackgroundColor('black');
  debugger;
  this.addFrame();
  this.initProtos();
 this.addRectangle({width:wd,height:ht,position:Point.mk(0,0),stroke_width:0,fill:'rgb(0,0,100)'});

 // dropParams.lineP = this.lineP;
 // this.initialForestDrop();
  this.generateForestDrops(dropParams);
}

export {rs};


