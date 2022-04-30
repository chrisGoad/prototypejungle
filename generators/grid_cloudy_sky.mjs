
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();
rs.setName('grid_cloudy_sky');
addGridMethods(rs);
addRandomMethods(rs);
  
let nr = 140;
let wd = 1400;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:20,framePadding:0.17*wd,backFill:'rgb(0,150,255)'};
Object.assign(rs,topParams);


rs.initProtos = function () {	
  let circleP = this.circleP = circlePP.instantiate();
  circleP['stroke-width'] = 0;
  circleP.dimension = 30;
}

rs.shapeGenerator = function (rvs,cell) {
  let {x,y} = cell;
  let level = Math.floor(rvs.level);
  let opacity = level/255;
  let {shapes,circleP} = this;
  let shape = circleP.instantiate().show();
  shape.fill = `rgba(${level},${level},${level},${opacity})`;
  return shape;
}

rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  this.addRectangle(this.backFill);
  this.setupRandomGridForShapes('level', {step:30,min:0,max:255});
  this.generateGrid(); 
}

export {rs};


