
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_fade.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_fade_h');
let ht  = 200;
let topParams = {width:1.5*ht,height:ht,backStripeVisible:0}

Object.assign(rs,topParams);

export {rs};


