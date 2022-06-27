import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/newDrop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_9');
let ht= 1000;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,radius:20}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:150}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
   let lineP = this.lineP = linePP.instantiate();
  lineP.stroke = 'white';
  lineP['stroke-width'] = 2;
}

rs.generateDrop= function (p) {
  let {height:ht,circleP,lineP,radius} = this;
  let rd;
  let rc0= Point.mk(-300,0);
  let rc1= Point.mk(300,0);
  let d = p.length();
  if (d>500) {
   return;
  }
  let fc = 0.01;
  let mn = 2;
  const radius_of = (rn) => (rn%2 === 0)?mn+(rn+2)*fc*((ht-200*rn)/2-p.x):mn+(rn+2)*fc*(p.x + (ht-200*rn)/2);
  let irn = Math.floor(d/100); // ring number with 0 as innermost
  let orn = 4 - irn;  // ring number with 0 as outermost
  rd = radius_of(orn);
  rd = Math.max(4,rd);
  rd = 5+Math.random() * radius;
  let crc = Circle.mk(Point.mk(0,0),rd);
  let crcs = crc.toShape(circleP,0.5);
  let drop = {geometries:[crc],shapes:[crcs]}
  return drop;
}

rs.initialize = function () {
  this.initProtos();
  let {circleP,lineP,dropParams,height:ht,radius} = this;
  let hht = 0.5*ht;
  this.addFrame();
  let drops = this.drops =[];
  let shapes = this.set('shapes',arrayShape.mk());
  let ns = 5;
  let intv = ht/5;
  for (let i=0;i<ns;i++) {
    let sght = i*intv - hht;
    let sg = LineSegment.mk(Point.mk(-hht,sght),Point.mk(hht,sght))
    let sg2 = LineSegment.mk(Point.mk(-hht,sght+0.2*intv),Point.mk(hht,sght))
    drops.push(sg);
    drops.push(sg2);
    let sgs = sg.toShape(lineP,circleP);
    let sgs2 = sg2.toShape(lineP);
    shapes.push(sgs);
    shapes.push(sgs2);
  }
  let crc = Circle.mk(Point.mk(0.5*ht,-5),radius);
  let crcs = crc.toShape(circleP);
  //let sgs = this.geom2shape(sg,lineP,circleP,1);
  shapes.push(crcs);
  //shapes.push(sgs);
  debugger;
  let gi = geometriesIntersect([crc],drops)
  this.generateDrops(dropParams);
}

export {rs};



