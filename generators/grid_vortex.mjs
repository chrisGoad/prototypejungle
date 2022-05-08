
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addPowerGridMethods} from '/mlib/powerGrid.mjs';
let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);
addPowerGridMethods(rs);

rs.setName('grid_vortex');
let opacity = 0.3;
let mxi = 255;
rs.powerParams  = {	
  root:3,
  sizeMap:[1.5,1,2,3,0,1,0],
  fillMap:[
    `rgba(${mxi},${mxi},${mxi},${opacity})`,
    `rgba(0,0,0,${opacity})`,
    `rgba(0,${mxi},${mxi},${opacity})`,
    `rgba(0,${mxi},${mxi},${opacity})`,
    `rgba(0,0,${mxi},0.8)`,
    `rgba(${mxi},0,0,1)`,
    `rgba(${mxi},${mxi},0,1)`
  ]
};
    
let wd = 400 
let outer = 200;
let topParams = {width:wd, height:wd, framePadding:.1*wd, numRows : 96, numCols : 96};
let radialPositionParams = {center:Point.mk(0,0), rotation : 45, outerRadius : outer, innerRadius:0.05*outer};

Object.assign(rs,topParams);
Object.assign(rs,radialPositionParams);
 
rs.initProtos = function () {
  this.circleP = circlePP.instantiate().show();
  this.circleP['stroke-width'] = 0.4;
  this.circleP.fill = "red";
  this.circleP.dimension = 1;
  this.lineP = linePP.instantiate().show();
  this.lineP.stroke = 'red';
  this.lineP['stroke-width'] = 0.5;
}

rs.positionMethod = rs.radialPositionMethod;

rs.boundaryLineGenerator = function (p11,p21,rvs) {
  let line = this.lineP.instantiate().show();
  line.setEnds(p11,p21);
  return line
}

rs.shapeGenerator = function () {
  return this.circleP.instantiate().show();
}

rs.initialize = function () {
  this.initProtos();
  this.generateGrid();
  this.addFrame();
}

export {rs};



