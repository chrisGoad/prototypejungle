
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_horizon.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_horizon_h');
let ht  = 400;
let topParams = {width:1.5*ht,height:ht,backStripeWidth:1.5*1.1*ht,backStripeHeight:1.1*ht,backStripeVisible:0}

Object.assign(rs,topParams);



rs.initProtos = function () {
  this.lineP = linePP.instantiate();
	this.lineP.stroke = 'white';
	this.lineP.stroke = 'transparent';
	this.lineP['stroke-width'] = .6;
}  

export {rs};


