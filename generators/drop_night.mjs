import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_night');
let ht= 1000;
let topParams = {width:1.5*ht,height:ht}
Object.assign(rs,topParams);

let dropParams = {dropTries:150,scale:0.5}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'black';
  circleP['stroke-width'] = 0;
}  

rs.generateDrop = function (p) {
  let ht = this.height;
  let cfr = 0.05;
  let seaht = cfr*ht;
  let ay = Math.abs(p.y);
  if (ay < seaht) {
    return;
  }
  let theta = (Math.PI/4)*(ay - seaht)/(ht - seaht);
  let sint = Math.sin(theta);
  if (sint <= 0) {
    return;
  }
  let dist = 1/sint;
  let rd = 100/dist;
  let fill =  (p.y<0)?'white':'black';
  let dim = (p.y<0)?Math.min(4,rd):rd;
  let crc = Circle.mk(rd);
  let crcs = this.circleP.instantiate();
  crcs.radius = 0.5*dim;
  crcs.fill = fill;
  return {geometries:[crc],shapes:[crcs]};
}
 
rs.initialize = function () {
  this.initProtos();
  let wd = 1.5*ht;
  let hwd = 0.5*wd;
  let hht = 0.5*ht;
  let qwd = 0.5*hwd;
  let qht = 0.5*hht;
  this.addRectangle({width:wd,height:hht,position:Point.mk(0,-qht),stroke_width:0,fill:'black'});
  this.addRectangle({width:wd,height:hht,position:Point.mk(0,qht),stroke_width:0,fill:'white'});
  let cfr =0.09;
  this.addRectangle({width:wd,height:cfr*ht,stroke_width:0,fill:'rgb(10,10,80)'});
  this.generateDrops(dropParams);
}

export {rs};


