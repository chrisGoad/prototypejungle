
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_shield.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_shield_v');

let wd = 400;

let topParams = {saveState:0,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd,backStripeVisible:wd/100}

Object.assign(rs,topParams);





export {rs};


