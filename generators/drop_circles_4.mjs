import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/dropCircles.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_4');
let ht= 1000;
let topParams = {width:ht,height:ht}
Object.assign(rs,topParams);

let dropParams = {dropTries:150}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}  



rs.radiusGenerator= function (p) {
  let ht = this.height;
  let hht = 0.5*ht;
  //let fr = (p.y + hht)/ht;
  let d = p.length();
  let fr = d/(hht * Math.SQRT2);
  if (fr<0.33) {
    return 10;
  }
  if (fr >0.666) {
    return 3;
  }
 // let fr = Math.abs(p.y)/hht;
  let r = Math.random();
  let rd = (r > 0.5)?10:3;
  return rd;
 }
 
 

 
rs.fillGenerator= function (p) {
  debugger;
  return 'white';
 }


rs.initialize = function () {
  this.initProtos();
  let shapes = this.set('shapes',arrayShape.mk());
  let drop =  this.generateCircleDrop(dropParams);
  let {points,radii} = drop;
  let ln  = points.length;
  for (let i=0;i<ln;i++) {
    let p = points[i];
    let fill = this.fillGenerator(p);
    let crc = this.circleP.instantiate();
    let dim = 1.0*radii[i];
    crc.dimension = dim;
    shapes.push(crc);
    crc.moveto(p);
   }
}

export {rs};


