
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/lines_1.mjs';

let rs = generatorP;//.inshtantiate();

rs.setName('lines_1_h');
let ht = 400;

let topParams = {backStripeWidth:1.5*1.2*ht,backStripeHeight:1.2*ht,backStripeVisible:ht/100};

Object.assign(rs,topParams);



export {rs};


