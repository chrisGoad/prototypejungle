
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_2.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_2_v');

let wd = 300;
let nc = 40;
let topParams = {width:wd,height:1.5*wd,numRows:1.5*nc,numCols:nc,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd,backStripeVisible:0,backgroundPadding:0}

Object.assign(rs,topParams);





export {rs};


