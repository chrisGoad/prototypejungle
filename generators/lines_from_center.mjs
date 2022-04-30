
import {rs as linePP} from '/line/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addLinesMethods} from '/mlib/lines.mjs';	

let rs = basicP.instantiate();
addLinesMethods(rs);

rs.setName('lines_from_center');
let wd = 200;
let topParams = {width:wd,height:wd,numLines:5000,lineColor:'white'};
Object.assign(rs,topParams);

rs.mkExcludeSegFunction = function () {
  let wd = this.width;
  return  (sg) => {
    let md = sg.middle();
    let ln = md.length();
    return ln > 0.2*wd;
    return ln > 40;
  }
}
		
	
rs.initProtos = function () {
  this.set('lineP',linePP.instantiate().show());
  this.lineP.stroke = this.lineColor;
  this.lineP['stroke-width'] = .07; 	
}  

rs.initialize = function () {
  this.initProtos();
  this.addRectangle(this.backFill);
  let rect = this.canvasToRectangle();
  this.generateLines({src:rect,srcOn:1,dst:rect,dstOn:1,numLines:this.numLines,lineP:this.lineP,excludeSegFunction:this.mkExcludeSegFunction()});
}

export {rs}

