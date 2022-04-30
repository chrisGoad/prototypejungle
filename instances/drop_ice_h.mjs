
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_ice.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_ice_h');
let ht  = 200;
let topParams = {width:1.5*ht,height:ht,backStripePadding:.17*ht,backStripeVisible:0}

Object.assign(rs,topParams);



rs.initProtos = function () {
	this.lineP = linePP.instantiate();
	this.lineP.stroke = 'yellow';
	this.lineP['stroke-width'] = .3;
}  


export {rs};


