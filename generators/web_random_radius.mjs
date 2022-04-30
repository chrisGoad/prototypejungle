import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addDropMethods} from '/mlib/dropCircles.mjs';
import {rs as addWebMethods} from '/mlib/web.mjs';

let rs = basicP.instantiate();

addRandomMethods(rs);
addDropMethods(rs);
addWebMethods(rs);


rs.setName('web_random_radius');
let ht= 2000;
ht = 6000;
let nrc = 100;
let topParams = {maxFringeTries:10,numRows:nrc,numCols:nrc,width:ht,height:ht,maxLoops:20000,dropTries:100,webTries:1000000,lineLength:2,framePadding:0.1*ht:20,minConnectorLength:0,maxConnectorLength:300,shortenBy:10,sphereCenter:Point3d.mk(0,0,-0.3*ht),sphereDiameter:0.5*ht,focalPoint:Point3d.mk(0,0,ht),focalLength:10,cameraScaling:1000}

Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .1;
  this.lineP['stroke-width'] = 6;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension = 20;
  circleP.fill = 'rgba(255,255,255,0)';
 // circleP.fill = 'transparent';
  circleP.stroke = 'white';
  circleP['stroke-width'] = 0;
}  
/*
rs.dropAt = function (p) {
  debugger;
  let rd = this.radiusGenerator(p);
  let gcrc = geom.Circle.mk(p,rd);
  let scrc = this.circleP.instantiate();
  scrc.moveto(p);
  scrc.dimension = 2*rd;
  return [gcrc,scrc];
}
 */
  
rs.numCalls = 0;
rs.radiusGenerator= function (p) {
  //let {maxConnectorLength:mxCln,minConnectorLength:mnCln=0,cPoints,numDropped,width} = this;
  let cell = this.cellOf(p);
  let rvs = this.rvsAtCell(cell);
   let rad = rvs.radius;
   return rad;
  
}

rs.pairFilter = function (i,j) {
  //let {maxConnectorLength:mxCln,minConnectorLength:mnCln=0,cPoints,numDropped,width} = this;
  let {cPoints} = this;
  let pi = cPoints[i];
  let pj = cPoints[j];
  let fc = 20;
  if ((Math.abs(pi.x - pj.x) < fc) || (Math.abs(pi.y - pj.y) < fc)) return 1;
}

rs.initialize = function () {
  debugger;
  this.initProtos();
  //let {maxConnectorLength:mxCln,minConnectorLength:mnCln=0,width,lineP} = this;
  let shapes = this.set('shapes',arrayShape.mk());
  this.setiupRandomGridForShapes('radius',{step:10,min:10,max:100});
  this.addFrame();
  let drop =  this.generateDrop();
  let {points,radii} = drop;
  let ln  = points.length;
  for (let i=0;i<ln;i++) {
    let crc = this.circleP.instantiate();
    crc.dimension = 1*radii[i];
    shapes.push(crc);
    crc.moveto(points[i]);
   }
 // return;
 // let points = this.pointsFromCircleDrops();
  let p = points[0];
  p.onFringe = 1
  //this.generateWeb(pnts,lineP);
  this.generateWeb({points});
}

export {rs};


