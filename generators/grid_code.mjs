import {rs as polylinePP} from '/shape/polyline.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);
rs.setName('grid_code');
let ht = 400;
let topParams = {width:1.5*ht,height:ht,numRows:100,numCols:100,pointJiggle:0,factorX:0.25,factorY:0.05,crossColor:'yellow',framePadding:0.17*ht,frameVisible:0};

Object.assign(rs,topParams);
	
rs.initProtos = function () {
  this.polylineP = polylinePP.instantiate();
  this.polylineP['stroke-width'] = 1;
  this.polylineP.stroke = 'yellow';
}  

rs.colorGenerator = function (rvs,cell) {
  let r = Math.floor(Math.random()*255);
  let g = Math.floor(Math.random()*255);
  let b = Math.floor(Math.random()*255);
  let tone = Math.random();
  let rgb =`rgb(${r},${g},${b})`;
  return rgb;
}

rs.shapeGenerator = function (rvs,cell) {
  let {shapes,polylineP,deltaX,deltaY,factorX:fcx,factorY:fcy,numRows,numCols,crossColor} = this;
  let {p0x,p0y,p1x,p1y,p2x,p2y,p3x,p3y,interior} = rvs;
  let {x,y} = cell;
  let mr0 = Math.floor(0.333 * numRows);
  let mr1 = Math.floor(0.666 * numRows);
  let mc0 = Math.floor(0.333 * numCols);
  let mc1 = Math.floor(0.666 * numCols);
  let p0  = Point.mk(-deltaX*fcx,p0y*fcy);
  let p1  = Point.mk(-0.3333*deltaX*fcx,p1y*fcy);
  let p2  = Point.mk(0.3333*deltaX*fcx,p2y*fcy);
  let p3  = Point.mk(deltaX*fcx,p3y*fcy);
  let shape = polylineP.instantiate();
  if (((mr0<y) && (y<mr1)) || ((mc0 < x) && (x < mc1))) {
    shape.stroke = crossColor;
  }
  shape.thePoints = [p0,p1,p2,p3];
  shape.update();
  shape.show()
  return shape;
}
  
rs.initialize = function () {
  this.initProtos();
  let rmin = -100;
  let rmax = 100;
  let rstep = 45;
  let params = {step:rstep,min:rmin,max:rmax};
  this.setupRandomGridForShapes('p0y',params);
  this.setupRandomGridForShapes('p1y',params);
  this.setupRandomGridForShapes('p2y',params);
  this.setupRandomGridForShapes('p3y',params);
  this.generateGrid();
  this.addFrame();
}  

export {rs};
 