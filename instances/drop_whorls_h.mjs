
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_whorls.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_whorls_h');
let ht  = 400;
let topParams = {width:1.5*ht,height:ht,backStripePadding:0.17*ht,backStripeVisible:0}

Object.assign(rs,topParams);



rs.initProtos = function () {
  this.lineP = linePP.instantiate();
	this.lineP.stroke = 'white';
	this.lineP.stroke = 'transparent';
	this.lineP['stroke-width'] = .6;
}  

export {rs};


