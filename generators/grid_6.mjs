
//core.require('/gen1/grid0_6.js',
//core.require('/shape/circle.js','/gen0/Basics.js','/mlib/grid.js','/mlib/boundedRandomGrids.js',
//function (circlePP,rs,addGridMethods,addRandomMethods)	{ 


import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();

rs.setName('grid_6');
addGridMethods(rs);
addRandomMethods(rs);
let nr = 30;
let wd=1000;

let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:20,framePadding:0.15*wd};
Object.assign(rs,topParams);


rs.initProtos = function () {	
	let rectP = this.rectP = rectPP.instantiate();
	rectPP.fill = 'rgba(250,250,250,0.5)';
	rectPP['stroke-width'] = 0;

}

rs.shapeGenerator = function (rvs,cell) {
  let level = 50 + 205*Math.random();
  console.log(level);
  let {shapes,rectP,deltaX} = this;
  debugger;
  let shape = rectP.instantiate().show();
  // shapes.push(shape);
  let {wd,ht} = rvs;
  rectP.width = deltaX*wd;
  rectP.height = deltaX*ht;
  return shape;
}

rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.setupRandomGridForShapes('wd',{step:.1,min:0.7,max:1.3});
  this.setupRandomGridForShapes('ht',{step:.1,min:0.7,max:1.3});
  this.generateGrid();
}

export {rs};


