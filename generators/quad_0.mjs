

import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addQuadMethods} from '/mlib/quadTree.mjs';	

let rs = basicP.instantiate();
addQuadMethods(rs);
rs.setName('quad_0',7);

let wd = 100;
let topParams = {width:wd,height:wd,levels:7,chance:0.8,framePadding:0.1*wd,backFill:'red'}
Object.assign(rs,topParams);

rs.initProtos = function () {
  this.rectP =  rectPP.instantiate();
  this.rectP.stroke = 'blue';
  this.rectP.stroke = 'white';
 // this.rectP.stroke = 'black';
  this.rectP.fill = 'transparent';
  this.rectP['stroke-width'] = .1; 	
}  

rs.initialize = function () {
  let {width:wd,height:ht} = this;
  this.addFrame();
    //  this.addRectangle(this.backFill);

  this.initProtos();
  let r = Rectangle.mk(Point.mk(-0.5*wd,-0.5*ht),Point.mk(wd,ht));
  debugger;
  let qd = {rectangle:r};
  this.extendQuadNLevels(qd,this);
  
  this.displayQuad(qd,this.rectP);
  console.log(this.shapes.length,' squares ');
}	

export {rs};

      

