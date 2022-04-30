
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
rs.setName('grid_example4');
	
rs.initProtos = function () {
  rs.blineP  = linePP.instantiate();
  rs.blineP['stroke-width'] = 0.4;
  rs.blineP.stroke = 'white';

}  

let nr = 32;
let wd = 200;
let ht = wd;
let topParams = 
{numRows:nr,numCols:nr,width:wd,height:ht,framePadding:0.1*wd,
 leftSide:LineSegment.mk(Point.mk(0,-0.5*ht),Point.mk(-0.5*wd,0.5*ht)),
 rightSide:LineSegment.mk(Point.mk(0,-0.5*ht),Point.mk(0.5*wd,0.5*ht)),
 sideA:function(fr) {return this.leftSide.pointAlong(fr)},
 sideB:function(fr) {return this.rightSide.pointAlong(fr)},
  positionMethod:rs.sidesPositionFunction};
Object.assign(rs,topParams);


rs.boundaryLineGenerator= function (end0,end1,rvs,cell) {
	let {blineP,numRows,showMissing,lines,updating,lineIndex} =this;
	let line = blineP.instantiate().show();
	// lines.push(line);
  line.setEnds(end0,end1);
	return line;
}


rs.initialize = function () {
  debugger;
  this.initProtos();
 this.addFrame();
  this.generateGrid();
}



export {rs};


