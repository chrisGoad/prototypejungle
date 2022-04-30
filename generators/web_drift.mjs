import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addWebMethods} from '/mlib/web.mjs';

let rs = basicP.instantiate();

addRandomMethods(rs);
addDropMethods(rs);
addWebMethods(rs);


rs.setName('web_drift');
let ht= 2000;
ht = 6000;
let nrc = 20;
let topParams = {maxFringeTries:10,numRows:nrc,numCols:nrc,width:1.5*ht,height:ht,maxDrops:2000,dropTries:100,webTries:200,lineLength:2,framePadding:0.1*ht:20,minConnectorLength:0,maxConnectorLength:200,shortenBy:10,sphereCenter:Point3d.mk(0,0,-0.3*ht),sphereDiameter:0.5*ht,focalPoint:Point3d.mk(0,0,ht),focalLength:10,cameraScaling:1000}

Object.assign(rs,topParams);


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .1;
  this.lineP['stroke-width'] = 6;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.dimension = 20;
  circleP.fill = 'transparent';
  circleP.stroke = 'transparent';
}  

rs.dropAt = function (p) {
  debugger;
  let rd = 30;
  let gcrc = geom.Circle.mk(p,rd);
  let scrc = this.circleP.instantiate();
  scrc.dimension = 2*rd;
  return [gcrc,scrc];
}
 
const nearDiagonal = function (pi,pj,howNear) {
  return true;
  let {x:pix,y:piy} = pi;
  let {x:pjx,y:pjy} = pj;
  let dx = pjx - pix;
  let dy = piy - pjy;
  let a = (180 * Math.atan2(dx,dy))/Math.PI;
  return (a > (45-howNear)) && (a < (45+howNear));
}
  
rs.numCalls = 0;
rs.pairFilter = function (i,j) {
  //let {maxConnectorLength:mxCln,minConnectorLength:mnCln=0,cPoints,numDropped,width} = this;
  let {cPoints} = this;
  let pi = cPoints[i];
  let pj = cPoints[j];
  let cell = this.cellOf(pi);
  let rvs = this.rvsAtCell(cell);
   let cln = rvs.connectorLn;
  let d = pi.distance(pj);
  if ((cln < d) && (d < (cln + 100))) {
    return true;
  }
}

rs.initialize = function () {
  this.initProtos();
  //let {maxConnectorLength:mxCln,minConnectorLength:mnCln=0,width,lineP} = this;
  
  this.setupRandomGridForShapes('connectorLn',{step:80,stept:0.5,min:50,max:500});
  this.addFrame();
  this.generateDrop();
  let points = this.pointsFromCircleDrops();
  let p = points[0];
  p.onFringe = 1
  //this.generateWeb(pnts,lineP);
  this.generateWeb({points});
}

export {rs};


