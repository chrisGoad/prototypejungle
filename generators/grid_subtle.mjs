
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();

addGridMethods(rs);
addRandomMethods(rs);
rs.setName('grid_subtle');

let wd = 300;
let nr= 80;
let topParams = {width:wd,height:wd,numRows:nr,numCols:1,pointJiggle:0,framePadding:0.15*wd,backFill:'rgb(200,0,0)'};

Object.assign(rs,topParams);

rs.initProtos = function () {
debugger;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'rgb(255,255,255,1)';
  lineP['stroke-width'] = 0.5;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'rgb(0,200,200)';
  let rectP0 = this.rectP0 = rectPP.instantiate()
  this.rectP0.fill = 'rgb(20,20,200)'; 
  rectP0['stroke-width'] = 0;
  let rsz = 1.1*(wd/nr);
  rectP0.width = wd;
  rectP0.height = rsz;
  let rectP1 = this.rectP1 = rectPP.instantiate()
  this.rectP1.fill = 'rgb(20,0,200)';
  rectP1['stroke-width'] = 0;
  rectP1.width = wd;
  rectP1.height = rsz;
   let rectP2 = this.rectP2 = rectPP.instantiate()
  this.rectP2.fill = 'rgb(40,20,200)';
  rectP2['stroke-width'] = 0;
  rectP2.width = wd;
  rectP2.height = rsz;
 
}  

rs.shapeGenerator = function (rvs) {
  
  let {which} = rvs;
  debugger;
  let showRect1 = which > 0.666;
  let showRect0 = which > 0.333;
  console.log('which',which);
  let shape = showRect1?this.rectP1.instantiate():(showRect0?this.rectP0.instantiate():this.rectP2.instantiate());
  shape.show();
  return shape;
}
	

rs.boundaryLineGeneratorr = function (end0,end1,rvs,cell) {
  let line = this.lineP.instantiate().show();
  line.setEnds(end0,end1);
  let y = rvs.yellow;
  line.stroke = `rgb(${Math.floor(y)},${Math.floor(y)},0)`;
  return line;
}

rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  this.addRectangle(this.backFill);
  this.setupRandomGridForBoundaries('yellow',{step:30,min:50,max:200});
  this.setupRandomGridForShapes('dimension',{step:2,min:1,max:4});
  this.setupRandomGridForShapes('which',{step:0.3,min:0,max:1});
  this.generateGrid();
}

export {rs};



