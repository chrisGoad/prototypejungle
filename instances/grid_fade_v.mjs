
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_fade.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_fade_v');
let wd  = 200;
let topParams = {height:1.5*wd,width:wd,backStripeVisible:0}

Object.assign(rs,topParams);

export {rs};


