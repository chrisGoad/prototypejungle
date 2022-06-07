import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/dropCircles.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_circles_5');
let ht= 1000;
//let topParams = {width:ht,height:ht,sizes:[30,10,3.33]}
//let topParams = {width:ht,height:ht,sizes:[90,30,10]}
//let topParams = {width:ht,height:ht,sizes:[45,15,5]}
let topParams = {width:ht,height:ht,sizes:[27,9,3],framePadding:0.1*ht,frameStrokee:'white'}
Object.assign(rs,topParams);

let dropParams = {dropTries:150}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'white';
  circleP['stroke-width'] = 0;
}  



rs.radiusGenerator= function (p) {
  let {height:ht,sizes} = this;
  debugger;
  let hht = 0.5*ht;
  //let fr = (p.y + hht)/ht;
  let d = p.length();
  if (d>=hht) {
    return -1;
  }
  return Math.random() <0.4?40:10;
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
     if (mixedRing) {
       let r = Math.random();
       let rd = (r > 0.5)?sizes[szi]:sizes[szi+1];
       console.log('mixed ring','fr',fr,'i',i,'szi',szi,'rd',rd);
       return rd;
      }
      
      let rs = sizes[szi];
      console.log('unmixed ring','fr',fr,'i',i,'szi',szi,'rs',rs);
      return rs;
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
 
 

 
rs.fillGenerator= function (p) {
  debugger;
  return 'white';
 }


rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  let shapes = this.set('shapes',arrayShape.mk());
  let drop =  this.generateCircleDrop(dropParams);
  let {points,radii} = drop;
  let ln  = points.length;
  for (let i=0;i<ln;i++) {
    let p = points[i];
    let fill = this.fillGenerator(p);
    
    let crc = this.circleP.instantiate();
    let dim = radii[i];
    if (dim === 40) { 
      crc.fill = 'blue';
    }
    crc.dimension = dim;
    shapes.push(crc);
    crc.moveto(p);
   }
}

export {rs};


