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
let grid1 = rs.set('grid1',basicsP.instantiate());
let grid2 = rs.set('grid2',basicsP.instantiate());
addGridMethods(grid1);
addRandomMethods(grid1);
addSphereMethods(grid1);
addGridMethods(grid2);
addRandomMethods(grid2);
addSphereMethods(grid2);
rs.setName('grid_incoming');
	
const initProtos = function (grid) {
	grid.rectP  = rectPP.instantiate();
	grid.rectP.fill = 'white';
	//grid.rectP.fill = 'black';
	//grid.rectP.fill = 'rgba(55,55,55,0.6)';
	//grid.rectP.fill = 'red';
	grid.rectP['stroke-width'] = 0;
	grid.rectP.width = 5.5;
	grid.rectP.height = 5.5;
  grid.blineP  = linePP.instantiate();
  grid.blineP['stroke-width'] = 0.8;
  grid.blineP.stroke = 'cyan';
  grid.blineP.stroke = 'white';

}  

grid1.initProtos = function () {
  initProtos(this);
}

grid2.initProtos = function () {
  initProtos(this);
}

let nr = 64;
let wd = 50;
let topParams = {numRows:nr,numCols:nr,width:wd,height:wd,pointJiggle:50,framePadding:0.15*wd,
sphereCenter:Point3d.mk(0,0,-20),sphereDiameter:35,focalPoint:Point3d.mk(0,0,50),focalLength:10,cameraScaling:100};

Object.assign(grid1,topParams);
Object.assign(grid2,topParams);
Object.assign(grid2,{width:1.1*wd,height:0.9*wd});
//Object.assign(grid2,{width:1.05*wd,height:0.95*wd});
//Object.assign(grid2,{width:1.02*wd,height:0.98*wd});

	
const shapeGenerator = function (grid,rvs,cell) {
		let {rectP,shapes} = grid;
	//	let v = rvs.v;
		let shape = rectP.instantiate().show();
		// shapes.push(shape);
   // debugger;
		return shape;
}

grid1.shapeGenerator = function (rvs,cell) {
  return shapeGenerator(this,rvs,cell);
}


grid2.shapeGenerator = function (rvs,cell) {
   return shapeGenerator(this,rvs,cell);
}
  
  

const boundaryLineGenerator= function (grid,end0,end1,rvs,cell) {
	let {blineP,showMissing,lines,updating,lineIndex} =grid;
	//let line = this.nextLine(blineP);
	let line = blineP.instantiate().show();
	// lines.push(line);
  line.setEnds(end0,end1);
	return line;
}


grid1.boundaryLineGenerator = function (end0,end1,rvs,cell) {
  return boundaryLineGenerator(this,end0,end1,rvs,cell);
}


grid2.boundaryLineGenerator = function (end0,end1,rvs,cell) {
  return boundaryLineGenerator(this,end0,end1,rvs,cell);
}
rs.initialize = function () {
 // debugger;
 // setBackgroundColor( = 'blue';
  let {focalPoint,focalLength,cameraScaling} = this.grid1;
  this.addFrame();

  this.grid1.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,'z');
  this.grid2.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,'z');

  this.grid1.initProtos();
  this.grid1.generateGrid();
  this.grid2.initProtos();
  this.grid2.generateGrid();  
}
export {rs};


