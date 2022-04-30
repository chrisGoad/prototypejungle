
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addLinesMethods} from '/mlib/lines.mjs';	

let rs = basicP.instantiate();
addLinesMethods(rs);

rs.setName('lines_cobweb');
let ht= 200;
let topParams = {width:1.5*ht,height:ht,numLines:1000,lineColor:'white'};
Object.assign(rs,topParams);

	
rs.initProtos = function () {
  this.set('lineP',linePP.instantiate().show());
  this.lineP.stroke = this.lineColor;
  this.lineP['stroke-width'] = .07; 	
}  

rs.initialize = function () {
  debugger;
  this.initProtos();
  
  this.addFrame();
  this.addRectangle(this.backFill);
 let rect = this.canvasToRectangle();
  this.generateLines({src:rect,srcOn:1,dst:rect,dstOn:1,numLines:this.numLines,lineP:this.lineP});
}

export {rs}

