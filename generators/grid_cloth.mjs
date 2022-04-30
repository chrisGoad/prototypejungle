
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);
rs.setName('grid_cloth');

let wd = 400;
let nr = 100;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,framePadding:0.2*wd,frameVisible:0};
Object.assign(rs,topParams);
	
rs.initProtos = function () {
  this.rectP = rectPP.instantiate();
  this.rectP.fill = 'white';
  this.rectP['stroke-width'] = 0;
}  

rs.shapeGenerator = function (rvs,cell) {
  let shapes = this.shapes;
  let {rectP,deltaX,deltaY} = this;
  let rb = Math.random() > 0.5;
  let shape  = containerShape.mk();
  let inner = this.rectP.instantiate();
  shape.set('i',inner);
  if (rb) {
    inner.width = 1;
    inner.height = 4;
  } else {
    inner.width = 4;
    inner.height = 1;
  }
  let jogx = rvs.jogx;
  let jogy = rvs.jogy;
  let {v} = rvs;
  inner.moveto(Point.mk(jogx,jogy));
  inner.show();
  inner.fill = this.toGray(v);
  shape.show();
  return shape;
}
		
rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  let rnp = {min:0,max:0,step:0}
  let numCols = this.numCols;
  let numRows = this.numRows;
  const computeParams = function (i,j) {
    let hw = 0.5 * numCols;
    let frw = Math.abs(i - hw)/hw;
    let hh = 0.5 * numRows;
    let frh = Math.abs(j - hh)/hh;
    let rtfr = Math.max(frw,frh);
    let fr = rtfr*rtfr * rtfr;
    let stepFactor,maxFactor;
    stepFactor = 4;
    maxFactor = 25;
    maxFactor = 15;
    rnp.min = 0;
    rnp.max = fr * maxFactor;
     rnp.step = fr *stepFactor;
    return rnp;
  }
  this.setupRandomGridForShapes('jogx', computeParams);
  this.setupRandomGridForShapes('jogy', computeParams);
  this.setupRandomGridForShapes('v', {step:30,min:50,max:240});
  this.generateGrid();
}
		

export {rs};



