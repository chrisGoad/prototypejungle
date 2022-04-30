
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_dandelion.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_dandelion_h');
let ht  = 360;
let topParams = {width:1.5*ht,height:ht,backStripeVisible:ht/100}

Object.assign(rs,topParams);



rs.initProtos = function () {
	this.lineP = linePP.instantiate();
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = .3;
}  


export {rs};


