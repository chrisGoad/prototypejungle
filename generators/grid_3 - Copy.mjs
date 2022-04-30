import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();

addGridMethods(rs);
rs.setName('grid_3');
let innerProto = containerShape.mk();
addGridMethods(innerProto);

let onr = 10;
let owd = 1200;
let outerParams = {numRows:onr,numCols:onr,width:owd,height:owd,framePadding:0.15*owd}
Object.assign(rs,outerParams);
let inr = 3;
let iwd = 40;
let innerParams = {numRows:inr,numCols:inr,width:iwd,height:iwd}
Object.assign(innerProto,innerParams);
	
rs.initProtos = function () {
  this.circleP =circlePP.instantiate();
  this.circleP.fill = 'blue';
  this.circleP.dimension =20
}  

innerProto.initProtos = function (clr) {
  this.rectP =rectPP.instantiate();
	this.rectP.fill = clr;//'white';
	this.rectP['stroke-width'] = 0;
	this.rectP.width = 4;
	this.rectP.height = 4;
}

innerProto.shapeGenerator = function () {
	let {circleP,shapes,rectP} = this;
  let ishape = rectP.instantiate();
	// shapes.push(ishape);
	return ishape;
}

rs.shapeGenerator = function (rvs,cell) {
		let {shapes,circleP} = this;
		let rn = Math.floor(Math.random() * 3);
		let shape;
		if (rn === 0) {
			shape = circleP.instantiate();
	  } else {
		  shape = innerProto.instantiate();
      let clr = (rn === 1)?'red':'white';
		  shape.initProtos(clr);
			shape.generateGrid();	
		}
		// shapes.push(shape);
		shape.show();
		return shape;
	}
		
rs.initialize = function () {
	
  this.addFrame();	
	this.initProtos();
	this.generateGrid();
}
		
export {rs};


