
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();

rs.setName('grid_bend');
addGridMethods(rs);
addRandomMethods(rs);
 
    
let nr = 140;
nr = 100;
let wd = 1000;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:10,delta:(wd*0.8)/nr,backFill:'black',randomizeOrder:1,fromLeft:1,turnUp:1};
Object.assign(rs,topParams);

const pointAlongL = function (startPnt,turningPnt,x,up) {
  let {x:tx,y:ty} = turningPnt;
  let sx = startPnt.x;
  let sy = startPnt.y;
  let dx = tx-sx;
  let left = dx>0;
  let dy = up?(left?dx:-dx):(left?-dx:dx);
  let p;
  if (x <= 0.5) {
    p = Point.mk(sx + 2*dx*x,ty);
  } else {
    p = Point.mk(tx,ty - 2*dy*(x-0.5));
  }
  return p;
}

rs.positionMethod = function (i,j) {
  let {width,numRows,delta,fromLeft,turnUp} = this;
  let ci = numRows - i - 1;
  let hw = 0.5*width;
  let spx= (fromLeft)? -hw:hw;
  let spy = turnUp?hw-i*delta:i*delta - hw;
  let sp = Point.mk(spx,spy);
  let tpx = fromLeft? hw-i*delta:i*delta - hw;
  let tpy = turnUp?hw-i*delta:i*delta - hw;
  let tp = Point.mk(tpx,tpy);
  let x = j/(numRows-1)
  let p = pointAlongL (sp,tp,x,turnUp);
  return p;
}
 
rs.initProtos = function () {	
  let circleP = this.circleP = circlePP.instantiate();
  circleP['stroke-width'] = 0;
  circleP.dimension = 30;
  circleP.fill = 'rgba(255,255,0,0.4)';
}
let scale = 15;

rs.shapeGenerator = function (rvs,cell) {
  let {numRows,numCols} = this;
  let hr = numRows/2;
  let hc = numCols/2;
  let {x,y} = cell;
  let cdx = Math.abs((x-hr)/hr);
  let cdy = Math.abs((y-hc)/hc);
  let cdist =  Math.sqrt(cdx*cdx+cdy*cdy);
  let level = Math.floor(rvs.level);
  let opacity = level/255;
  let shape = this.circleP.instantiate().show();
  shape.dimension = scale*cdist;//+ 5;
  return shape;
}

rs.initialize = function () {
  this.initProtos();
  this.addRectangle(this.backFill);
  this.setupRandomGridForShapes('level', {step:30,min:0,max:255});
  this.set('llines',arrayShape.mk());
  this.generateGrid(); 
}

export {rs}

