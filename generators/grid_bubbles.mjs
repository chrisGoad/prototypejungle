
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addPowerGridMethods} from '/mlib/PowerGrid.mjs';

let rs = basicsP.instantiate();
addRandomMethods(rs);
addGridMethods(rs);
addPowerGridMethods(rs);
rs.setName('grid_bubbles');

let numRows = 64;
let ht = 1000;
	
let topParams = {numRows:numRows,numCols:numRows,width:1.5*ht,height:ht,randomizeOrder:1,orderByOrdinal:0,backFill:'blue',backgroundPaddingg:0.05*ht,framePadding:0.2*ht};
Object.assign(rs,topParams);
	
			
rs.initProtos = function () {	
  this.circleP = circlePP.instantiate();
  this.circleP.fill = 'white';
  this.circleP.stroke = 'rgba(0,0,0,.8)';
  this.circleP['stroke-width'] = 2;  
}

let oo = 0.3;
let r = 255;
rs.powerParams = {
  root:2,
  genCircles: 1,
  sizeMap:[1,2,4,8,0,0,0],
  fillMap:['white','white','white','white',`rgba(0,0,255,${oo})`,`rgba(0,0,0,${oo})`,`rgba(${r},${r},0,${oo})`]
}


rs.shapeGenerator = function () {
  return this.circleP.instantiate().show();
}

rs.initialize = function () {
  this.initProtos();
  this.addRectangle(this.backFill);
  this.addFrame();
  this.generateGrid();
}

export {rs};

