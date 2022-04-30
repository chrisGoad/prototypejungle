
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_tracks.mjs';

let rs = generatorP;

rs.setName('grid_tracks_v');
let wd  = 100;
let topParams = {height:1.5*wd,width:wd,backStripeVisible:wd/100,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd,backStripeVisible:0}

Object.assign(rs,topParams);

export {rs};


