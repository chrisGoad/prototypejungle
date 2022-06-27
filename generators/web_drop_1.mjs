import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addWebMethods} from '/mlib/web.mjs';	

let rs = basicP.instantiate();
addDropMethods(rs);
addWebMethods(rs);

rs.setName('web_drop_1');
let ht= 2000;
let topParams = {width:ht,height:ht,radius:100,framePadding:0.1*ht,radius:20,frameStrokee:'white'}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:150}
let  webParams = {webTries:1000,minConnectorLength:40,maxConnectorLength:180,angleMin:-10,angleMax:10};

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'transparent';
  circleP['stroke-width'] = 0;
   let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 2;
}  

rs.generateDrop= function (p) {
  let {height:ht,radius} = this;
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
  webParams.lineP = this.lineP;
  let {dropParams} = this;
  this.addFrame();
  debugger;
  this.generateDrops(dropParams);
    let points = this.dropCenters();
  this.generateWeb(Object.assign(webParams,{points}));

  
}

export {rs};


