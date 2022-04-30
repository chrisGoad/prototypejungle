
  
import {rs as linePP} from '/shape/wavyLine.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addLinesMethods} from '/mlib/lines.mjs';	

let item = basicP.instantiate();
addLinesMethods(item);
let topParams = {left:0,radius:100,numLines:2000};

Object.assign(item,topParams);

item.setName('lines_bugeye');

item.initProtos = function () {
  this.lineP = linePP.instantiate().show();
  let left = this.left;
  this.lineP.stroke = left?'rgb(230,230,230)':'rgb(232, 159, 39)';
  this.lineP['stroke-width'] = .1; 	
}  


 item.segmentToLineFunction = function (lsg,lineP) {
  let {end0,end1} = lsg;
  let {left,height} = this;
  let e0x = end0.x;
  let e1x = end1.x;
  let tmp;
  if ((left &&( e0x < e1x)) || (!left && (e0x >= e1x))) {
    let tmp = end0;
    end0 = end1;
    end1 = tmp;
  }
  end0.y = end1.y;
  let e0y = end0.y;
  let e1y = end1.y;
  let emy  = 0.5*(e0y+e1y);
  let miny = -0.5*height;
  let line = lineP.instantiate().show();
  line.sweep = left?((emy<0)?1:0):((emy >= 0)?1:0);
  line.setEnds(end0,end1);
  return line;
}
item.excludeLineFunction = function (sg) {
    let md = sg.middle();
    let ln = md.length();
    return(ln > 40);
  }

item.initialize = function () {
  this.initProtos();
  let circle = Circle.mk(Point.mk(0,0),this.radius);
  this.generateLines({src:circle,srcOn:1,dst:circle,dstOn:1,lineP:this.lineP,numLines:this.numLines});
 
}	
export {item as rs};


      

