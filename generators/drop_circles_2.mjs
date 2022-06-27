import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_2');
let ht= 1000;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white'}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,scale:0.5,radius:50}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}

rs.generateDrop= function (p) {
  let {height:ht} = this;
  let rd;
  let hht = 0.5*ht;
  let {x,y} = p;
  let xa = x + hht;
  let ya = y + hht;
  let hSizes = [0,3,0,5,0,9,0];
  let vSizes = [0,9,0,5,0,3,0];
  let numS = hSizes.length;
  let strh = Math.floor((numS*ya)/ht);
  let strv = Math.floor((numS*xa)/ht);
  const inStripe = (horizontal) => {
    let xory = horizontal?ya:xa;
    return Math.floor((tnumS*xory)/ht);
  }
  let vsz = vSizes[strv];
  let hsz = hSizes[strh];
  if (hsz && vsz) {
    rd = Math.random()<0.5?vsz:hsz;
  } else if (hsz) {
    rd = hsz;
  } else if (vsz) {
    rd = vsz;
  } else {
    return;
  }
  console.log('xa',xa,'ya',ya,'strh',strh,'strv',strv,'hsz',hsz,'vsz',vsz,'radius',rd);
  let crc = Circle.mk(rd);
  let crcs = crc.toShape(this.circleP);
  return {geometries:[crc],shapes:[crcs]}
}

rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams} = this;
  this.addFrame();
  let drops =  this.generateDrops(dropParams);
  //this.installCircleDrops(drops,circleP);
}

export {rs};



