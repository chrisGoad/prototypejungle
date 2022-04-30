
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();

rs.setName('grid_beacons');
addGridMethods(rs);
addRandomMethods(rs);
let nr = 30;
let wd=1000;

let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:20,framePadding:0.15*wd};
Object.assign(rs,topParams);

rs.initProtos = function () {	
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'red';
  circleP['stroke-width'] = 0;
  circleP.radius= 7;
}

rs.shapeGenerator = function (rvs,cell) {
  let level = 50 + 205*Math.random();
  let {circleP} = this;
  let shape = circleP.instantiate().show();
  shape.fill = `rgb(${level},0,0)`;
  return shape;
}

rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.generateGrid();
}

export {rs};


