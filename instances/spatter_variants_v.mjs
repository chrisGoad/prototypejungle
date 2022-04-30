
import {rs as linePP} from '/line/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as generatorP} from '/generators/spatter_variants.mjs';

let rs = generatorP;//.instantiate();

rs.setName('spatter_variants_v');
let wd  = 1000;
let topParams = {backStripeHeight:1.5*1.25*wd,
	backStripeWidth:1.25*wd,backStripeVisible:wd/100}

Object.assign(rs,topParams);


export {rs};


