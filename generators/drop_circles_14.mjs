import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);
addRandomMethods(rs);

rs.setName('drop_circles_14');
let ht= 1000;
 ht= 500;
let nr = 40;
let topParams = {width:ht,height:ht,numRows:nr,numCols:nr,radius:100,framePadding:-0.1*ht,frameStrokee:'white'}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:3500,maxDrops:1000000}
//rs.dropParams = {dropTries:35,maxDrops:10000}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.fill = 'rgba(0,0,100,0.3)';
  circleP.fill = 'transparent';
  circleP.stroke = 'white';
  circleP['stroke-width'] = 1;
   let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'white';
  rectP.fill = 'rgba(100,0,0,0.3)';
  rectP.fill = 'transparent';
  rectP.stroke = 'white';
  rectP['stroke-width'] = 1;
}  
rs.initialDrop = function () {
  let crc = Circle.mk(0.8*0.5*this.height);
  crc.isDisk = 0;
  let crcs = crc.toShape(this.circleP);
  //return {geometries:[crc],shapes:[crcs]};
  return {geometries:[crc],shapes:[]};
}

rs.generateDrop= function (p,rvs) {
  let {height:ht} = this;
  debugger;
  let hht = 0.5*ht;
  let fr = 1- p.length()/(0.5*ht);
  if (fr<0.2) {
   return;
  }
  let radius = rvs.radius;
  let r = (Math.random() > 0.5)?radius * fr:0.2 * radius * fr;
  let v = Math.floor(rvs.v);
  let vv = 0;
  let clr = `rgb(${v},${vv},${255-v}`;
  let crc = Circle.mk(r);
  let rect = Rectangle.mk(Point.mk(-r,-r),Point.mk(2*r,2*r))
  crc.isDisk = 0;
  let crcs = crc.toShape(this.circleP);
  let rects = rect.toShape(this.rectP);
  crcs.stroke = 'white';
  crcs['stroke-width'] = fr;
  rects['stroke-width'] = fr;
  rects.stroke   = 'white';
  if (Math.random() < .5) {
    return {geometries:[rect],shapes:[rects]};
  }
  return {geometries:[crc],shapes:[crcs]}
}

rs.initialize = function () {
  debugger;
  this.initProtos();
  //this.setupRandomGridForShapes('radius',{step:10,min:5,max:20});
  this.setupRandomGridForShapes('radius',{step:10,min:10,max:40});
  this.setupRandomGridForShapes('v',{step:20,min:0,max:255});

  let {dropParams} = this;
  this.addFrame();
  let drops =  this.generateDrops(dropParams);
}

export {rs};


