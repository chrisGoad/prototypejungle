import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addLinesMethods} from '/mlib/lines.mjs';	

let rs = basicP.instantiate();
addLinesMethods(rs);

rs.setName('lines_chaos_within_order');

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .1; 
  this.gridLineP = linePP.instantiate();
  this.gridLineP.stroke = 'white';
  this.gridLineP['stroke-width'] = 2; 
  this.circleP = circlePP.instantiate();
  this.circleP.stroke = 'black';
  this.circleP.fill = 'black';
}  

let ht = 200;
let wd = 1.5*ht
let topParams = {delta:10,center:Point.mk(0,0),width:wd,height:ht,  frameWidth:1.17*wd, frameHeight:1.17*ht, circleRadius:60, numLines:1000, angleMin:-90, angleMax:90}
Object.assign(rs,topParams);

rs.drawGrid = function () {
  let {gridLineP} = this;
  let gridLines = this.set('gridLines',arrayShape.mk());
  let {delta,width,height} = this;
  let numHlines = Math.ceil(height/delta);
  let numVlines = Math.ceil(width/delta);
  let hwd = width/2;
  let hht = height/2;
  for (let i=0;i<=numHlines;i++) {
    let cy = -hht + i*delta;
    let end0 = Point.mk(-hwd,cy);
    let end1 = Point.mk(hwd,cy);
    this.addLine({lines:gridLines,end0:end0,end1:end1,lineP:gridLineP});
  }
  for (let i=0;i<=numVlines;i++) {
    let cx = -hwd + i*delta;
    let end0 = Point.mk(cx,-hht);
    let end1 = Point.mk(cx,hht);
    this.addLine({lines:gridLines,end0:end0,end1:end1,lineP:gridLineP});
  }
}

rs.initialize = function () {
  this.initProtos();
  let {lineP,circleP,circleRadius,numLines} = this;
  this.addFrame();
  this.drawGrid();
  let circleShape =  this.set('visCircle',this.circleP.instantiate().show());
  circleShape.dimension =2*circleRadius;
  circleShape.update();
  let circle = geom.Circle.mk(Point.mk(0,0),circleRadius);
  circle.onCircle=1;
  let lines = this.set('lines',arrayShape.mk());
  this.generateLines({src:circle,srcOn:1,dst:circle,dstOn:1,numLines,lineP:lineP});
}	

export {rs};
 
