
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
let rs = basicsP.instantiate();
addDropMethods(rs);

rs.setName('drop_channels');
let ht = 100;
let wd = ht;

let topParams = {width:wd,height:ht,framePadding:0.17*ht,segLength:5,numCircles:8};

let dropParams = {dropTries:100,maxLoops:100000,maxDrops:100000};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .15;
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'blue';
  circleP.stroke = 'white';
  circleP['stroke-width'] = 0;
}  

let whichDrops = 0;

rs.segParams = function (p,np,delta) {
  let {width:wd} = this;
  let r = Math.random();
  let fr = (p.x+0.5*wd)/wd;
  let bangle = 0.15*Math.PI*fr;
  let angle = (np === -1)?Math.PI/2:Math.floor(r*np)* (Math.PI/np)
  let length = 2;
  return {angle:delta+angle+bangle,length};
} 	


rs.generateDrop = function (p) {
  let {drops} = this;
   let p0 = Point.mk(0,0); 
  let {circleP,circles,lineP} = this;
  if (whichDrops) {
    let crc = Circle.mk(1);
    let crcs = crc.toShape(circleP,1);
    return {geometries:[crc],shapes:[crcs]};
  }
  
  let sp = this.segParams(p,2,0);
  let {angle,length} = sp;
  let seg = LineSegment.mkAngled(p0,angle,length);
  let lseg = LineSegment.mkAngled(p0,angle,length+10);
  let ln = seg.toShape(this.lineP);
  return {geometries:[lseg],shapes:[ln]};

}

rs.initialize = function () {
  this.addFrame();
  this.initProtos();
  this.generateDrops(dropParams);
  whichDrops = 1;
  let drops = this.drops;
   let dln = drops.length;
  console.log('dln',dln);
   drops.forEach((sg)=> {
      if (LineSegment.isPrototypeOf(sg)) {
        let nsg = sg.lengthen(-11);
        sg.end0 = nsg.end0;
        sg.end1 = nsg.end1;
      }
     });
    this.generateDrops(dropParams);

}

export {rs};


