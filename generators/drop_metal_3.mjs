
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
let rs = basicsP.instantiate();

addDropMethods(rs);
addSegsetMethods(rs);
rs.setName('drop_metal_3');
let wd = 400;
let topParams = {width:wd,height:wd,dropTries:40,maxDrops:1000,framePadding:0.1*wd,lineLength:20,dir0L:0,dir0H:Math.PI/2,dir1L:Math.PI/2,dir1H:Math.PI};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP['stroke-width'] = 1;
  this.lineP.stroke = 'white';
}  

rs.segParams = function () {
  let r = Math.random();
  let np = 4;
  let angle = Math.floor(r*np)* (Math.PI/np)
  let length = 2 + Math.floor(r*np)*4;
  return {angle,length};
}

rs.dropAt = function (p) {
  let {width,height,lineP,lineLength:lineL,dir0L,dir0H,dir1L,dir1H} = this;
  debugger;
  let hh = height/2;
  let fr = (p.y+hh)/height;
  let dir0 = dir0L + Math.random()*(dir0H-dir0L);
  let dir1 = dir1L + Math.random()*(dir1H-dir1L);
  let dir = (Math.random() >0.5)?dir1:dir0;
  let p1x = 0.5*lineL*Math.cos(dir);
  let p1y = 0.5*lineL*Math.sin(dir);
  let p1 = Point.mk(p1x,p1y);
  let p0 = Point.mk(-p1x,-p1y);
  let sg = LineSegment.mk(p0.plus(p),p1.plus(p));
  let line = this.genLine(sg,lineP);
 /* const genRGBval = function () {
    return 155 + Math.floor(Math.random()*100);
  }
  let v = genRGBval();
  let clr = `rgb(${v},${v},${v})`;
  lines.forEach( (line) => line.stroke = clr);*/
  return [[sg],[line]];
}

rs.initialDrop = function () {
  let {width,height,lineP} = this; 
  let segs = this.rectangleSegments(width,height);
  let lines = segs.map((sg) => this.genLine(sg,lineP)); 
  return [segs,lines];
}

  
rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  this.generateDrop();
}

export {rs};


