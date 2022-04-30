
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as bendP} from '/generators/grid_bend.mjs';
import {rs as fanP} from '/generators/grid_fan.mjs';

let rs = basicP.instantiate();
rs.setName('grid_enigma');

let nr = 140;
let wd = 1000;
let topWd = 2000;
let partParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:10,delta:(wd*0.8)/nr,backFill:'blue',randomizeOrder:1,fromLeft:1,up:0};
let topParams = {width:topWd,height:topWd,framePadding:0.15*topWd};
Object.assign(rs,topParams);

rs.addGrid = function (nm,fromLeft,turnUp) {
  let g = bendP.instantiate();
  Object.assign(g,partParams);
  g.backFill = 'black';
  g.fromLeft = fromLeft;
  g.turnUp = turnUp;
  this.set(nm,g);
  g.initialize();
  return g;
}
     
rs.initProtos = function () {	
  let rectP = this.rectP = rectPP.instantiate();
  rectP['stroke-width'] = 0;
  let wd = 200;
  rectP.width = wd;
  rectP.height = wd;
  rectP.fill = 'blue';
}   


rs.addFan = function (nm,fromLeft,up) {
  debugger;
  let f = fanP.instantiate();
  Object.assign(f,partParams);
  f.fromLeft = fromLeft;
  f.up = up;
  f.height = 0.78*f.width;
  f.width = 0.78*f.width;
  f . backFill = 'blue';
  this.set(nm,f);
  f.initialize();
  return f;
  }


rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  let fwd  = partParams.width;
  let mv = 0.4*fwd;
  Object.assign(this,{'width':2.0*fwd,'height':2.0*fwd,backFill:'rgb(255,255,255)'});
  let g00 = this.addGrid('g00',0,0);
  g00.moveto(Point.mk(-mv,-mv));
  let g01 = this.addGrid('g01',1,1);
  g01.moveto(Point.mk(mv,mv));
  let f01 = this.addFan('f01',0,1);
  f01.moveto(Point.mk(1.24*mv,-1.24*mv));
  let f10 = this.addFan('f10',1,0);
  f10.moveto(Point.mk(-1.24*mv,1.24*mv));
  this.set('rect',this.rectP.instantiate().show());
}

export {rs};


