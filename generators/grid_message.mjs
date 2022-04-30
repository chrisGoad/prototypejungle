import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addLinesMethods} from '/mlib/lines.mjs';
//import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();
rs.setName('grid_message');

const initializeGridProtos = function (grid) {
  grid.rlineP=linePP.instantiate();
  grid.rlineP.stroke = 'white';
  grid.rlineP['stroke-width'] = 0.5;
  grid.rectangleP = rectPP.instantiate();
  grid.rectangleP.stroke = 'white';
  grid.rectangleP.fill = 'black';
  grid.rectangleP['stroke-width'] = 0.5;
}  

const initializeLinesProtos = function (lines) {
  lines.lineP = linePP.instantiate();
  lines.lineP.stroke = 'cyan';
  lines.lineP['stroke-width'] = .075; 	
}  
let ht = 200;
let topParams = {width:1.5*ht,height:ht,framePadding:0.17*ht};
Object.assign(rs,topParams);


let linesParams = {width:300,height:200,numLines:3000,angleMin : -90,angleMax : 90};

let rfac  = 3;
let wfac  = 0.5;
let base =20;
//let gridParams ={numRows:base,numCols:base*rfac,width:200*wfac,height:100*wfac,includeLetters:1,letterWidth:3,letterHeight:3,fractionInked:0.4,lettersPerWord:5};
let gridParams ={numRows:base,numCols:base*rfac,width:150*wfac,height:100*wfac,includeLetters:1,letterWidth:3,letterHeight:3,fractionInked:0.4,lettersPerWord:5};

rs.initialize = function () {
  
  this.addFrame();
  let lines = this.set('lines',basicsP.instantiate());
  addLinesMethods(lines);
  initializeLinesProtos(lines);
  Object.assign(lines,linesParams)
  lines.originatingShapes = [geom.Circle.mk(Point.mk(-100,-200),100),geom.Circle.mk(Point.mk(100,-200),100)];
  lines.generateLines();
  let grid = this.set('grid',basicsP.instantiate());
  addGridMethods(grid);
  initializeGridProtos(grid);
  let rect = grid.set('rectangle',grid.rectangleP.instantiate().show());
  Object.assign(grid,gridParams);
  rect.width = grid.width+20;
  rect.height = grid.height+20;
  rect.moveto(Point.mk(0,5));
  grid.generateGrid();
}	
export {rs};

      

