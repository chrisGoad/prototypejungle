
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
rs.setName('grid_example2');
	
rs.initProtos = function () {
  rs.blineP  = linePP.instantiate();
  rs.blineP['stroke-width'] = 0.4;
  rs.blineP.stroke = 'white';

}  

let nr = 32;
let wd = 200;
let topParams = {numRows:nr,numCols:nr,width:wd,height:wd,framePadding:0.1*wd};
Object.assign(rs,topParams);

rs.positionMethod = function(i,j) {
  let {width,height,numRows,numCols} = this;
  let incy = height/numRows;
  let incx = width/numCols;
  let frd = i/numRows;
  let cwd = frd*width;
  let cincx = frd*incx;
  //let rs = Point.mk(-0.5*widt + j*incx,-0.5* height + i*incy);;
  let rs = Point.mk(-0.5*cwd + j*cincx,-0.5* height + i*incy);;
  return rs;
 }


rs.positionMethod = function(i,j) {
  let {width,height,numRows,numCols} = this;
  let cellht = height/numRows;
  let cellwd = width/numCols;
  let frd = i/numRows;  //fraction down
  let cwd = frd*width; // current width
  let ccellwd = frd*cellwd; // currect width of a cell
  //let rs = Point.mk(-0.5*widt + j*incx,-0.5* height + i*celldimy);;
  let rs = Point.mk(-0.5*cwd + j*ccellwd,-0.5* height + i*cellht);;
  return rs;
 }

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


