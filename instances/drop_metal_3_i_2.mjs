
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_metal_3.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_metal_3_i_2');
let ht  = 200;
let fr = 0.4;
let omfr = 1-fr;
let hpi = Math.PI/2;
let topParams = {dir0L:fr*hpi,dir0H:omfr*hpi,dir1L:(1+fr)*hpi,dir1H:(1+omfr)*hpi};

Object.assign(rs,topParams);



export {rs};


