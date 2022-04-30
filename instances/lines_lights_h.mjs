
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/lines_lights.mjs';

let rs = generatorP.instantiate();

rs.setName('lines_lights_h');
let wd = 130;

let topParams = {backStripeHeight:1.5*1.3*wd,backStripeWidth:1.3*wd,backStripeVisible:wd/100};

Object.assign(rs,topParams);

rs.horizontalize(topParams);


export {rs};


