
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_beacons.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_beacons_h');
let ht  = 1000;
let topParams = {height:ht,width:1.5*ht,backStripeVisible:ht/100,backStripeWidth:1.5*1.2*ht,backStripeHeight:1.2*ht,backStripeVisible:0}

Object.assign(rs,topParams);

export {rs};


