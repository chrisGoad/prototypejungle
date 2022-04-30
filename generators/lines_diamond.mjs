

import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addLinesMethods} from '/mlib/lines.mjs';	

let rs = basicP.instantiate();
addLinesMethods(rs);
rs.setName('lines_diamond');
let wd = 14.14;
let ht = wd;
let topParams = {width:wd,height:ht,numLines:1000,frameFilll:'black',framePadding:2*wd,frameStroke:'rgb(220,220,220)'}
Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'black';
  //this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .015; 	
}  

rs.initialize = function () {
  this.setBackgroundColor('white');
  debugger;
  this.initProtos();
    this.addFrame();

  let {numLines,lineP} = this;
  let rd = 10;
  let ccenter = Circle.mk(Point.mk(0,0),4.1);
  let cbottom = Circle.mk(Point.mk(0,-wd),rd);
  let cleft = Circle.mk(Point.mk(-wd,0),rd);
  let ctop = Circle.mk(Point.mk(0,wd),rd);
  let cright = Circle.mk(Point.mk(wd,0),rd);
  let theLineSeg = LineSegment.mk(Point.mk(0,-80),Point.mk(0,80));
  this.generateLines({src:cbottom,srcOn:1,dst:cbottom,dstOn:1,numLines,lineP});
  //this.generateLines({src:cbottom,srcOn:1,dst:cright,dstOn:1,numLines,lineP});
  this.generateLines({src:cright,srcOn:1,dst:cright,dstOn:1,numLines:numLines,lineP:lineP});
 // this.generateLines({src:cright,srcOn:1,dst:ctop,dstOn:1,numLines:numLines,lineP:lineP});
 // lineP.stroke = 'red';
  this.generateLines({src:ctop,srcOn:1,dst:ctop,dstOn:1,numLines:numLines,lineP:lineP});
 // this.generateLines({src:ctop,srcOn:1,dst:cleft,dstOn:1,numLines:numLines,lineP:lineP});
  this.generateLines({src:cleft,srcOn:1,dst:cleft,dstOn:1,numLines:numLines,lineP:lineP});
  this.generateLines({src:ccenter,srcOn:1,dst:ccenter,dstOn:1,numLines:numLines,lineP:lineP});
 // this.generateLines({src:cleft,srcOn:1,dst:cbottom,dstOn:1,numLines:numLines,lineP:lineP});
  //  this.generateLines({src:ctop,srcOn:1,dst:cbottom,dstOn:1,numLines:numLines,lineP:lineP});
  //  this.generateLines({src:cleft,srcOn:1,dst:cright,dstOn:1,numLines:numLines,lineP:lineP});

}
export {rs};

      

