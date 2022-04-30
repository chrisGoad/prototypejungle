//core.require('/line/line.js','/shape/circle.js','/shape/rectangle.js','/gen0/basics.js','/mlib/grid.js','/mlib/boundedRandomGrids.js',
let radial = 0;
//function (linePP,circlePP,rectPP,rs,addGridMethods,addRandomMethods) {
import {rs as linePP} from '/line/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
/*
addGridMethods(rs);
addRandomMethods(rs);	

rs.setName('grid_for_superposition');
let rdim = 0.6;
rs.initProtos = function () {
	this.rectP  = rectPP.instantiate();
	this.rectP.fill = 'red';
	this.rectP.fill = 'white';
	//this.rectP.fill = 'rgba(55,55,55,0.6)';
	//this.rectP.fill = 'red';
	this.rectP['stroke-width'] = 0;
	this.rectP.width = rdim;
	this.rectP.height = rdim;
  this.blineP  = linePP.instantiate();
  this.blineP['stroke-width'] = 0.3;
  this.blineP.stroke = 'cyan';
  this.blineP.stroke = 'white';

}  


let nr = 64;
nr= 48;
let wd = 200;
let topParams;
if (radial) {
  topParams = {numRows:0.5*nr,numCols:nr,width:wd,height:wd,outerRadius:wd,innerRadius:0.2*wd,angleMin:-180,angleMax:180,center: Point.mk(0,0),rotation:30,pointJiggle:4,framePadding:0.15*wd};
} else {
  topParams = {numRows:nr,numCols:nr,width:wd,height:wd,pointJiggle:8,framePadding:0.25*wd,frameVisible:0};
}
rs.computeJiggleParams = function (jiggle) {
  let hj = 0.5*jiggle;
  let jiggleStep = .02 * hj;
  return {stept:jiggleStep,step:jiggleStep,min:-hj,max:hj};
}

Object.assign(rs,topParams);


	
const shapeGenerator = function (rvs,cell) {
		let {rectP,shapes} = this;
		let shape = rectP.instantiate().show();
		return shape;
}	

  
  

const boundaryLineGenerator= function (end0,end1,rvs,cell) {
	let {blineP,showMissing,lines,updating,lineIndex} =this;
 
	let line = blineP.instantiate().show();
	// lines.push(line);
  line.setEnds(end0,end1);
	return line;
}


rs.initialize = function () {
  debugger;
  this.initProtos();
  this.initializeGrid();
  
 // this.addFrame();
}
*/
export {rs};


