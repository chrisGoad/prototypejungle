import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_12');
let ht= 1000;
let topParams = {width:ht,height:ht}
Object.assign(rs,topParams);

let dropParams = {dropTries:150,radius:60,maxDrops:1000}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}  

rs.radiusGenerator= function (p) {
  let {x,y} = p;
  let absx = Math.abs(x);
  let absy = Math.abs(y);
  let nx = Math.abs(absx-250);
  let ny = Math.abs(absy-250);
  //let mn = Math.min(nx,ny);
  let mn = Math.max(nx,ny);
  let d = 250- mn;
  if (d<20) {
    d=0;
  }
  return 0.2*d;
 }
 
rs.fillGenerator= function (p) {
  let {x,y} = p;
  if (((x<0) && (y<0))||((x>0)&&(y>0))) return 'black';
  return 'white';
 }
rs.generateDrop = function (p) {
  let rd = this.radiusGenerator(p);
  let crc = Circle.mk(rd);
  let crcs = crc.toShape(this.circleP,1);
  return {geometries:[crc],shapes:[crcs]};
}

rs.initialize = function () {
  this.initProtos();
  let hht = 0.5*ht;
  let qht = 0.5*hht;
  this.addRectangle({width:hht,height:hht,position:Point.mk(-qht,-qht),stroke_width:0,fill:'rgb(255,0,0)'});
  this.addRectangle({width:hht,height:hht,position:Point.mk(-qht,qht),stroke_width:0,fill:'rgb(255,255,0)'});
  //this.addRectangle({width:hht,height:hht,position:Point.mk(-qht,qht),stroke_width:0,fill:'rgb(0,0,255)'});
  this.addRectangle({width:hht,height:hht,position:Point.mk(qht,-qht),stroke_width:0,fill:'rgb(0,255,255)'});
  this.addRectangle({width:hht,height:hht,position:Point.mk(qht,-qht),stroke_width:0,fill:'rgb(0,0,255)'});
  this.addRectangle({width:hht,height:hht,position:Point.mk(qht,qht),stroke_width:0,fill:'rgb(255,0,255)'});

  let shapes = this.set('shapes',arrayShape.mk());
  let drop =  this.generateDrops(dropParams);
 /* let {points,radii} = drop;
  let ln  = points.length;
  for (let i=0;i<ln;i++) {
    let p = points[i];
    let fill = this.fillGenerator(p);
    let crc = this.circleP.instantiate();
    crc.dimension = 2*radii[i];
    crc.fill = fill;
    shapes.push(crc);
    crc.moveto(p);
   }*/
}

export {rs};


