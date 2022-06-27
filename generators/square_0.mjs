
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs} from '/generators/basics.mjs';

//addRandomMethods(rs);
//addSegsetMethods(rs);

rs.setName('square_0');
let ht = 100;
let wd = ht;

let topParams = {width:wd,height:ht,framePadding:0.17*ht,ocolor:'rgb(0,0,100)',icolor:'rgb(0,0,110)'};

let dropParams = {dropTries:100,maxLoops:100000,maxDrops:100000};

Object.assign(rs,topParams);

rs.initialize = function () {
  debugger;
  let {height:ht,icolor,ocolor} = this;
  let hht = 0.5*ht;
  this.addFrame();
  this.addRectangle({width:ht,height:ht,stroke_width:0,fill:ocolor});
  this.addRectangle({width:hht,height:hht,stroke:'white',stroke_width:0,fill:icolor});

}

export {rs};


