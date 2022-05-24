import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addDropMethods} from '/mlib/dropCircles.mjs';

let rs = basicP.instantiate();

addRandomMethods(rs);
addDropMethods(rs);


rs.setName('drop_hole');
let ht= 2000;
ht = 6000;
let nrc = 100;
let topParams = {numRows:nrc,numCols:nrc,width:ht,height:ht,framePadding:0.15*ht,isLight:0}

let dropParams = {dropTries:150,radius:60}


Object.assign(rs,topParams);

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = (this.isLight)?'black':'white';
  circleP['stroke-width'] = 0;
}  

rs.radiusGenerator= function (p) {
  let ln = p.length()-400;
  return 0.01*ln;
 }

rs.initialize = function () {
  debugger;
  this.initProtos();
  this.setupRandomGridForShapes('radius',{step:10,min:10,max:100});
  this.addFrame();
  let rwd = (this.isLight?1:1.1)*ht;
  this.addRectangle({width:rwd,height:rwd,stroke_width:4,stroke:'white',fill:isLight?'white':'black'});
   let shapes = this.set('shapes',arrayShape.mk());
 let drop =  this.generateCircleDrop(dropParams);
  let {points,radii} = drop;
  let ln  = points.length;
  for (let i=0;i<ln;i++) {
    let p = points[i];
    if ((!this.isLight) && (p.length() > 3000)) {
      continue;
    }
    let crc = this.circleP.instantiate();
    crc.dimension = 2*radii[i]; 
    shapes.push(crc);
    crc.moveto(points[i]);
   }
}

export {rs};


