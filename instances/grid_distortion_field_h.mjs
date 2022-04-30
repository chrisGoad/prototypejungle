
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/grid_distortion_field.mjs';

let rs = generatorP;//.inshtantiate();

rs.setName('grid_distortion_field_h');
let wd = 400;

let topParams = {backStripeHeight:1.5*1.3*wd,backStripeWidth:1.3*wd,backStripeVisible:wd/100};

Object.assign(rs,topParams);

rs.horizontalize(topParams);


export {rs};


