
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_tube.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_tube_v');

let wd = 200;

let topParams = {saveState:0,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd,backStripeVisible:wd/100}

Object.assign(rs,topParams);





export {rs};


