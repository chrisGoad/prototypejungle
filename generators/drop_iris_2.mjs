
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
let rs = basicsP.instantiate();

addDropMethods(rs);
addSegsetMethods(rs);
rs.setName('drop_metal_2');
let wd = 400;
let topParams = {width:wd,height:wd,numSegs:4,framePadding:0.15*wd,circular:false}
let dropParams = {dropTries:40,maxDrops:50000}

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP['stroke-width'] = .6;
  this.lineP.stroke = 'white';
  this.circleP = circlePP.instantiate();
}  

rs.lengthFunction = () => 40;


rs.directionFunction = function (p) {
  return  (Math.random() < 0.5)?0:Math.PI/4;
}



rs.strokeFunction = function (p) {
  return 'white';
  const genRGBval = function () {
    return 155 + Math.floor(Math.random()*100);
  }
  let v = genRGBval();
  let clr = `rgb(${v},${v},${v})`;
  return  clr;
}

rs.generateDrop = function (p) {
  let {width,height,lineP,numSegs,circular} = this;
  if (circular && (p.length() > 0.5*width)) {
    return;
  }
  let segWidth = (this.lengthFunction(p))/numSegs;
  if (circular && (segWidth < 4)) {
    return;
  }
  let dir = this.directionFunction(p)
  let hh = height/2;
 // let fr = (p.y+hh)/height;
  //let params = {direction:dir,zigzag:1,randomness:0,vertical:1,widths:[segWidth],heightRatio:0.05,numSegs:numSegs,pos:p};
  let params = {direction:dir,zigzag:1,randomness:0,vertical:1,widths:[segWidth],heightRatio:0.05,numSegs:numSegs};
  //let params2 = Object.assign({},params);
  //params2.direction = 0;
  //let segs = (Math.random() < 0.5)?this.wigglySegments(params):this.wigglySegments(params2);
  let segs = this.wigglySegments(params);
  let lines = segs.map((sg) => this.genLine(sg,lineP));
  let clr = this.strokeFunction(p);
  lines.forEach( (line) => line.stroke = clr);
  return {geometries:segs,shapes:lines};
}

rs.initialDrop = function () {
  let {width,height,lineP} = this; 
  let segs = this.rectangleSegments(width,height);
  let lines = segs.map((sg) => this.genLine(sg,lineP)); 
  return {geometries:segs,shapes:lines};
}

rs.initialize = function () {
  this.addFrame();
  let {circleP,circular} = this;
  this.setBackgroundColor(circular?'white':'black');
  this.initProtos();
  if (circular) {
    let crc = this.circleP.instantiate();
    this.set('crc',crc);
    crc.dimension = this.width;
    crc.fill = 'black';
    crc['stroke-width'] = 0;
  }
  this.generateDrops(dropParams);
}

export {rs};


