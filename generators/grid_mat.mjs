
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addSpatterMethods} from '/mlib/spatter.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();

addSpatterMethods(rs);
addRandomMethods(rs);

let wd = 400;
let topParams ={numDrops:5000,width:wd,height:wd,framePadding:0.5*wd};
Object.assign(rs,topParams);
rs.setName('grid_mat');

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP['stroke-width'] = 0.1;
}  

rs.shapeGenerator = function (rvs,cell) {
  let {shapes,lineP} = this;
  let col = cell.x;
  let inmiddle = (col > .333* this.numCols) && (col < 0.666* this.numCols);
  let shape = containerShape.mk();
  shapes.push(shape);
  let line0 = this.lineP.instantiate();
  let line1 = this.lineP.instantiate();
  shape.set('line0',line0);
  shape.set('line1',line1);
  line0.show();
  line1.show();
  let dir = rvs.direction;
  let len = rvs.length;
  let vec0 = Point.mk(Math.cos(dir),Math.sin(dir)).times(len/0.3);
  let vec1 = Point.mk(-Math.sin(dir),Math.cos(dir)).times(len/0.31);
  let end0 = vec0.minus();
  let end1 = vec0;
  line0.setEnds(end0,end1);
  let r = rvs.shade;
  let rgb = `rgb(${Math.floor(r)},${Math.floor(r)},${Math.floor(r)})`;
  if (inmiddle) {
    line0.stroke = 'red';
    line0['stroke-width'] = 0.2;
  } else {
    line0.stroke = rgb;
  }
  end0 = vec1.minus();
  end1 = vec1;
  line1.stroke = rgb;
  line1.setEnds(end0,end1);
  return shape;
}
	
rs.initialize = function () {
  this.initProtos();
  this.addFrame();
	this.setupRandomGridForShapes('length',  {step:5,min:20,max:30});
	this.setupRandomGridForShapes('direction', {step:0.2* Math.PI,min:1.95*Math.PI,max:2*Math.PI});
	this.setupRandomGridForShapes('shade', {step:30,min:50,max:250});
  this.addSpatter();
}	

export {rs};

 