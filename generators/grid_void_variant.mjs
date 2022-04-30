
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addPowerGridMethods} from '/mlib/powerGrid.mjs';
let rs = basicsP.instantiate();

addGridMethods(rs);
addRandomMethods(rs);
addPowerGridMethods(rs);
rs.setName('grid_void_variant');

rs.powerParams  = {
  root:2,
  sizeMap:[0.5,0.5,1,1],
  fillMap:['red','yellow','blue','white']
};

let wd = 100;
let nr = 32;
let topParams = {pointJiggle:1,numRows:nr,numCols:nr,width:wd,height:wd,framePadding:0.15*wd};
Object.assign(rs,topParams);

rs.initProtos = function () {
  let rectP = this.rectP = rectPP.instantiate();
  this.rectP['stroke-width'] = 0;
}

rs.shapeGenerator = function () {
  return this.rectP.instantiate().show();
}

rs.initialize = function () {
  this.initProtos();
  this.generateGrid();
  this.addFrame();
}

export {rs};




