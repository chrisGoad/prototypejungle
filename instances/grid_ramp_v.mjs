
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/grid_ramp.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_ramp_v',0,'grid_ramp');
let wd = 200;

let topParams = {saveState:0,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd,backStripeVisible:wd/100};
/*
let nr = 64;
let nc = 100;
let topParams = {saveState:0};


  topParams = {numRows:nr,numCols:nr,width:wd,height:ht,backStripeColor:'rgb(2,2,2)',pointJiggle:0,backStripePadding:0.20*wd,backStripeVisible:0,sideA:function(fr) {return this.leftSide.pointAlong(fr)},sideB:function(fr) {return this.rightSide.pointAlong(fr)},positionMethod:grid1.sidesPositionFunction};

//topParams = {numRows:2,numCols:nc,width:wd,height:wd,backStripeColor:'rgb(2,2,2)',pointJiggle:40,backStripePadding:0.15*wd,numTimeSteps:100};
*/
Object.assign(rs,topParams);



export {rs};


