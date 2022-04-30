
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_incoming.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_incoming_v');

let wd = 1200;

let topParams = {saveState:0,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd,backStripeVisible:wd/100,backStripePaddingg:0.1*wd,}

Object.assign(rs,topParams);





export {rs};


