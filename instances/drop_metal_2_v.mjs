
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_metal_2.mjs';

let rs = generatorP;//.instantiate();

rs.setName('drop_metal_2_v');

let wd = 300;

let topParams = {saveState:0,width:wd,height:1.5*1.1*wd,backStripeWidth:1.1*wd,backStripeHeight:1.5*1.2*wd,backStripeVisible:0}

Object.assign(rs,topParams);





export {rs};


