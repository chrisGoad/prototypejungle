import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_triptych');
let ht= 1000;
let wd = 1.5 * ht;
let nr = 40;
let topParams = {width:wd,height:ht,numRows:nr,numCols:nr,radius:100,framePadding:0.1*ht}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:3500,maxDrops:10000}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'rgba(0,0,200,0.3)';
  circleP.stroke = 'rgb(200,200,200)';
  circleP['stroke-width'] = 2;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'rgba(200,0,0,0.3)';
  rectP.stroke = 'rgb(200,200,200)';
  rectP['stroke-width'] = 2;
}  

rs.initialDrop = function () {
  let {width:wd,height:ht,circleP,rectP} = this;
  let hht  = 0.5*ht;
  let hwd  = 0.5*wd;
  let twd =wd/3;
  let left = Rectangle.mk(Point.mk(-hwd,-hht),Point.mk(twd,ht));
  let middle = Rectangle.mk(Point.mk(twd-hwd,-hht),Point.mk(twd,ht));
  let right = Rectangle.mk(Point.mk(2*twd-hwd,-hht),Point.mk(twd,ht));
  let lefts  = left.toShape(this.rectP);
  lefts.fill = 'rgba(0,0,100,0.3)';
  let middles  = middle.toShape(this.rectP);
  middles.fill = 'rgba(0,0,0,0.3)';
  let rights  = right.toShape(this.rectP);
  return {geometries:[left,middle,right],shapes:[lefts,middles,rights]};
}

rs.generateDrop= function (p) {
  let {width:wd,height:ht,circleP,rectP} = this;
  let geom,shp;
  let hht  = 0.5*ht;
  let hwd = 0.5*wd;
  let frx = (p.x + hwd) / wd;
  let fry = (p.y + hht) / ht;
  let left = frx < 1/3;
  let middle = (1/3 < frx) && (frx < 2/3);
  let right =  2/3 < frx;
 // console.log('p.x',p.x,'frx',frx,'left',left,'middle',middle,'right',right);
  let ri = 1 + Math.floor(6*Math.random());
  let r = 5+ ri*fry * 50;
  if (left) {
    geom = Circle.mk(r);
    geom.isDisk = 0;
    shp = geom.toShape(this.circleP);
  }
  if (middle) {
     if (Math.random() < 0.5) {
       geom = Circle.mk(r);
       geom.isDisk = 0;
       shp = geom.toShape(this.circleP);
     } else {
       geom = Rectangle.mk(Point.mk(-r,-r),Point.mk(2*r,2*r))
       shp = geom.toShape(this.rectP);
     }
   }
   if (right) {
     geom = Rectangle.mk(Point.mk(-r,-r),Point.mk(2*r,2*r))
     shp = geom.toShape(this.rectP);
   }
   shp['stroke-width'] = 1+1*fry;
   return {geometries:[geom],shapes:[shp]}
 }

rs.initialize = function () {
  this.initProtos();
  let {dropParams} = this;
  this.addFrame();
  let drops =  this.generateDrops(dropParams);
}

export {rs};


