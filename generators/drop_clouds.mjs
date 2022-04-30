import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
import {rs as addInterpolateMethods} from '/mlib/interpolate.mjs';
let rs = basicsP.instantiate();

addDropMethods(rs);
addInterpolateMethods(rs);
addSegsetMethods(rs);
rs.setName('drop_clouds');
let ht = 400;
let topParams = {width:1.5*ht,height:ht,maxDrops:100000,dropTries:50,segLength:2,framePadding:0.17*ht}


Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .6;
}  

rs.dropAt = function (p) {
  let {width,height,lineP} = this;
  let params = {direction:0.75*Math.PI,zigzag:1,randomness:0,vertical:0,widths:[10],heightRatio:0.05,numSegs:4,pos:p};
  let which = this.computeWhichByCornerInterpolation(p);
  let rgb0 = [250,0,0];
  let rgb2 = [0,0,250];
  let rgb1 = [250,250,250];
  let rgb3 = rgb1;
  let clr = this.computeColorByInterpolation(p,rgb0,rgb1,rgb2,rgb3);
  let segs;
  let sizes = [5,10,20];
  if (which === 0) {
    segs = this.sizedRectangleSegments(sizes,p); //Upper left
  } else if (which === 1) {
     segs = this.wigglySegments(params);  //  Upper right
  } else if (which === 2) { // Lower right
    segs = this.sizedRectangleSegments(sizes,p); //Lower left
  } else if (which === 3) {
     segs = this.wigglySegments(params); //  lower right
  }
  let lines = segs.map((sg) => this.genLine(sg,lineP));
  lines.forEach( (line) => line.stroke = clr);
  return [segs,lines];
}

rs.initialDrop = function () {
  let {width,height,lineP} = this; 
  let segs = this.rectangleSegments(width,height);
  let lines = segs.map((sg) => this.genLine(sg,lineP)); 
  return [segs,lines];
}

  
rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.generateDrop();
}

export {rs};


