
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);
rs.setName('grid_maze');
	
rs.initProtos = function () {
  this.rectP = rectPP.instantiate();
  this.rectP.fill = 'white';
  this.rectP.stroke = 'black';
  this.rectP['stroke-width'] = 0.1;
  this.rectP['stroke-width'] = 0;
  this.rectP.width = 1;
  this.rectP.height = 4;
}  

let nr = 48;
let ht = 20;
let ar = 1;
let wd = ar*ht
let nc = ar*nr;

let topParams = {numRows:nr,numCols:nc,width:wd,height:ht,factorX:1,factorY:0.9,frameStrokeWidthh:0.5,framePadding:0.17*wd};
//let topParams = {numRows:nr,numCols:nc,width:wd,height:ht,factorX:5,factorY:5,frameStrokeWidthh:0.5,framePadding:0.17*wd};

Object.assign(rs,topParams);

rs.shapeGenerator = function (rvs,cell) {
  let {rectP,shapes,width,height,numRows,numCols,factorX,factorY} = this;
  let w = rvs.which;
  let shape  = containerShape.mk();
  let inner = this.rectP.instantiate();
  let deltaX = width/numCols;
  let deltaY = height/numRows;
  shape.set('i',inner);
  let v = rvs.v;
  let rgb = `rgba(${Math.floor(v)},${Math.floor(v)},${Math.floor(v)},1)`;
  if (w<0.5) {
    inner.width = 4;
    inner.width = 0.04*height;
    inner.width = 4*factorX*deltaX;
    inner.height = 3;
    inner.height = 0.03*height;
    inner.height = 3*factorY*deltaY;
    inner.fill = 'rgb(100,50,50)';
    inner.fill = rgb;
  } else {
    inner.width = 3;
    inner.width = 3* factorX * deltaX;
    //inner.width = 0.03*height;
    inner.height = 4;
    inner.height = 0.04*height;
    inner.height = 4*factorY * deltaY;
    inner.fill = rgb;
  }
  shapes.push(shape);
  inner.update();
  inner.show();
  shape.show();
  return shape;
}

rs.initialize = function () { 
  let {numRows,numCols} = this;
  this.initProtos();
  this.addFrame();
  let rnp = {};
  const computeParams = function (i,j) {
    let t0 = 0.1*numCols;
    let t1 = 0.5*numCols;
    let t2 = 0.9*numCols;
    let step = 0.3;
    let max,min;
    if (i < t0) {
      min = 0;
      max = i/t0;
      max = 0;
    } else if (i < t2) {
      min = 0;
      max = 1;
    } else {
      min  = (i-t2)/(1-t2);
      min  = 1;
      max = 1;
    }
    rnp.min = min;
    rnp.max = max;
    rnp.step = step;
    return rnp;
  }  
  this.setupRandomGridForShapes('which', computeParams);
  this.setupRandomGridForShapes('v', {step:30,min:150,max:250});
  this.addFrame();
  this.generateGrid();
}

export {rs};


