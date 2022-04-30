
import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);	
rs.setName('grid_example1');
	
rs.initProtos = function () {
	rs.rectP  = rectPP.instantiate();
	rs.rectP.fill = 'white';
	rs.rectP['stroke-width'] = 0;
	rs.rectP.width = .5;
	rs.rectP.height = .5;
  rs.frectP  = rectPP.instantiate();
  rs.frectP.stroke = 'white';
	rs.frectP.fill = 'transparent';
	rs.frectP['stroke-width'] = 2;
	rs.rectP.width = .5;
	rs.rectP.height = .5;
//	rs.rectP.height = 1;
  rs.blineP  = linePP.instantiate();
  rs.blineP['stroke-width'] = 0.4;
 // rs.blineP['stroke-width'] = 1;
  rs.blineP.stroke = 'white';

}  

let nr = 64;
let ht = 100;
let wd = 1.5*ht;
let topParams = {numRows:nr,numCols:nr,width:wd,height:ht,frameColor:'rgb(2,2,2)',pointJiggle:2,framePadding:0.15*wd,frameVisible:1};
Object.assign(rs,topParams);

rs.shapeGenerator = function (rvs,cell) {
	let {rectP,shapes,numRows} = this;
  let {x,y} = cell;
  let fwd = (x)/(numRows);// fraction of the way across (i.e. to max x)
  if (Math.random()<fwd) {
   return;
  }
	let shape = rectP.instantiate().show();
	//shapes.push(shape);
	return shape;
}

rs.boundaryLineGenerator= function (end0,end1,rvs,cell) {
	let {blineP,numRows,showMissing,lines,updating,lineIndex} =this;
  let {x,y} = cell;
  let fwd = x/numRows;// fraction of the way across (i.e. to max x)
  let ra = Math.random();
  if  (ra*ra*ra<fwd) {
   return;
  }
	let line = blineP.instantiate().show();
	//lines.push(line);
  line.setEnds(end0,end1);
  let vi = Math.floor(rvs.v);
	line.stroke = `rgb(${vi},${vi},${vi})`;
	return line;
}

rs.initialize = function () {
   let rparams = {step:30,min:100,max:250}
   this.setupBoundaryRandomizer('v',rparams); 
   this.initProtos();
   this.addFrame();
   let frect = this.frectP.instantiate();
   frect.width = 1.5*wd;
   frect.height = 1.5*ht;
   frect.show();
   this.set('frect',frect);
   this.initializeGrid();
}

export {rs};


