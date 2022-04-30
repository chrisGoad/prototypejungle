
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_beacons.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_beacons_v');
let wd  = 1000;
let topParams = {height:1.5*wd,width:wd,backStripeVisible:wd/1000,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd,backStripeVisible:0}

Object.assign(rs,topParams);

export {rs};


