// this is a component of generators/spatter_variant.mjs
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addSpatterMethods} from '/mlib/spatter.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicP.instantiate();
addSpatterMethods(rs);
addRandomMethods(rs);
rs.setName('spatter_for_variants');

rs.which = 1; // set in container, ie generators/spatter_variant.mjs 

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'rgb(255,255,255)';
  this.lineP['stroke-width'] = 1;
  this.lineP.dimension = 4;
  this.boundaryLineP = linePP.instantiate();
  this.boundaryLineP.stroke = 'rgb(255,255,0)';
  this.boundaryLineP['stroke-width'] = 1;
}  

let topParams = {numRows:20,numCols:20,width:400,height:400,numDrops:3000};

Object.assign(rs,topParams);


const updateLineeee = function (line,rvs) {
  let len = rvs.length;
  let dir = rvs.direction;
  let vec = Point.mk(Math.cos(dir),Math.sin(dir)).times(len/2);
  let end0 = vec.minus();
  let end1 = vec;
  line.setEnds(end0,end1);
}

rs.shapeGenerator = function (rvs) {
  debugger;
  let line = this.lineP.instantiate();
  line.show();
  let len = rvs.length;
  let dir = rvs.direction;
  let vec = Point.mk(Math.cos(dir),Math.sin(dir)).times(len/2);
  let end0 = vec.minus();
  let end1 = vec;
  line.setEnds(end0,end1);
  line.stroke = Math.random()<0.5?'green':'yellow';
  line.update();
  return line;
}

rs.initialize = function () {
  let which = this.which;
  this.initProtos();
  this.setupRandomGridForShapes('direction', {step:0.2* Math.PI,stept:0.1*Math.PI,min:0,max:2*Math.PI});
  if (which === 1) {
    this.setupRandomGridForShapes('length', {step:5,min:5,max:15});
  }
  if (which === 2) {
    debugger;
    this.setupRandomGridForShapes('length', {step:5,min:5,max:15});
  }
  if (which === 3) {
    debugger;
    this.setupRandomGridForShapes('length', {step:5,min:15,max:25});
  }
  if (which === 4) {
    debugger;
    this.setupRandomGridForShapes('length', {step:5,min:50,max:85});
  }
  this.addSpatter();
}	

export {rs};


