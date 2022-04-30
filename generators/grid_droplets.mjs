
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();

addGridMethods(rs);
addRandomMethods(rs);
rs.setName('grid_droplets');

let wd = 300;
let nr= 40;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:5,framePadding:0.15*wd,backFill:'rgb(200,0,0)'};

Object.assign(rs,topParams);

rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'rgb(255,255,255,1)';
  lineP['stroke-width'] = 0.5;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'rgb(00,200,200)';
  let rectP = this.rectP = rectPP.instantiate()
  this.rectP.fill = 'rgb(200,0,0)';
}  

rs.shapeGenerator = function (rvs) {
  let shapes = this.shapes;
  let {which,dimension} = rvs;
  let showCircle = which > 0.5;
  let shape;
  if (showCircle) {
    shape = this.circleP.instantiate().show();
    shape.dimension = dimension;
    return shape;
  }
  shape = this.rectP.instantiate();
  shape.width = dimension;
  shape.height = dimension;
  shape.update();
  shape.show();
  return shape;
}
	

rs.boundaryLineGenerator = function (end0,end1,rvs,cell) {
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



