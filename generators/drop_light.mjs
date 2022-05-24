import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/dropCircles.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_light');
let ht= 6000;
let topParams = {width:ht,height:ht}
Object.assign(rs,topParams);

let dropParams = {dropTries:150,radius:60}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'black';
  circleP['stroke-width'] = 0;
}  

rs.radiusGenerator= function (p) {
  let ln = p.length()-400;
  return 0.01*ln;
 }

rs.initialize = function () {
  this.initProtos();
  this.addRectangle({width:ht,height:ht,stroke_width:0,fill:'white'});
  let shapes = this.set('shapes',arrayShape.mk());
  let drop =  this.generateCircleDrop(dropParams);
  let {points,radii} = drop;
  let ln  = points.length;
  for (let i=0;i<ln;i++) {
    let crc = this.circleP.instantiate();
    crc.dimension = 2*radii[i]; 
    shapes.push(crc);
    crc.moveto(points[i]);
   }
}

export {rs};


