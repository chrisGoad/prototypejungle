import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
let rs = basicsP.instantiate();
addGridMethods(rs);

let nr = 64;
let wd = 200;
let topParams = {numRows:nr,numCols:nr,width:wd,height:wd,chance:0.02,spacing:5,phase:0,backFill:'rgb(0,0,100)'};

Object.assign(rs,topParams);

rs.initProtos = function () {
	this.rectP = rectPP.instantiate();
  this.rectP['stroke-width'] = 0;
}  


rs.shapeGenerator = function (rvs,cell) {
  debugger;
  let {shapes,rectP,circleP,numRows,numCols,genCircles,deltaX,deltaY,chance:ichance,spacing,phase} = this;
  let {x,y} = cell;
  let include = (x >=spacing) && (y >= spacing) && (x <= (numCols-spacing)) && (y <=(numRows-spacing)) && (x%spacing === phase) && (y%spacing === phase);
  let chance = ichance * spacing * spacing;
  if (include && (Math.random() < chance)) {
    let shape = rectP.instantiate().show();
    // shapes.push(shape);
    let fc = 1;
    shape.width = fc*deltaX;
    shape.height = fc*deltaY;
    shape.fill = 'rgba(255,255,255,0.4)';
    return shape;

  } 
}

rs.initialize = function () {
	this.initProtos();
	this.addRectangle(this.backFill);
	this.generateGrid();
}
		
export {rs};


