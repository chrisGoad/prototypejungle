
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);
rs.setName('grid_ramp');
	
rs.initProtos = function () {
  this.rectP  = rectPP.instantiate();
  this.rectP['stroke-width'] = 0;
  this.rectP.width = .5;
  this.rectP.height = .5;
  this.blineP  = linePP.instantiate();
  this.blineP['stroke-width'] = 0.4;
}  

let nr = 64;
let wd = 200;
let ht = 150;
let topParams = {saveState:0,numRows:nr,numCols:nr,width:wd,height:ht,pointJiggle:0,framePadding:0.20*wd,sideA:geom.LineSegment.mk(Point.mk(0,-0.5*ht),Point.mk(-0.5*wd,0.5*ht)),sideB:geom.LineSegment.mk(Point.mk(0,-0.5*ht),Point.mk(0.5*wd,0.5*ht)),positionMethod:rs.sidesPositionMethod};

Object.assign(rs,topParams);

rs.shapeGenerator = function (rvs,cell) {
  let {rectP,shapes} = this;
  let shape = rectP.instantiate().show();
  let {r,g,b} = rvs;
  let rgb = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
  shape.fill = rgb;
  return shape;
 } 
  

rs.boundaryLineGenerator= function (end0,end1,rvs,cell) {
	let {blineP,showMissing,lines,updating,lineIndex} =this;
	let line = blineP.instantiate().show();
	lines.push(line);
  line.setEnds(end0,end1);
  let {r,g,b} = rvs;
	let rgb = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
	line.stroke = rgb;
  line.update();
	return line;
}



rs.computeState  = function () {
   return [["randomGridsForShapes",this.randomGridsForShapes],["randomGridsForBoundaries",this.randomGridsForBoundaries]];
}

rs.initialize = function () {
  debugger;
  let {saveState,stateOpsDisabled} = this;
  this.initProtos();
  this.addFrame();
  if (saveState || stateOpsDisabled) {
    let rparams = {step:30,min:0,max:250}
    this.setupRandomGridForShapes('r', rparams);
    this.setupRandomGridForShapes('g', rparams);
    this.setupRandomGridForShapes('b', rparams);
    this.setupRandomGridForBoundaries('r', rparams);
    this.setupRandomGridForBoundaries('g', rparams);
    this.setupRandomGridForBoundaries('b', rparams);
    this.saveTheState();
    this.generateGrid();
  } else { 
    this.getTheState(() => {
      debugger;
      this.generateGrid();
    });
  }
}
export {rs};


