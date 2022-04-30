
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_sphere.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_sphere_h');

let wd = 1200;

let topParams = {saveState:0,backStripeWidth:1.1*wd,backStripeHeight:1.5*1.1*wd,backStripeVisible:wd/100}

Object.assign(rs,topParams);


rs.horizontalize(topParams);


export {rs};


