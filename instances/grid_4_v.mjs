
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_4.mjs';

let rs = generatorP;

rs.setName('grid_4_v');
let wd  = 200;
let topParams = {height:1.5*wd,width:wd,backStripeVisible:0,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd}

Object.assign(rs,topParams);

export {rs};


