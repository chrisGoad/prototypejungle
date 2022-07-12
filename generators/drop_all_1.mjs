import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_all_1');
let ht= 1000;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,frameStrokee:'white',sqdim:0.14*ht,sqoff:0.14*ht,sqfill:'rgba(30,30,60)'}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,scale:0.5,maxDrops:5000,radius:50}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'blue';
  circleP.stroke = 'white';
  circleP['stroke-width'] =0;
  let circleP2 = this.circleP2 = circlePP.instantiate();
  circleP2.fill = 'white';
  circleP2.stroke = 'white';
  circleP2['stroke-width'] =0;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'transparent';
  rectP.stroke = 'white';
  rectP['stroke-width'] = 0;
  let rectP2= this.rectP2 = rectPP.instantiate();
  rectP2.fill = 'white';
  rectP2.fill = 'transparent';
  rectP2.fill = 'white';
  rectP2.stroke = 'white';
  rectP2['stroke-width'] = 0;
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 1;; 
}

let numSquaresToDrop=100;
let numSquaresDropped=0;
rs.generateDrop= function (p) {
  debugger;
  let cSizes = [5,10];
  let rSizes = [500];
  const randomSize = (sizeArray) => {
    let ln = sizeArray.length;
    let idx = Math.floor(ln * Math.random())
    return sizeArray[idx];
  }
  let tp;
  if (numSquaresDropped < numSquaresToDrop) {
     tp  = (Math.random() < 1) ?'rect':'circle';
     if (tp === 'rect') {
       numSquaresDropped++;
     }
  } else {
    tp = 'circle';
  }
  let sz = randomSize(tp === 'rect'?rSizes:cSizes);
  let geom,shp;
  if (tp === 'rect') {
    geom = Rectangle.mk(Point.mk(-0.5*sz,-0.5*sz),Point.mk(sz,sz));
    geom.isSolid  = 1;
    shp = geom.toShape(this.rectP);
  } else {
    geom = Circle.mk(0.5*sz);
    geom.isDisk =1;
    shp = geom.toShape(tp==='scircle'?this.circleP2:this.circleP);
  }
  

  return {geometries:[geom],shapes:[shp]}
}

rs.initialize = function () {
  this.initProtos();
  let {dropParams} = this;
  this.addFrame();

  this.generateDrops(dropParams);
  //this.installCircleDrops(drops,circleP);
}

export {rs};



