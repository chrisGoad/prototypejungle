import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as innerDrop} from '/generators/drop_circles_0.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_1');
let ht= 2000;
let topParams = {width:ht,height:ht,radius:100,framePadding:0.1*ht,frameStrokee:'white'}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:150}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}  

rs.generateDrop= function (p) {
  let {height:ht,radius} = this;
  debugger;
  let hht = 0.5*ht;
  //let fr = (p.y + hht)/ht;
  let d = p.length();
  if (d>=hht) {
    return;
  } 
  let crc = Circle.mk(radius);
  let crcs = crc.toShape(this.circleP);
  return {geometries:[crc],shapes:[crcs]}
}

rs.initialize = function () {
  this.initProtos();
  let {dropParams} = this;
  this.addFrame();
  let drops =  this.generateDrops(dropParams);
}

export {rs};


