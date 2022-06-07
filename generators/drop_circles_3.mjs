import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/circleDrops.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_3');
let ht= 1000;
let topParams = {width:ht,height:ht,framePadding:0.1*ht}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,scale:0.5,radius:50}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}

rs.generateCircleDrop= function (p) {
  let {height:ht} = this;
  let rd;
  let rc0= Point.mk(-300,0);
  let rc1= Point.mk(300,0);
  let d = p.length();
  if (d>500) {
    return;
  }
  let fc = 0.01;
  let mn = 2;
  const radius_of = (rn) => (rn%2 === 0)?mn+(rn+2)*fc*((ht-200*rn)/2-p.x):mn+(rn+2)*fc*(p.x + (ht-200*rn)/2);
  let irn = Math.floor(d/100); // ring number with 0 as innermost
  let orn = 4 - irn;  // ring number with 0 as outermost
  rd = radius_of(orn);
  rd = Math.max(4,rd);
  return {radius:rd};
}

rs.initialize = function () {
  this.initProtos();
  let {circleP,dropParams} = this;
  this.addFrame();
  let drops =  this.generateCircleDrops(dropParams);
  this.installCircleDrops(drops,circleP);
}

export {rs};



