
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/drop_arrows.mjs';

let rs = generatorP;//.inshtantiate();

rs.setName('drop_arrows_v');
let wd = 400;

let topParams = {backStripeHeight:1.5*1.2*wd,backStripeWidth:1.2*wd,backStripeVisible:wd/100};

Object.assign(rs,topParams);



export {rs};


