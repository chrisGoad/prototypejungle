
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/grid_world.mjs';

let rs = generatorP;//.inshtantiate();

rs.setName('grid_world_v');
let sqsz= 50;
let sqd = 50;
let wd = 0.8 * sqd * sqsz;
let topParams = {backStripeHeight:1.5*1.2*wd,backStripeWidth:1.2*wd,backStripeVisible:wd/100};

Object.assign(rs,topParams);



export {rs};


