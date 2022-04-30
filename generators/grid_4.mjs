
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);
rs.setName('grid_4');
 
let nr = 40;
let wd = 200;
let topParams = {numRows:nr,numCols:nr,width:wd,height:wd,pointJiggle:9,framePadding:0.15*wd};
Object.assign(rs,topParams);

rs.initProtos = function () {
  this.blineP = linePP.instantiate();
  this.blineP.stroke = 'rgb(100,100,100)';
  this.blineP['stroke-width'] = 0.4;  
  this.shapeP = linePP.instantiate();
  this.shapeP.stroke = 'white';
}  

rs.shapeGenerator = function (rvs) {
  let shapes = this.shapes;
  let rs = containerShape.mk();
  let factor2 = 1;
  const setup = (nm,shp,idx,count) => {
    rs.set(nm,shp);
    let dx = this.deltaX;
    let hln = (dx/count) * 0.05;// = 0.03;
    let x = -0.5*dx + (dx/(count+1))*(idx+1);
    let p0 = Point.mk(x-hln,0);
    let p1 = Point.mk(x+hln,0);
    shp.setEnds(p0,p1);
    shp.update();
    shp.show();
  } 
  let r0,r1;
  let disp = this.deltaX * 0.25;
  const num = Math.floor(Math.random()* 7.999)+1;
  if (num > 4) return;
  for (let i=0;i<num;i++) {
    let r = this.shapeP.instantiate();
    setup('r'+i,r,i,num);
  } 
  return rs;
};
  
rs.boundaryLineGenerator = function (end0,end1,rvs,cell) {
  let {blineP,showMissing,lines,updating,lineIndex} = this;
  let line = this.genLine({end0:end0,end1:end1},blineP);
  let c = rvs.color
  // lines.push(line);
  line.setEnds(end0,end1);
  line.stroke = `rgb(0,${Math.floor(c)},${Math.floor(c)})`;
  line.show();
  return line;
}

rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.setupRandomGridForBoundaries('color', {step:35,min:150,max:250});
  this.generateGrid();
}

export {rs};


