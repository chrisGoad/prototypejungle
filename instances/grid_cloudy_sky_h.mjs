
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_cloudy_sky.mjs';

let rs = generatorP;

rs.setName('grid_cloudy_sky_h');
let wd  = 1400;//  200 looks interesting
let topParams = {height:1.5*wd,width:wd,backStripeWidth:1.1*wd,backStripeHeight:1.5*1.1*wd,backStripeVisible:0}

Object.assign(rs,topParams);

rs.horizontalize(topParams);
export {rs};


