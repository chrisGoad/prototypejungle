
import {rs as polygonPP} from '/shape/polygon.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addQuadMethods} from '/mlib/quadTree.mjs';	

let rs = basicP.instantiate();
addQuadMethods(rs);
rs.setName('quad_3',2);

let wd = 100;
let topParams = {width:wd,height:wd,levels:7,chance:0.8,framePadding:0.1*wd,backFill:'red'}
Object.assign(rs,topParams);

rs.initProtos = function () {
  this.rectP =  rectPP.instantiate();
  this.rectP.stroke = 'blue';
  this.rectP.stroke = 'white';
 this.rectP.stroke = 'yellow';
  this.rectP.fill = 'transparent';
   this.circleP =  circlePP.instantiate();
  this.circleP.stroke = 'blue';
  this.circleP.stroke = 'white';
    this.circleP['stroke-width'] = .2; 	
    this.circleP['stroke-width'] =.15;

 //this.rectP.stroke = 'yellow';
  this.rectP.fill = 'transparent';
  this.rectP['stroke-width'] = .1; 	
  this.polygonP =  polygonPP.instantiate();
  this.polygonP.stroke = 'red';
  this.polygonP.stroke = 'white'
    this.polygonP['stroke-width'] = .1; 	
;
} 

rs.computeFill = function (depth) { 
   const shade = ()=> Math.floor(255*Math.random());
   let v = shade();
   let fill = `rgb(${v},0,${v})`;
   return fill;
}

rs.chooseCircle = function (r,depth) {
  debugger;
  return 1;
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
  
  //this.displayQuad(qd,this.rectP);
  //this.displayQuad(qd,this.polygonP);
  this.displayQuad(qd);
  console.log(this.shapes.length,' squares ');
}	

export {rs};

      

