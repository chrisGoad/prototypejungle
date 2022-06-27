import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
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
Object.assign(rs,topParams);

let dropParams = {dropTries:50,radius:60}

let webParams = {webTries:100,minConnectorLength:0,maxConnectorLength:300};


rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .1;
  this.lineP['stroke-width'] = 6;
}  

  
rs.numCalls = 0;
rs.generateDrop = function (p) {
  let cell = this.cellOf(p);
  let rvs = this.rvsAtCell(cell);
  let rad = rvs.radius;
  let crc = Circle.mk(rad)
  return {geometries:[crc],shapes:[]};
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
  webParams.lineP = this.lineP;
  let shapes = this.set('shapes',arrayShape.mk());
  this.setupRandomGridForShapes('radius',{step:10,min:10,max:100});
  this.addFrame();
  let circles =  this.generateDrops(dropParams);
  let points = circles.map((c) => c.center);
  this.generateWeb(Object.assign(webParams,{points}));
}

export {rs};


