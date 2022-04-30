
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_waves.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_waves_h');

let wd = 400;

let topParams = {saveState:0,width:wd,height:1.5*wd,backStripeWidth:1.1*wd,backStripeHeight:1.5*1.1*wd,backStripeVisible:wd/100,backStripePaddingg:0.1*wd,}

Object.assign(rs,topParams);

rs.horizontalize(topParams,1);




export {rs};


