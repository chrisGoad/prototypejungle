import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
let rs = basicsP.instantiate();

rs.setName('example1');

rs.width = 140;
rs.height = 60;
rs.frameStroke = 'white';
rs.framePadding = 1;

rs.initProtos = function () {
  let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'red';
  rectP.stroke = 'yellow';
  rectP['stroke-width'] = 1;
  rectP.width = 40;
  rectP.height = 20;
}  

rs.initialize = function () {
  debugger;
  this.initProtos();
  let {rectP} = this;
  let rect1 = rectP.instantiate();
  let rect2 = rectP.instantiate();
  rect2.fill = 'blue';
  rect2.height = 40;
  this.set('rect1',rect1);
  this.set('rect2',rect2);
  rect1.moveto(Point.mk(-40,0));
  rect2.moveto(Point.mk(40,0));
  this.addFrame();
 }

export {rs};