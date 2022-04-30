import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();

addGridMethods(rs);
rs.setName('grid_3_part');
addGridMethods(rs);
/*
let onr = 10;
let owd = 1200;
let outerParams = {numRows:onr,numCols:onr,width:owd,height:owd,framePadding:0.15*owd}
Object.assign(rs,outerParams);
*/
let nr = 3;
let wd = 40;
let topParams = {numRows:nr,numCols:nr,width:wd,height:wd}
Object.assign(rs,topParams);
	

rs.initProtos = function (clr) {
  this.rectP =rectPP.instantiate();
	this.rectP.fill = clr;
	this.rectP['stroke-width'] = 0;
	this.rectP.width = 4;
	this.rectP.height = 4;
}

rs.shapeGenerator = function () {
	let {circleP,shapes,rectP} = this;
  let shape = rectP.instantiate().show();
	return shape;
}
		
rs.initialize = function (clr='red') {
  this.addFrame();	
	this.initProtos(clr);
	this.generateGrid();
}
		
export {rs};


