import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/newDrop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('embeded_circles');
let ht= 1000;
let topParams = {width:ht,height:ht,radius_ratio:0.8,numCircles:10}
Object.assign(rs,topParams);

let dropParams = {dropTries:150,radius:60,maxDrops:10000}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'transparent';
  circleP['stroke-width'] = 3;
  circleP.stroke = "black";
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 3; 
}  


rs.segParams = function (np) {
  let r = Math.random();
 // let np = 4;
  let angle = (np === -1)?Math.PI/2:Math.floor(r*np)* (Math.PI/np)
  let length = 30;// + Math.floor(r*np)*4;
  return {angle,length};
} 	
rs.nextCircle = function (crc) {
  let {center,radius} = crc;
  let nr = radius*(this.radius_ratio);
  let maxCenterDist = radius - nr;
  let dist = 0.5*Math.random() * maxCenterDist;
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
     cc  = this.nextCircle(cc);
     shapes.push(cc);
  }
  return shapes;
}

rs.whichRing = function (circles,p) {
  debugger;
  let {numCircles} = this;
  for (let i=0;i<numCircles;i++) {
    let crc = circles[i];
    let cc = crc.contains(p);
    if (i === numCircles-1) {
      return i;
    }
    let ncrc = circles[i+1];
    let ncc = ncrc.contains(p)
    if (!ncrc) {
      debugger;
    }
    
    if (cc && !ncc) {
      return i;
    }
   }
}
rs.generateDrop = function (p) {
   debugger;
   let p0 = Point.mk(0,0);
   if (p.length() > 0.5*this.height) {
     return;
   }
   let wr = this.whichRing(this.circles,p);
   let sp = this.segParams(2);
   let {angle,length} = sp
   let crc = Circle.mk(10);
   let seg = LineSegment.mkAngled(p0,angle,length);
   let lseg = LineSegment.mkAngled(p0,angle,length+10);
   let ln = this.genLine(seg,this.lineP);
   let crcs = this.genCircle(crc,this.circleP,0.5);
   crcs.fill = 'white';
   crcs.stroke = 'blue';
  if (wr%2) {
    return {geometries:[crc],shapes:[crcs]};
  } else {
   return {geometries:[lseg],shapes:[ln]};
  }
}

rs.initialize = function () {
  this.initProtos();
  let {numCircles,circleP} = this;
  let shapes = this.set('shapes',arrayShape.mk());
  debugger;
  let circles = this.allCircles();
  let drops = this.drops = [];
  this.circles = circles;
  circles.forEach((c) => drops.push(c));
  circles.forEach((c) => {
    let circs = this.genCircle(c,circleP);
    shapes.push(circs);
  });
  this.generateDrops(dropParams);
}

export {rs};


