import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/dropCircles.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_6');
let ht= 100;
//let topParams = {width:ht,height:ht,sizes:[30,10,3.33]}
//let topParams = {width:ht,height:ht,sizes:[90,30,10]}
//let topParams = {width:ht,height:ht,sizes:[45,15,5]}
let topParams = {width:ht,height:ht,radius:5,framePadding:0.1*ht,frameStrokee:'white'}
Object.assign(rs,topParams);

let dropParams = {dropTries:15}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}  



rs.generateDrop= function (p) {
  let {height:ht,radius} = this;
  let hht = 0.5*ht;
  //let fr = (p.y + hht)/ht;
  let d = p.length();
  if (d>=hht) {
    return;
  }
 // let fr = d/(hht * Math.SQRT2);
 
  return {radius}
}
 
 

 
rs.fillGenerator= function (p) {
  debugger;
  return 'white';
 }


rs.initialize = function () {
  this.initProtos();
  let shapes = this.set('shapes',arrayShape.mk());
  let drops =  this.generateCircleDrops(dropParams);
  debugger;
  let ln  = drops.length;
  for (let i=0;i<ln;i++) {
    let {point,radius} = drops[i];
    //let fill = this.fillGenerator(p);
    let crc = this.circleP.instantiate();
    let dim = 2.0*radius;
    crc.dimension = dim;
    shapes.push(crc);
    crc.moveto(point);
   }
}

export {rs};


