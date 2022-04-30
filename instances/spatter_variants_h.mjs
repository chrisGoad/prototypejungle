
import {rs as linePP} from '/line/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as generatorP} from '/generators/spatter_variants.mjs';

let rs = generatorP;//.instantiate();

rs.setName('spatter_variants_h');
let ht  = 1000;
let topParams = {backStripeWidth:1.5*1.25*ht,
	backStripeHeight:1.25*ht,backStripeVisible:ht/100}

Object.assign(rs,topParams);


export {rs};


