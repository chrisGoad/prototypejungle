
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/grid_enigma.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_enigma_h');
let ht = 1750;

let topParams = {backStripeWidth:1.5*1.2*ht,backStripeHeight:1.2*ht,backStripeVisible:ht/100};

Object.assign(rs,topParams);



export {rs};


