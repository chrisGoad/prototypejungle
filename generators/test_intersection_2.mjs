import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';

let rs = basicP.instantiate();

rs.setName('drop_circles_0');
let ht= 200;
let topParams = {width:ht,height:ht,framePadding:0.1*ht}
Object.assign(rs,topParams);


rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.stroke = 'white';
  circleP['stroke-width'] = 0.1;
  let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = 0.1;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'white';
  rectP.stroke = 'white';
  rectP.fill = 'transparent';
  rectP['stroke-width'] = 0.1;
}

rs.initialize = function () {
  this.initProtos();
  debugger;
//  let sg = LineSegment.mk(Point.mk(-20,-20),Point.mk(20,20));
//  let sg = LineSegment.mk(Point.mk(-2,14),Point.mk(2,15));
  //let crc = Circle.mk(Point.mk(14,0),2); //intersects
 // let crc = Circle.mk(Point.mk(0,4),15); //intersects
 // geom.moveBy(rect,Point.mk(5,0));
  //let crc = Circle.mk(Point.mk(0,16),10);
  // geom.moveBy(rect,Point.mk(5,0));
  //let crc = Circle.mk(Point.mk(0,16),10);
   // let ln = sg.toShape(this.lineP);

  
  let crc = Circle.mk(Point.mk(0,-6),5); //intersects
  let rect = Rectangle.mk(Point.mk(-10,-10),Point.mk(20,20));
 
  let rects = rect.toShape(this.rectP);
  let crcs = crc.toShape(this.circleP);	
  //crcs.moveto(Point.mk(-20,-20));

  let shapes = this.set('shapes',ArrayNode.mk());
  //shapes.push(ln);
  shapes.push(crcs);
  shapes.push(rects);
  debugger;
 // let ii = sg.intersectsCircle(crc);
  let ii = crc.intersects(rect);
  let jj = rect.intersects(crc);
  console.log('ii',ii,'jj',jj);
}

export {rs};



