
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addQuadMethods} from '/mlib/quadTree.mjs';	

let rs = basicP.instantiate();
addQuadMethods(rs);
rs.setName('quad_3',2);

let wd = 100;
let topParams = {width:wd,height:wd,framePadding:0.1*wd}
Object.assign(rs,topParams);
let quadParams = {levels:7,chance:0.8,alwaysSplitBefore:3};

rs.initProtos = function () {
  this.circleP =  circlePP.instantiate();
  this.circleP.stroke = 'white';
  this.circleP['stroke-width'] =.15;
} 

rs.computeFill = function (depth) { 
   const shade = ()=> Math.floor(255*Math.random());
   let v = shade();
   let fill = `rgb(${v},0,${v})`;
   return fill;
}


 rs.displayCell  = function (qd) {
   let {shapes,levels,circleP}= this;
   let rect = qd.rectangle;
   let c = rect.center();
   let {extent} = rect;
   let {x:ex,y:ey} = extent;
   let crc = Circle.mk(0.4*ex);
   let shape = crc.toShape(circleP);
   //shape.dimension = 0.7*ex;
   shape.fill = this.computeFill();
   this.shapes.push(shape);
   shape.moveto(c);
 //  shape.update();
 }   

rs.initialize = function () {
  let {width:wd,height:ht} = this;
  this.addFrame();
  this.initProtos();
  let r = Rectangle.mk(Point.mk(-0.5*wd,-0.5*ht),Point.mk(wd,ht));
  let qd = {rectangle:r};
  debugger;
  this.extendQuadNLevels(qd,quadParams);
  this.displayQuad(qd);
}	

export {rs};

      

