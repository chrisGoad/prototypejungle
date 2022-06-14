
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
let rs = basicsP.instantiate();

addDropMethods(rs);
addSegsetMethods(rs);
rs.setName('drop_horizon');
let topParams = {width:200,height:200}
let dropParams = {dropTries:50,segLength:2}

Object.assign(rs,topParams);


rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'yellow';
  this.lineP['stroke-width'] = .3;
}  

rs.segParams = function () {
  let r = Math.random();
  let np = 4;
  let angle = Math.floor(r*np)* (Math.PI/np)
  let length = 2 + Math.floor(r*np)*4;
  return {angle,length};
}

rs.initialDrop = function () {
  let {width,height,lineP} = this; 
  let segs = this.rectangleSegments(width,height);
  let lines = segs.map((sg) => this.genLine(sg,lineP)); 
  return {geometries:segs,shapes:lines};
}

rs.genRectSegments = function () {
  let sizes = [2,5,10,20,40];
  let which = Math.floor(Math.random()*5);
  let sz = sizes[which];
  let segs = this.rectangleSegments(sz,sz);
  return segs;
}

rs.generateDrop = function (p) {
  //let wparams = {direction:0,zigzag:1,randomness:0,vertical:0,widths:[10,20,50],heightRatio:0.05,numSegs:15,pos:p};
  let wparams = {direction:0,zigzag:1,randomness:0,vertical:0,widths:[10,20,50],heightRatio:0.05,numSegs:15};
  let segs = (p.y < 0)?this.genRectSegments():this.wigglySegments(wparams);
  let lines = segs.map((sg) => this.genLine(sg,this.lineP));
  const genRGBval = function () {
    return 155 + Math.floor(Math.random()*100);
  }
  let v = genRGBval();
  let clr = `rgb(${v},${v},${v})`;
  lines.forEach( (line) => line.stroke = clr);  
  return {geometries:segs,shapes:lines};
}
  
rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.generateDrops(dropParams);
}

export {rs};


