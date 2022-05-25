import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addDropMethods} from '/mlib/dropCircles.mjs';
import {rs as addWebMethods} from '/mlib/web.mjs';

let rs = basicP.instantiate();

addRandomMethods(rs);
addDropMethods(rs);
addWebMethods(rs);


rs.setName('web_random_radius',3);
let ht= 2000;
ht = 6000;
let nrc = 100;
let topParams = {numRows:nrc,numCols:nrc,width:ht,height:ht,framePadding:0.1*ht}

let dropParams = {dropTries:50,radius:60}

let webParams = {webTries:100,lineLengthh:2,minConnectorLength:0,maxConnectorLength:300}

Object.assign(rs,topParams);

rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .1;
  this.lineP['stroke-width'] = 6;
}  

  
rs.numCalls = 0;
rs.radiusGenerator= function (p) {
  let cell = this.cellOf(p);
  let rvs = this.rvsAtCell(cell);
  let rad = rvs.radius;
  return rad;
}

rs.pairFilter = function (i,j) {
  let {cPoints} = this;
  let pi = cPoints[i];
  let pj = cPoints[j];
  let fc = 20;
  if ((Math.abs(pi.x - pj.x) < fc) || (Math.abs(pi.y - pj.y) < fc)) return 1;
}

rs.initialize = function () {
  this.initProtos();
  let shapes = this.set('shapes',arrayShape.mk());
  this.setupRandomGridForShapes('radius',{step:10,min:10,max:100});
  this.addFrame();
  let drop =  this.generateCircleDrop(dropParams);
  let {points,radii} = drop;
  this.generateWeb(Object.assign({points},webParams));
}

export {rs};


