
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_signals.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_signals_v');
let wd  = 2000;
let topParams = {height:1.5*wd,width:wd,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd,backStripeVisible:wd/100}

Object.assign(rs,topParams);

export {rs};


