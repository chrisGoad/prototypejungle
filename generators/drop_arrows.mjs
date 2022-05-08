
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
import {rs as addInterpolateMethods} from '/mlib/interpolate.mjs';

let rs = basicsP.instantiate();

addDropMethods(rs);
addSegsetMethods(rs);
addInterpolateMethods(rs);

rs.setName('drop_arrows');
let ht = 400;
let topParams = {width:ht,height:ht,framePadding:0.1*ht};

let dropParams = {dropTries:40,segLength:2};

Object.assign(rs,topParams);


rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .1;
  this.lineP['stroke-width'] = .6;
}  

rs.dropAt = function (p) {
  let {width,height,lineP} = this;
  let params = {direction:Math.PI/4,zigzag:1,randomness:0,vertical:0,widths:[10],heightRatio:0.05,numSegs:4,pos:p};
  let params1 = Object.assign({},params);
  params1.direction = 0.75*Math.PI;
  let params2 = Object.assign({},params);
  params2.direction = Math.PI/2;
  let params3 = Object.assign({},params);
  params3.direction = 0;
   let rgb0 = [250,0,0];
  let rgb2 = [0,0,250];
  let rgb1 = [250,250,250];
  let rgb3 = rgb1;
  let clr = this.computeColorByInterpolation(p,rgb0,rgb1,rgb2,rgb3);
  let which = this.computeWhichByCornerInterpolation(p);
  let inb = 0.31*height;
  inb = 0.5*height;
  const inRange = (v,lw,hg) => {
    return (lw <v) && (v<hg);
  }
  let fnd=0;
  if ((Math.abs(p.x) < inb) && (Math.abs(p.y) < inb)) {
    let xmy = p.x - p.y
    let lb = 100;
    lb = 0;
    let ub = 140;
    if (inRange(xmy,lb,ub)&&(p.y<0)) {
      which = 0;
      fnd = 1;
    }
    if (inRange(xmy,-ub,-lb)&&(p.y>0)) {
      which = 0;
      fnd = 1;
    }
    let xpy = p.x + p.y;
    if (inRange(xpy,lb,ub)&&(p.y>0)) {
      which = 1;
      fnd = 1;
    }
    if (inRange(xpy,-ub,-lb)&&(p.y<0)) {
      which = 1;
      fnd = 1;
    }
  }
  if (!fnd) {
    return null;
    clr = 'transparent';
  }
  let segs;
  if (which === 0) {
    segs = this.wigglySegments(params);
  } else if (which === 1) {
    segs = this.wigglySegments(params1);
  } else if (which === 2) {
    segs = this.wigglySegments(params2);
  } else if (which === 3) {
    segs = this.wigglySegments(params3);
  }
  let lines = segs.map((sg) => this.genLine(sg,lineP));
  const genRGBval = function () {
    return 155 + Math.floor(Math.random()*100);
  }
  lines.forEach( (line) => line.stroke = clr);
  return [segs,lines];
}

  
rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.generateDrop(dropParams);
}

export {rs};


