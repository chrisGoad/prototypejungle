
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addPowerGridMethods} from '/mlib/powerGrid.mjs';
let rs = basicsP.instantiate();

addGridMethods(rs);
addRandomMethods(rs);
addPowerGridMethods(rs);
rs.setName('grid_void');


rs.powerParams  = {
  root:2,
  sizeMap:  [1,1,2,4],
  fillMap: [`rgba(255,0,0,0)`,`rgba(255,0,0,0.4)`,`rgba(255,255,255,0.4)`,`rgba(0,0,0,1)`]
};

rs.powerParamsByCell = function (cell) {
  let {numRows,numCols,powerParams} = this;
  let {x,y} = cell;
  let cx = numCols/2;
  let cy = numRows/2;
  // {x:cx,y:cy} are coordinates of center
  let maxd = Math.sqrt(cx*cx + cy*cy);
  let xdc = x - cx;
  let ydc = y - cy;
  let cd = Math.sqrt(xdc*xdc + ydc*ydc); // distande from center
  let df = cd/maxd; //fractional distance from center; 1 = far as possible; 0 = at center
  let yf = y/numRows;
  let wf =  1.3* df;
  powerParams.widthFactor = wf;
  powerParams.heightFactor = wf;
  return powerParams;
}
	
let wd = 96;
let topParams = {pointJiggle:1,numRows:96,numCols:96,width:wd,height:wd,backFill:'red',framePadding:15};

Object.assign(rs,topParams);

rs.initProtos = function () {
  let rectP = this.rectP = rectPP.instantiate();
  this.rectP.stroke = 'rgba(0,0,0,.8)';
  this.rectP['stroke-width'] = 0.2;
}


rs.shapeGenerator = function () {
  return this.rectP.instantiate().show();
}

rs.initialize = function () {
  this.initProtos();
  this.addRectangle(this.backFill);
  this.generateGrid();
  let rdim = 10;
  this.addRectangle({width:rdim,height:rdim,fill:'black'});
  this.addFrame();
}

export {rs};




