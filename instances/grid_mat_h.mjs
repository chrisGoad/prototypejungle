
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/grid_mat.mjs';

let rs = generatorP;//.inshtantiate();

rs.setName('grid_mat_h');
let ht = 400;

let topParams = {sigScalee:1,sigColor:'white',backStripeWidth:1.5*1.5*ht,backStripeHeight:1.5*ht,backStripeVisible:ht/100};

Object.assign(rs,topParams);



export {rs};


