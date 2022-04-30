
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_distortion_field.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_distortion_field_square');
let dim  = 200;
let topParams = {framePadding:.17*dim}

Object.assign(rs,topParams);



export {rs};


