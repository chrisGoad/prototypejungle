
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addPowerGridMethods} from '/mlib/PowerGrid.mjs';
let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);
addPowerGridMethods(rs);
rs.setName('grid_shield');

let opacity = 0.7;
let r = 255;
let b = 255;
let fc = 0.5;

rs.powerParams  = {	
  root:3,
  genCircles:1,
  sizeMap:[fc*1.5,fc*1,fc*2,fc*0,fc*0,fc*1,0],
  fillMap:[
    `rgba(0,${r},0,${opacity})`,
    `rgba(${r},0,0,${opacity})`,
    `rgba(255,255,255,${opacity})`,
    `rgba(0,${b},${b},${opacity})`,
    `rgba(250,0,0,0.8)`,
    `rgba(250,0,0,1)`,
    `rgba(${r},${r},0,1)`
  ]
};

let wd = 400;
let orad = 200;
let topParams = {
  width:wd,
  height:wd,
  framePadding:0.15*wd,
  pointJiggle:5,  
  numRows : 66,
  numCols : 66,
  center:Point.mk(0,0),
  outerRadius:orad,
  innerRadius:0.1 * orad,
  center:Point.mk(0,0)
}

Object.assign(rs,topParams);
rs.positionMethod = rs.radialPositionFunction;

rs.initProtos = function () {
  this.circleP = circlePP.instantiate().show();
  this.circleP['stroke-width'] = 0;
}

rs.shapeGenerator = function () {
  return this.circleP.instantiate().show();
 
}

rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.generateGrid();
}

export {rs};



