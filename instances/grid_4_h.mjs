
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_4.mjs';

let rs = generatorP;

rs.setName('grid_4_h');
let ht = 200;
let topParams = {height:ht,width:1.5*ht,backStripeVisible:0,backStripeWidth:1.5*1.2*ht,backStripeHeight:1.2*ht}

Object.assign(rs,topParams);

export {rs};


