import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_0');
let ht= 1000;
let topParams = {width:ht,height:ht,framePadding:0.1*ht}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,scale:0.5,radius:50,sizes:[27,9,3]}

rs.setDimension = function (dim) {
  this.width = dim;
  this.height = dim;
}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}

rs.generateDrop= function (p) {
  let {height:ht,dropParams,circleP} = this;
  let {sizes} = dropParams;
  let hht = 0.5*ht;
  let d = p.length();
  if (d>=hht) {
    return;
  }
  let fr = d/hht;
  let ln =sizes.length;
  let numRings = 2*ln - 1;
  let inc = 1/numRings;
  let cT = 0; 
  let szi = 0;
  for (let i=0;i<numRings;i++) {
    let inRing = (cT<=fr) && (fr <= (cT+inc));
    let mixedRing = i%2;
    if (inRing) {
      let rd;    
      if (mixedRing) {
       let r = Math.random();
       rd = (r > 0.5)?sizes[szi]:sizes[szi+1];       
      } else {
        rd = sizes[szi];
      }
      console.log('ring','fr',fr,'i',i,'szi',szi,'rd',rd);
      let crc = Circle.mk(rd);
      let crcs = this.genCircle(crc,circleP,0.5);
      return {geometries:[crc],shapes:[crcs]};
    }
    cT = cT+inc;
    if (mixedRing) {
      szi++
    }
  }
}

rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams} = this;
  this.addFrame();
  let drops =  this.generateDrops(dropParams);
  //this.installCircleDrops(drops,circleP);
}


export {rs};



