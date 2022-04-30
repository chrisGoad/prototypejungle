
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addParamsByCellMethods} from '/mlib/ParamsByCell.mjs';
let rs = basicsP.instantiate();

addGridMethods(rs);
addRandomMethods(rs);
addParamsByCellMethods(rs);
rs.setName('grid_void_variant');


let wd = 400;
let nr = 64;
//let topParams = {pointJiggle:1,numRows:nr,numCols:nr,width:wd,height:wd,backFill:'red',framePadding:0.15*wd};
let topParams = {pointJiggle:0,numRows:nr,numCols:nr,width:wd,height:wd,backFill:'black',framePadding:0.15*wd};
Object.assign(rs,topParams);
//let baseSize = wd/(2*nr);
let baseSize = 0.5;

rs.pByC  = {
  widthFactor:1,
  heightFactor:1,
  maxSizeFactor:4,
  sizePower:2,
  sizeMap:  {0:baseSize,1:baseSize,2:baseSize,3:baseSize,4:baseSize},
  colorMap: 
    {
      0:`cyan`,
      1:`magenta`,
      2:`green`,
      3:`blue`,
      4:`yellow`,
    }
};

rs.paramsByCell = function (cell) {
  return this.pByC;
}
	

rs.initProtos = function () {
  let rectP = this.rectP = rectPP.instantiate();
  this.rectP.stroke = 'rgba(0,0,0,.8)';
  this.rectP['stroke-width'] = 0;
}


rs.initialize = function () {
  this.initProtos();
  this.pByC.shapeProto = this.rectP;
  this.addRectangle(this.backFill);
  this.generateGrid();
  this.addFrame();
}

export {rs};




