
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/lines_lights.mjs';

let rs = generatorP;//.instantiate();

rs.setName('lines_lights_sq');
let wd = 150;

let topParams = {backStripeHeight:1.2*wd,backStripeWidth:1.2*wd,backStripeVisible:0};

Object.assign(rs,topParams);



export {rs};


