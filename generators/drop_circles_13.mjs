import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as innerDrop} from '/generators/drop_circles_0.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

let ht = 2000;
let dropParams = {dropTries:150}
let topParams = {width:ht,height:ht,radius:20,framePadding:0.1*ht,numCircles:7}
Object.assign(rs,topParams);

rs.setName('drop_circles_13');


rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'blue';
  circleP.stroke = 'white';
  circleP['stroke-width'] = 1; 
  let circleP2 = this.circleP2 = circlePP.instantiate();
  circleP2.fill = 'white';
  circleP2['stroke-width'] = 0;
}  

rs.initialDropp= function () {
  this.circles = [];
  let {circleP,numCircles} = this;
  debugger;
  let acrc =[];
  let acrcs =[];
  const circleRay = (dir) => {
    let vx = Math.cos(dir);
    let vy = Math.sin(dir);
    let vec = Point.mk(vx,vy);
    let fc = 0.7;
    let gapfac = 0.4;
    let cr = 0.051*ht;
    let d = 0;
    let ps = Point.mk(0,0);
    for (let i = 0;i<numCircles;i++) {
      let crc = Circle.mk(ps,cr);
      crc.isDisk = 0;
      acrc.push(crc);
      let crcs = crc.toShape(circleP);
      acrcs.push(crcs);     
      let nr = fc*cr;
      d = d + cr + nr + gapfac*cr;
      cr = nr;
      ps = vec.times(d); 
    }
  }
  circleRay(0);
  circleRay(Math.PI/2);
  circleRay(Math.PI);
  circleRay(1.5* Math.PI);
 // this.circles =[... acrc];
  return {geometries:acrc,shapes:acrcs};  
}


rs.generateDrop= function (p) {
  let {height:ht,radius,circleP2} = this;
  debugger;
  let hht = 0.5*ht;
  let d = p.length();
  let fr = d/hht;
  let v = Math.floor(255*(1-fr));
  let clr = `rgb(${v},${v},255)`;

  if (d>=hht) {
    return;
  } 
  let crc = Circle.mk(radius);
  let crcs = crc.toShape(circleP2,1-fr);
  crcs . fill = clr;
  return {geometries:[crc],shapes:[crcs]}
}

rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  this.generateDrops(dropParams);
}

export {rs};


