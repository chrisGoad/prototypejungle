
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_whorls.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_whorls_v');
let wd  = 400;
let topParams = {width:wd,height:1.5*wd,backStripeVisible:0}

Object.assign(rs,topParams);



rs.initProtos = function () {
  this.lineP = linePP.instantiate();
	this.lineP.stroke = 'white';
	this.lineP.stroke = 'transparent';
	this.lineP['stroke-width'] = 1;
}  

export {rs};


