
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_eye.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_eye_h');
let wd  = 100;
let topParams = {backStripeWidth:1.25*wd,backStripeHeight:1.5*1.25	*wd,backStripeVisible:wd/100	,backStripePadding:0.25*wd,}

Object.assign(rs,topParams);

rs.horizontalize(topParams);



export {rs};


