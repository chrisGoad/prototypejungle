
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();

let wd = 300;
let nmc  = 200;
let topParams = {width:wd,height:wd,numRows:nmc,numCols:nmc,framePadding:0.1*wd}

addGridMethods(rs);
addRandomMethods(rs);
Object.assign(rs,topParams);

rs.setName('grid_smoke_1');

rs.initProtos = function () {
  this.rectP = rectPP.instantiate();
  this.rectP['stroke-width'] = 0;
  this.rectP.dimension = 4;
}  

rs.shapeGenerator = function (rvs) {
  debugger;
  let {rectP,deltaX,deltaY,shapes} = this;
  let shape = rectP.instantiate();
  let fc = 1.1;
  shape.width = fc*deltaX;
  shape.height = fc*deltaY;
  let r = rvs.red;
  let ir = Math.floor(r/50)*50;
  shape.fill = `rgb(${Math.floor(r)},${Math.floor(r)},0)`;
  shape.update();
  shape.show();
  return shape;
}

rs.initialize = function () {
  let {numRows,numCols } = this;
  this.addFrame();
  this.initProtos();
  let rnp = {correlated:0};
  const computeParams = function (i,j) {
    let fri = i/numRows;
    let frj = j/numCols;
    if ((frj>0.4) && (frj<.6) && (fri>.45) && (fri<0.5)) {
      rnp.step = 30;
      rnp.max=0;
      rnp.min=0;
    } else {
      rnp.step = 20;
      rnp.min = 50;
      rnp.max = 250;
    }
    return rnp;
  }
  this.setupRandomGridForShapes('red',computeParams);
  this.generateGrid();
}

export {rs};


