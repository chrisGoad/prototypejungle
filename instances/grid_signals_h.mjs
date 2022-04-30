
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_signals.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_signals_h');
let ht  = 2000;
let topParams = {width:1.5*ht,height:ht,backStripeHeight:1.17*ht,backStripeWidth:1.5*1.1*ht,backStripeVisible:0}

Object.assign(rs,topParams);

export {rs};


