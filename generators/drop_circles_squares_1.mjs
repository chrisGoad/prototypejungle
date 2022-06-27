import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);
addRandomMethods(rs);

rs.setName('drop_circles_squares_1');
let ht= 1000;
let wd = 1.5 * ht;
 //ht= 500;
let nr = 40;
let topParams = {width:wd,height:ht,numRows:nr,numCols:nr,radius:100,framePadding:0.1*ht,frameStroke:'white'}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:3500,maxDrops:10000}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP.fill = 'rgba(0,0,100,0.3)';
  circleP.stroke = 'white';
  circleP['stroke-width'] = 1;
   let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'white';
  rectP.fill = 'rgba(100,0,0,0.3)';
  rectP.stroke = 'white';
  rectP['stroke-width'] = 1;
}  
rs.initialDrop = function () {
  let {width:wd,height:ht,circleP,rectP} = this;
  let hht  = 0.5*ht;
  let hwd  = 0.5*wd;
  let twd =wd/3;
  let left = Rectangle.mk(Point.mk(-hwd,-hht),Point.mk(twd,ht));
  let middle = Rectangle.mk(Point.mk(twd-hwd,-hht),Point.mk(twd,ht));
  let right = Rectangle.mk(Point.mk(2*twd-hwd,-hht),Point.mk(twd,ht));
  let lefts  = this.genRectangle(left,this.rectP);
  let middles  = this.genRectangle(middle,this.rectP);
  let rights  = this.genRectangle(right,this.rectP);
  return {geometries:[left,middle,right],shapes:[lefts,middles,rights]};
}

rs.generateDrop= function (p,rvs) {
  let {width:wd,height:ht,circleP,rectP} = this;
  let geom,shp;
  debugger;
  let hht  = 0.5*ht;
  let hwd = 0.5*wd;
  let frx = (p.x + hwd) / wd;
  let fry = (p.y + hht) / ht;
  let left = frx < 1/3;
  let middle = (1/3 < frx) && (frx < 2/3);
  let right =  2/3 < frx;
  console.log('p.x',p.x,'frx',frx,'left',left,'middle',middle,'right',right);
  //let r = 5+Math.random() * 50;
  let ri = 1 + Math.floor(6*Math.random());
  let r = 5+ ri*fry * 50;
  if (left) {
    geom = Circle.mk(r);
    geom.isDisk = 0;
    shp = this.genCircle(geom,this.circleP);
  }
  if (middle) {
     if (Math.random() < 0.5) {
       geom = Circle.mk(r);
       geom.isDisk = 0;
       shp = this.genCircle(geom,this.circleP);
     } else {
       geom = Rectangle.mk(Point.mk(-r,-r),Point.mk(2*r,2*r))
       shp = this.genRectangle(geom,this.rectP);
     }
   }
   if (right) {
     geom = Rectangle.mk(Point.mk(-r,-r),Point.mk(2*r,2*r))
     shp = this.genRectangle(geom,this.rectP);
   }
   return {geometries:[geom],shapes:[shp]}
 }

 /*   
  let lft = frx < 0.333;
  if (fr<0.1) {
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
  let crcs = this.genCircle(crc,this.circleP);
  let rects = this.genRectangle(rect,this.rectP);
  crcs.stroke = 'white';
  crcs['stroke-width'] = fr;
  rects['stroke-width'] = fr;
  rects.stroke   = 'white';
  if (Math.random() < .5) {
    return {geometries:[rect],shapes:[rects]};
  }
  return {geometries:[crc],shapes:[crcs]}
}
*/
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


