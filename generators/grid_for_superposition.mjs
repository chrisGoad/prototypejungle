//  this is used as a component in /generators/grid_superposition.mjs. width and height are set in the parent generator
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();

addGridMethods(rs);
addRandomMethods(rs);	

rs.setName('grid_for_superposition');
let rdim = 0.6;

rs.initProtos = function () {
  this.rectP  = rectPP.instantiate();
  this.rectP.fill = 'white';
  this.rectP['stroke-width'] = 0;
  this.rectP.width = rdim;
  this.rectP.height = rdim;
  this.blineP  = linePP.instantiate();
  this.blineP['stroke-width'] = 0.3;
  this.blineP.stroke = 'white';

}  

let nr= 48;
let  topParams = {numRows:nr,numCols:nr,pointJiggle:8};
Object.assign(rs,topParams);

rs.shapeGenerator = function (rvs,cell) {
    let {rectP,shapes} = this;
    let shape = rectP.instantiate().show();
    return shape;
}  

rs.boundaryLineGenerator= function (end0,end1,rvs,cell) {
  let line = this.blineP.instantiate().show();
  line.setEnds(end0,end1);
  return line;
}

rs.initialize = function () {
  this.initProtos();
  this.generateGrid();
}

export {rs};


