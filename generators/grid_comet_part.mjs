//core.require('/shape/line.js','/shape/circle.js','/shape/rectangle.js','/gen0/basics.js','/mlib/grid.js','/mlib/boundedRandomGrids.js',

//function (linePP,circlePP,rectPP,rs,addGridMethods,addRandomMethods) {
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addSphereMethods} from '/mlib/sphere.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();

addGridMethods(rs);
addRandomMethods(rs);
addSphereMethods(rs);
rs.setName('grid_comet_part');
	
rs.initProtos = function (grid) {
	this.rectP  = rectPP.instantiate();
	this.rectP.fill = 'white';
	this.rectP['stroke-width'] = 0;
	this.rectP.width = 5.5;
	this.rectP.height = 5.5;
  this.blineP  = linePP.instantiate();
  this.blineP['stroke-width'] = 0.8;
  this.blineP.stroke = 'cyan';
  this.blineP.stroke = 'white';

}  

let nr = 96;
let wd = 50;
let topParams = {numRows:nr,numCols:nr,width:wd,height:wd,pointJiggle:50,framePadding:0.15*wd,
sphereCenter:Point3d.mk(0,0,-20),sphereDiameter:35,focalPoint:Point3d.mk(0,0,50),focalLength:10,cameraScaling:100};

Object.assign(rs,topParams);
	
rs.shapeGenerator = function (rvs,cell) {
		let {rectP} = this;
		let shape = rectP.instantiate().show();
		return shape;
}

  

rs.boundaryLineGenerator= function (end0,end1,rvs,cell) {
	let {blineP,showMissing,lines,updating,lineIndex} = this;
	let line = blineP.instantiate().show();
  line.setEnds(end0,end1);
	return line;
}

rs.initialize = function () {
 // debugger;
 // core.root.backgroundColor = 'blue';
  let {focalPoint,focalLength,cameraScaling} = this;
  this.addFrame();
  this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,'z');
  this.initProtos();
  this.generateGrid();
}

export {rs};


