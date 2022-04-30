

import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addLinesMethods} from '/mlib/lines.mjs';	

let rs = basicP.instantiate();
addLinesMethods(rs);
rs.setName('lines_tangents');
let wd = 14.14;
let ht = wd;
let topParams = {width:wd,height:ht,numLines:1000,frameFilll:'black',framePadding:2.7*wd,frameStroke:'gray'}
Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = this.set('lineP',linePP.instantiate().hide());
  this.lineP.stroke = 'black';
  this.lineP['stroke-width'] = .015;
  this.circleP = this.set('circleP',circlePP.instantiate().hide());
  this.circleP['stroke-width'] = 0;
  this.circleP.fill = 'white';
}
 	


rs.circleWithBackground= function(nm,pnt,radius,circleP) {
  let circ = Circle.mk(pnt,radius);
  let circShape = circleP.instantiate().show();
  this.set(nm,circShape);
  circShape.dimension = 2*radius;
  circShape.moveto(pnt);
  return circ;
 }
 


rs.initialize = function () {
  this.setBackgroundColor('gray');
  debugger;
  this.initProtos();
  this.addFrame();
  let {numLines,lineP,circleP} = this;
  let rd = 10;
  let ccenterBig = this.circleWithBackground('circcenterBig',Point.mk(0,0),9,circleP);
  let ccenter = this.circleWithBackground('a',Point.mk(0,0),4.1,circleP);
  let cbottom = this.circleWithBackground('b',Point.mk(0,-wd),rd,circleP);
  let cleft = this.circleWithBackground('c',Point.mk(-wd,0),rd,circleP);
  let ctop = this.circleWithBackground('d',Point.mk(0,wd),rd,circleP);
  let cright = this.circleWithBackground('e',Point.mk(wd,0),rd,circleP);
//  this.circleToCircleShape('circcenterBig', ccenterBig,circleP);
  this.circcenterBig.fill = 'rgb(0,0,10)';

  let theLineSeg = LineSegment.mk(Point.mk(0,-80),Point.mk(0,80));
  this.generateLines({src:cbottom,srcOn:1,dst:cbottom,dstOn:1,numLines,lineP});
  //this.generateLines({src:cbottom,srcOn:1,dst:cright,dstOn:1,numLines,lineP});
  this.generateLines({src:cright,srcOn:1,dst:cright,dstOn:1,numLines:numLines,lineP:lineP});
 // this.generateLines({src:cright,srcOn:1,dst:ctop,dstOn:1,numLines:numLines,lineP:lineP});
 // lineP.stroke = 'red';
  this.generateLines({src:ctop,srcOn:1,dst:ctop,dstOn:1,numLines:numLines,lineP:lineP});
 // this.generateLines({src:ctop,srcOn:1,dst:cleft,dstOn:1,numLines:numLines,lineP:lineP});
  this.generateLines({src:cleft,srcOn:1,dst:cleft,dstOn:1,numLines:numLines,lineP:lineP});
  this.generateLines({src:ccenter,srcOn:1,dst:ccenter,dstOn:1,numLines:300,lineP:lineP});
 // this.generateLines({src:cleft,srcOn:1,dst:cbottom,dstOn:1,numLines:numLines,lineP:lineP});
  //  this.generateLines({src:ctop,srcOn:1,dst:cbottom,dstOn:1,numLines:numLines,lineP:lineP});
  //  this.generateLines({src:cleft,srcOn:1,dst:cright,dstOn:1,numLines:numLines,lineP:lineP});

}
export {rs};

      

