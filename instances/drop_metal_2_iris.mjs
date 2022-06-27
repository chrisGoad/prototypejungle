
import {rs} from '/generators/drop_metal_2.mjs';
rs.setName('drop_metal_2_iris');
rs.circular = 1;
const fractionIn = function (p,wd) {
  let d = p.length();
  let fr = d/(0.5*Math.SQRT2*wd);
  return fr;
 }
 
rs.lengthFunction = function (p) {
 // return 80;
  let fr =  fractionIn(p,this.width);
  if (fr <0.2) {
    return -1;
  }
  console.log(fr);
  return fr*80+20;
 }

rs.directionFunction = function (p) {
  let a = Math.atan2(p.y,p.x);
  return a;
}
  
  
rs.strokeFunction = function (p) {
  //return 'red';
  let fr =  fractionIn(p,this.width);
  let v = Math.floor(fr * 255);
  let clr = `rgb(${v},${v},255)`;
  return  clr;
}

export {rs};


