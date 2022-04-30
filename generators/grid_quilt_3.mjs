
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addPowerGridMethods} from '/mlib/PowerGrid.mjs';

let rs = basicsP.instantiate();

addRandomMethods(rs);
addGridMethods(rs);
addPowerGridMethods(rs);

rs.setName('grid_quilt_3');

let opa = 0.8;

rs.powerParams = {randomizingFactor:0,root:2,
	  fillMap:[`rgba(0,255,0,${opa}`,
	            `rgba(255,0,0,${opa})`,
		          `rgba(255,255,255,${opa})`,
	            `rgba(0,0,255,0.5)`,
		          `rgba(0,0,255,1)`,
		          `rgba(0,0,255,${opa})`,
	            `rgba(255,255,255,${opa})`],
		sizeMap: [1,1,2,2,4,1,1]
};


let wd =300;
let topParams = {
  pointJiggle:2,	
  numRows : 96,
  numCols : 96,
	width:wd,
	height:wd,
	framePadding  : 0.15*wd,
  orderByOrdinal:1,
  ordinalMap:[0,1,2,3,4,5]
}
Object.assign(rs,topParams);
	
rs.initProtos = function () {
	this.circleP=circlePP.instantiate();
	this.circleP.stroke = 'rgba(0,0,0,.8)';
	this.circleP['stroke-width'] = 1;
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



