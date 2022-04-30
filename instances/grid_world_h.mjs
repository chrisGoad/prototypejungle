
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/grid_world.mjs';

let rs = generatorP;//.inshtantiate();

rs.setName('grid_world_h');
let sqsz= 50;
let sqd = 50;
let ht = 0.8 * sqd * sqsz;
let topParams = {backStripeWidth:1.5*1.2*ht,backStripeHeight:1.2*ht,backStripeVisible:ht/100};

Object.assign(rs,topParams);



export {rs};


