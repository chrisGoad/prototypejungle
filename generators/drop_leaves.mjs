
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();
addDropMethods(rs);
addRandomMethods(rs);
addSegsetMethods(rs);

rs.setName('drop_leaves');
let ht = 300;
let wd = 1.5 * ht;

let topParams = {width:wd,height:ht,framePadding:0.17*ht,segLength:5,sepNext:0.01};

let dropParams = {dropTries:500,fromEnds:1,extendWhich:'first'};

let fanParams = {splitChance:.10,splitAmount:0.005 * Math.PI,directionChange:0.0*Math.PI,sepNextt:0.1,randomDirectionChange:0.051*Math.PI};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .5;
}  

rs.initialDrop = function () {
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
  let LR = Point.mk(hw-dc,hh-dc);
  let LRS = this.genOneSegment(LR,Math.PI,'white');
  segs.push(LRS);
  let rsegs = this.rectangleSegments(width,height);
  let lines = rsegs.map((sg) => this.genLine(sg,lineP));  
  return [segs,lines];
}

rs.dropAt = function (p) {
  return this.generateFan(Object.assign({startingPoint:p},fanParams));
}

rs.initialize = function () {
  debugger;
  this.addFrame();
  this.initProtos();
  this.generateDrop(dropParams);
}

export {rs};


