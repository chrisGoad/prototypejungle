import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as partP} from '/generators/grid_3_part.mjs';

let rs = basicsP.instantiate();

addGridMethods(rs);
rs.setName('grid_3');

let nr = 10;
let wd = 1200;
let topParams = {numRows:nr,numCols:nr,width:wd,height:wd,framePadding:0.15*wd}
Object.assign(rs,topParams);

rs.initProtos = function () {
  this.circleP =circlePP.instantiate();
  this.circleP.fill = 'blue';
  this.circleP.dimension =20
}  

rs.shapeGenerator = function (rvs,cell) {
  let {shapes,circleP} = this;
  let rn = Math.floor(Math.random() * 3);
  let shape;
  if (rn === 0) {
    shape = circleP.instantiate();
  } else {
    shape = partP.instantiate();
    let clr = (rn === 1)?'red':'white';
    shape.initialize(clr);
  }
  shape.show();
  return shape;
}
    
rs.initialize = function () {
  this.addFrame();  
  this.initProtos();
  this.generateGrid();
}
  	
export {rs};


