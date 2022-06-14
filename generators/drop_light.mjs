import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_light');
let ht= 6000;
let topParams = {width:ht,height:ht}
Object.assign(rs,topParams);

let dropParams = {dropTries:150}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'black';
  circleP['stroke-width'] = 0;
}  

rs.generateDrop= function (p) {
  let ln = p.length()-400;
  if (ln<=0) {
    return;
  }
  let crc = Circle.mk(0.01*ln);
  let crcs = this.genCircle(crc,this.circleP);
  return {geometries:[crc],shapes:[crcs]}; 
 }

rs.initialize = function () {
  debugger;
  this.addRectangle({width:ht,height:ht,stroke_width:0,fill:'white'});
  this.initProtos();
  this.addFrame();
  let drops =  this.generateDrops(dropParams);
}

export {rs};


