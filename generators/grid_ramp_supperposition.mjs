//core.require('/shape/line.js','/shape/circle.js','/shape/rectangle.js','/gen0/basics.js','/mlib/grid.js','/mlib/boundedRandomGrids.js',
let radial = 0;
//function (linePP,circlePP,rectPP,rs,addGridMethods,addRandomMethods) {
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
let grid1 = rs.set('grid1',basicsP.instantiate());
let grid2 = rs.set('grid2',basicsP.instantiate());
addGridMethods(grid1);
addRandomMethods(grid1);	
addGridMethods(grid2);
addRandomMethods(grid2);
rs.setName('grid_ramp');
	
const initProtos = function (grid) {
	grid.rectP  = rectPP.instantiate();
	grid.rectP.fill = 'white';
	//grid.rectP.fill = 'black';
	//grid.rectP.fill = 'rgba(55,55,55,0.6)';
	//grid.rectP.fill = 'red';
	grid.rectP['stroke-width'] = 0;
	grid.rectP.width = .5;
	grid.rectP.height = .5;
  grid.blineP  = linePP.instantiate();
  grid.blineP['stroke-width'] = 0.2;
  grid.blineP['stroke-width'] = 0.4;
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
let wd = 200;
let ht = 150;
let topParams;
if (radial) {
  topParams = {numRows:0.5*nr,numCols:nr,width:wd,height:wd,outerRadius:wd,innerRadius:0.2*wd,angleMin:-180,angleMax:180,center: Point.mk(0,0),rotation:30,frameColor:'rgb(2,2,2)',pointJiggle:4,framePadding:0.15*wd};
} else {
 // topParams = {numRows:nr,numCols:nr,width:wd,height:ht,frameColor:'rgb(2,2,2)',pointJiggle:0,framePadding:0.20*wd,frameVisible:0,sideA:function(fr) {return this.leftSide.pointAlong(fr)},sideB:function(fr) {return this.rightSide.pointAlong(fr)},positionFunction:grid1.sidesPositionFunction};
  topParams = {saveState:0,numRows:nr,numCols:nr,width:wd,height:ht,frameColor:'rgb(2,2,2)',pointJiggle:0,framePadding:0.20*wd,frameVisible:0,sideA:geom.LineSegment.mk(Point.mk(0,-0.5*ht),Point.mk(-0.5*wd,0.5*ht)),sideB:geom.LineSegment.mk(Point.mk(0,-0.5*ht),Point.mk(0.5*wd,0.5*ht)),positionFunction:grid1.sidesPositionFunction};
}

let genLeft = (wd,ht) => {
  return geom.LineSegment.mk(Point.mk(0,-0.5*ht),Point.mk(-0.5*wd,0.5*ht));
}
let genRight = (wd,ht) => {
  return geom.LineSegment.mk(Point.mk(0,-0.5*ht),Point.mk(0.5*wd,0.5*ht));
}
Object.assign(grid1,topParams);
Object.assign(grid2,topParams);
Object.assign(rs,topParams);
let wd2 = 1.1*wd;
//let ht2 = 0.9*wd;
let ht2 = ht;
Object.assign(grid2,{width:1.1*wd,height:0.9*wd});
Object.assign(grid2,{width:wd2,height:ht2});
//let sides = {sideA:function(fr) {return this.leftSide.pointAlong(fr)},sideB:function(fr) {return this.rightSide.pointAlong(fr)}}
Object.assign(grid1,{leftSide:genLeft(wd,ht),rightSide:genRight(wd,ht)});
Object.assign(grid1,{leftSide:genLeft(wd,ht),rightSide:genRight(wd,ht)});
Object.assign(grid2,{leftSide:genLeft(wd2,ht2),rightSide:genRight(wd2,ht2)});
Object.assign(grid2,{leftSide:genLeft(wd2,ht2),rightSide:genRight(wd2,ht2)});

//Object.assign(grid2,{width:1.05*wd,height:0.95*wd});
//Object.assign(grid2,{width:1.02*wd,height:0.98*wd});

	
const shapeGenerator = function (grid,rvs,cell) {
		let {rectP,shapes} = grid;
	//	let v = rvs.v;
		let shape = rectP.instantiate().show();
		shapes.push(shape);
    
    let {r,g,b} = rvs;
  	let rgb = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
	shape.fill = rgb;
 //   debugger;
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
  debugger;
	let line = blineP.instantiate().show();
	lines.push(line);
  line.setEnds(end0,end1);
  let {r,g,b} = rvs;
	let rgb = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
	line.stroke = rgb;
  line.update();
	return line;
}

grid1.boundaryLineGenerator = function (end0,end1,rvs,cell) {
  boundaryLineGenerator(this,end0,end1,rvs,cell);
}


grid2.boundaryLineGenerator = function (end0,end1,rvs,cell) {
  boundaryLineGenerator(this,end0,end1,rvs,cell);
}

if (radial) {
  grid1.positionFunction = grid1.radialPositionFunction;
  grid2.positionFunction = grid2.radialPositionFunction;
}


rs.computeState  = function () {
   return [["grid1/randomGridsForShapes",this.grid1.randomGridsForShapes],["grid2/randomGridsForShapes",this.grid2.randomGridsForShapes],
   ["grid1/randomGridsForBoundaries",this.grid1.randomGridsForBoundaries],["grid2/randomGridsForBoundaries",this.grid2.randomGridsForBoundaries]];
}

rs.initialize = function () {
  debugger;
  let {saveState} = this;
 core.root.backgroundColor = 'black';
  this.grid1.initProtos();
  this.grid2.initProtos();
  this.addFrame();
  if (saveState) {
    let rparams = {step:30,min:0,max:250}
    this.grid1.setupRandomGridForShapes('r', rparams);
    this.grid1.setupRandomGridForShapes('g', rparams);
    this.grid1.setupRandomGridForShapes('b', rparams);
    this.grid1.setupRandomGridForBoundaries('r', rparams);
    this.grid1.setupRandomGridForBoundaries('g', rparams);
    this.grid1.setupRandomGridForBoundaries('b', rparams);
    this.grid2.setupRandomGridForShapes('r', rparams);
    this.grid2.setupRandomGridForShapes('g', rparams);
    this.grid2.setupRandomGridForShapes('b', rparams);
    this.grid2.setupRandomGridForBoundaries('r', rparams);
    this.grid2.setupRandomGridForBoundaries('g', rparams);
    this.grid2.setupRandomGridForBoundaries('b', rparams);
    this.saveTheState();
    this.grid1.generateGrid();
    this.grid2.generateGrid();  
  } else { 
    this.getTheState(() => {
      debugger;
      this.grid1.generateGrid();
      this.grid2.generateGrid();  
    });
  }
}
export {rs};


