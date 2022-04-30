
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_quilt_1.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_quilt_1_v');

let wd = 300;
let nc = 96;
let topParams = {saveState:0,width:wd,height:1.5*wd,numRows:1.5*nc,numCols:nc,backStripeWidth:1.1*wd,backStripeHeight:1.5*1.1*wd,backStripeVisible:0,backStripePaddingg:0.1*wd,}

Object.assign(rs,topParams);

//rs.horizontalize(rs,topParams,1);




export {rs};


