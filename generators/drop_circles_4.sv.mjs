import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/dropCircles.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_4_2');
let ht= 1000;
//let topParams = {width:ht,height:ht,sizes:[30,10,3.33]}
//let topParams = {width:ht,height:ht,sizes:[90,30,10]}
//let topParams = {width:ht,height:ht,sizes:[45,15,5]}
let topParams = {width:ht,height:ht,sizes:[27,9,3],framePadding:0.1*ht,frameStrokee:'white'}
Object.assign(rs,topParams);

let dropParams = {dropTries:150,scale:0.5}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}  



rs.generateDrop= function (p) {
  let {height:ht,sizes} = this;
  let hht = 0.5*ht;
  //let fr = (p.y + hht)/ht;
  let d = p.length();
  if (d>=hht) {
    return;
  }
 // let fr = d/(hht * Math.SQRT2);
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
      return {radius:rd}
    }
    cT = cT+inc;
    if (mixedRing) {
      szi++
    }
  }
/*   
  if (fr<0.33) {
    return 10;
  }
  if (fr >0.666) {
    return 3;
  }
 // let fr = Math.abs(p.y)/hht;
  let r = Math.random();
  let rd = (r > 0.5)?10:3;
  return rd;*/
 }
 
 

 


rs.initialize = function () {
  this.stdInitialize(dropParams);
  return;
  this.initProtos();
  this.addFrame();
  let shapes = this.set('shapes',arrayShape.mk());
  let drops =  this.generateCircleDrops(dropParams);
  debugger;
  let ln  = drops.length;
  for (let i=0;i<ln;i++) {
    let {point,radius} = drops[i];
    //let fill = this.fillGenerator(p);
    let crc = this.circleP.instantiate();
    let dim = 1.0*radius;
    crc.dimension = dim;
    shapes.push(crc);
    crc.moveto(point);
   }
}

export {rs};


