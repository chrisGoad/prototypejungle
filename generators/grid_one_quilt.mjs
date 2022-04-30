import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);

let bsz = 250;
let ht = 450;
let sqd = 32;
let ar = 2;
let topParams = {saveImage:true,numRows:ar*sqd,numCols:ar*sqd,width:300,height:300,pointJiggle:3,randomizeOrder:1,backFill:'rgb(255,100,0)'};
Object.assign(rs,topParams);
	
rs.setName('grid_one_quilt');

rs.initProtos = function () {
  this.rectP=rectPP.instantiate();
  this.rectP.stroke = 'rgba(0,0,0,.8)';
  this.rectP['stroke-width'] = 0.2;
}

rs.sizeFactor = function ( cell) {
  let {x,y} = cell;
  let px = this.numPowers(x,2);
  let py = this.numPowers(y,2);
  return Math.min(px,py);
}
let wdf = 6/ar;
let htf = .7;

const colorSetter = function (shape,fc) {
  let r = 200 + Math.random() * 55;
  let rr = 200 + Math.random() * 55;
  let g = 150 +Math.random() * 55;
  let gg = 100 +Math.random() * 55;
  let b = 100 + Math.random() * 155;
  if (fc <= 1) {
    shape.fill = `rgba(${rr},${gg},0,0.4)`;
  } else if (fc === 2) {
    shape.fill = 'rgba(255,255,255,0.4)';
  } else if (fc === 3) {
    shape.fill = `rgba(0,${b},${b},0.4)`;
  } else if (fc === 4) {
  shape.fill = 'rgba(255,255,255,0.4)';
  } else if (fc === 4) {
    shape.fill = 'white';
  }
}

rs.shapeGenerator = function (rvs,cell) {
  let {shapes,rectP,deltaX,deltaY} = this;
  let shape = rectP.instantiate();
  shape.width = wdf * deltaX;
  shape.height= htf * deltaY;
  let fc = this.sizeFactor(cell);
  colorSetter(shape,fc);
  shape.show();
  return shape;
}

rs.initialize = function () {
  this.initProtos();
  this.addRectangle(this.backFill);
  this.generateGrid();
}

export {rs};


