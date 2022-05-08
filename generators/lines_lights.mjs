

import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addLinesMethods} from '/mlib/lines.mjs';	

let rs = basicP.instantiate();
addLinesMethods(rs);
rs.setName('lines_lights');
let wd = 130;
let ht = 1.5*wd;
let topParams = {width:wd,height:ht,numLines:3000,framePadding:0.1*wd}
Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .015; 	
}  

rs.initialize = function () {
  let {numLines,lineP} = this;
  this.addFrame();
  this.initProtos();
  let theLineSeg = LineSegment.mk(Point.mk(0,-80),Point.mk(0,80));
  this.generateLines({src:Circle.mk(Point.mk(-50,40),5),dst:theLineSeg});
  this.generateLines({src:Circle.mk(Point.mk(-50,-40),5),dst:theLineSeg});
  this.generateLines({src:Circle.mk(Point.mk(50,0),10),srcOn:1,dst:theLineSeg});
}	

export {rs};

      

