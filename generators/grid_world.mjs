import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();

addGridMethods(rs);
addRandomMethods(rs);
rs.setName('grid_world');
let sqsz= 50;
let sqd = 50;
let wd = 0.8 * sqd * sqsz;
let topParams = {numCols:sqd,numRows:sqd,width:wd,height:wd,framePadding:0.1*wd,randomizeOrder:1};
Object.assign(rs,topParams);

rs.initProtos = function () {
  this.rectP = rectPP.instantiate();
  this.rectP.stroke = 'black';
  this.rectP.fill = 'blue';
  this.rectP['stroke-width'] = 4;
}  

let baseColor = 100;

rs.shapeGenerator = function (rvs,cell) {
  let {shapes,rectP,circleP,numRows,numCols} = this;
  let bOw = rvs.blueOrWhite;
  let shape = rectP.instantiate().show();
  let hc = 0.5*numCols;
  let c = Point.mk(hc,hc);
  let dist = c.distance(cell);
  let rdist = dist/(0.5 * numRows);
  let fc =1 - rdist;
  let clr = 100 + 200*(1-rdist);
  let dim =  Math.sqrt(Math.max(0,fc)) * 2 * sqsz;
  if (dim === 0) {
    return;
  }
  shape.width = dim;
  shape.height = dim;
  let lev = 100 + bOw*50;
  let scolor = Math.max(baseColor,clr - 50);
  shape.fill = (bOw < 1)?`rgba(${scolor-50},${scolor-50},${clr},1)`:`rgba(${clr},${clr},${clr})`;
  shape.stroke = (bOw < 1)?`rgba(0,0,${scolor},1)`:`rgba(${scolor},${scolor},${scolor})`;
  return shape;
}

rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  this.setupRandomGridForShapes('blueOrWhite',{step:0.5,min:0,max:2});
  this.generateGrid();
}

export {rs};


