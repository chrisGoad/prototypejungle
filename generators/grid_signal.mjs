
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addPowerGridMethods} from '/mlib/powerGrid.mjs';
let rs = basicsP.instantiate();

addGridMethods(rs);
addRandomMethods(rs);
addPowerGridMethods(rs);

let sqd = 48;
sqd = 16;
let ar = 2;
let wd = 1000;
let szf = 2;

rs.powerParams  = {root:2,randomizingFactor:0.5,
  fillMap:['white','white','white','white'],
  sizeMap: [.1*szf,.2*szf,.4*szf,.8*szf,0,0,0]
};

let topParams = {numRows:32,numCols:64,width:wd,height:wd}

Object.assign(rs,topParams);
rs.initProtos = function () {
  this.circleP = circlePP.instantiate();
  this.circleP.stroke = 'rgba(0,0,0,.8)';
  this.circleP['stroke-width'] = 0.2;
}



rs.shapeGenerator = function () {
  return this.circleP.instantiate().show();
}

rs.initialize = function () {
  this.initProtos();
  this.generateGrid();
}

export {rs};

