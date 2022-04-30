
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_1.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_1_h');

let wd = 270;

let topParams = {saveState:0,backStripeWidth:1.3*wd,backStripeHeight:1.5*1.3*wd,backStripeVisible:wd/100,backStripePos:Point.mk(0,45)}

Object.assign(rs,topParams);


rs.horizontalize(topParams);


export {rs};


