import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/newDrop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
import {rs as addInterpolateMethods} from '/mlib/interpolate.mjs';
let rs = basicsP.instantiate();

addDropMethods(rs);
addInterpolateMethods(rs);
addSegsetMethods(rs);
rs.setName('drop_clouds');
let ht = 400;
let topParams = {width:1.5*ht,height:ht,framePadding:0.17*ht}
let dropParams = {dropTries:50,maxDrops:100000}


Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .6;
}  

rs.generateDrop = function (p) {
  let {width,height,lineP} = this;
  let params = {direction:0.75*Math.PI,zigzag:1,randomness:0,vertical:0,widths:[10],heightRatio:0.05,numSegs:4};
  let which = this.computeWhichByCornerInterpolation(p);
  let rgb0 = [250,0,0];
  let rgb2 = [0,0,250];
  let rgb1 = [250,250,250];
  let rgb3 = rgb1;
  let clr = this.computeColorByInterpolation(p,rgb0,rgb1,rgb2,rgb3);
  let segs;
  let sizes = [5,10,20];
  if (which === 0) {
    segs = this.sizedRectangleSegments(sizes); //Upper left
  } else if (which === 1) {
     segs = this.wigglySegments(params);  //  Upper right
  } else if (which === 2) { // Lower right
    segs = this.sizedRectangleSegments(sizes); //Lower left
  } else if (which === 3) {
     segs = this.wigglySegments(params); //  lower right
  }
  let lines = segs.map((sg) => sg.toShape(lineP));
  lines.forEach( (line) => line.stroke = clr);
  return {geometries:segs,shapes:lines};
}

rs.initialDrop = function () {
  let {width,height,lineP} = this; 
  let segs = this.rectangleSegments(width,height);
  let lines = segs.map((sg) => sg.toShape(lineP)); 
   return {geometries:segs,shapes:lines};
}

  
rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.generateDrops(dropParams);
}

export {rs};


