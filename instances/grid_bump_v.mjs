
import {rs as linePP} from '/shape/line.mjs';
import {rs as generatorP} from '/generators/grid_bump.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_bump_v');

let wd = 1200;

let topParams = {saveState:0,frameWidth:1.2*wd,frameHeight:1.5*1.2*wd,frameStroke:'white',framePadding:0.1*wd,}

Object.assign(rs,topParams);





export {rs};


