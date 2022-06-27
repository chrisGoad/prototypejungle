
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addQuadMethods} from '/mlib/quadTree.mjs';	
import {rs as addDropMethods} from '/mlib/drop.mjs';	

let rs = basicP.instantiate();
addQuadMethods(rs);
addDropMethods(rs);
rs.setName('quad_drop');

let wd = 1000;
let topParams = {width:wd,height:wd,framePadding:0.1*wd}
Object.assign(rs,topParams);

let quadParams = {levels:6,chance:0.8,alwaysSplitBefore:3}

rs.dropParams = {dropTries:3500,maxDrops:1000000}
rs.dropParams = {dropTries:35,maxDrops:10000}

rs.initProtos = function () {
  this.circleP =  circlePP.instantiate();
  this.circleP.stroke = 'white';
  this.circleP.fill = 'white';
  this.circleP.fill = 'transparent';
  this.circleP['stroke-width'] = 0; 
  this.rectP =  rectPP.instantiate();
  this.rectP.stroke = 'white';
  this.rectP.fill = 'gray';
  this.rectP['stroke-width'] = .15;
   this.lineP =  linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP.fill = 'transparent';
  this.lineP['stroke-width'] =1;//.15;
} 


const URish = function (where) {
 let ln = where.length;
 if (ln===0) {
  return 0;
 }
 let lst = where[ln-1];
 return lst ==='UR';
}
rs.displayCell = function (qd,depth) {
  let {shapes,cells,rectP} = this;    
  let urish = URish(qd.where);
  if (urish) {
    let rect = qd.rectangle;
    let rs = rect.toShape(rectP,0.8);
    shapes.push(rs);
  }
}

rs.splitHere = function (qd,params) {
  debugger;
  let {levels} = params;
  let {where} = qd;

  let d = where.length;
  return (d<=levels) && !URish(where); 
}
rs.showQuad = function() {
  let {width:wd,height:ht} = this;
  this.cells = [];
  this.ishapes = [];
  let r = Rectangle.mk(Point.mk(-0.5*wd,-0.5*ht),Point.mk(wd,ht));
  let qd = {rectangle:r};
  this.extendQuadNLevels(qd,quadParams);
    this.displayQuad(qd);
  return;
  debugger;
  let geoms = this.cells.map((qd) => {
    let r = qd.rectangle;
    let d = qd.where.length;
    let sr = r.scaleCentered(0.8);
    qd.scaledRectangle = sr;
    return sr;
  });
  this.igeoms = [...geoms];
  return {geometries:geoms,shapes:this.ishapes};
}

rs.initialize = function () {
  let {width:wd,height:ht,dropParams} = this;
  this.addFrame();
  this.initProtos();
  this.set('shapes',arrayShape.mk());
  debugger;
    
  this.showQuad();
}	

export {rs};

      

