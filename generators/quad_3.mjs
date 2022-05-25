
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addQuadMethods} from '/mlib/quadTree.mjs';	

let rs = basicP.instantiate();
addQuadMethods(rs);
rs.setName('quad_3',2);

let wd = 100;
let topParams = {width:wd,height:wd,levels:7,chance:0.8,framePadding:0.1*wd}
Object.assign(rs,topParams);

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

rs.chooseCircle = function () {
  return 1;
}

rs.initialize = function () {
  let {width:wd,height:ht} = this;
  this.addFrame();
  this.initProtos();
  let r = Rectangle.mk(Point.mk(-0.5*wd,-0.5*ht),Point.mk(wd,ht));
  let qd = {rectangle:r};
  this.extendQuadNLevels(qd,this);
  this.displayQuad(qd);
}	

export {rs};

      

