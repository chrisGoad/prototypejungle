
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_aphelion.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_aphelion_h');
let ht  = 6000;
let topParams = {backStripeVisible:ht/100,backStripeHeight:1.2*ht,backStripeWidth:1.5*1.2*ht}

Object.assign(rs,topParams);



rs.initProtos = function () {
	this.lineP = linePP.instantiate();
	this.lineP.stroke = 'yellow';
	this.lineP['stroke-width'] = 8;
}  


export {rs};


