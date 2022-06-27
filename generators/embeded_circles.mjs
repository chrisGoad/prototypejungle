import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';

let rs = basicP.instantiate();

rs.setName('embeded_circles');
let ht= 1000;
let topParams = {width:ht,height:ht,radius_ratio:0.8numCirles:5}
Object.assign(rs,topParams);

let dropParams = {dropTries:150,radius:60,maxDrops:1000}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}  

rs.nextCircle = function (crc) {
  let {center,radius} = crc;
  let nr = radius*(this.radius_ratio);
  let maxCenterDist = radius - nr;
  let dist = Math.random() * maxCenterDist;
  let angle = Math.random()*Math.PI*2;
  let vec = Point.mk(Math.cos(angle),Math.sin(angle));
  let cvec = vec.times(dist);
  let newCenter = center.plus(cvec);
  let rs = Circle.mk(newCenter,nr);
  return rs;
}
  
rs.allCircles= function() {
  let {numCircles} = this;
  let shapes = [];
  let cc = Circle.mk(ht/2);
  shapes.push(cc);
  for (let i=0;i<numCircles;i++) {
     cc  = nextCircle(cc);
     shapes.push(cc);
  }
  return shapes;
}
    
    
rs.initialize = function () {
  let {numCircles,circleP} = this;
  this.initProtos();
  let shapes = this.set('shapes',arrayShape.mk());
  let circles = this.allCircles();
  circles.forEach((c) => {
    let circs = c.toShape(circleP);
    shapes.push(circs);
  });
}

export {rs};


