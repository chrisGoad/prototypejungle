
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_3.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_3_v');
let wd  = 100;
let onr = 10;
let owd = 1200;
let outerParams = {numRows:1.5*onr,numCols:onr,width:owd,height:1.5*owd,backStripeWidth:1.25*owd,backStripeHeight:1.5*1.25	*owd,backStripeVisible:0	}
//let topParams = {width:wd,height:1.5*wd,numLines:2000,backStripeWidth:1.25*wd,backStripeHeight:1.5*1.25	*wd,backStripeVisible:0	,backStripePadding:0.25*wd,}

Object.assign(rs,outerParams);



export {rs};


