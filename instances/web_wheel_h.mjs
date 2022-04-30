
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/web_wheel.mjs';

let rs = generatorP.instantiate();

rs.setName('web_wheel_h');
let ht  = 6500;
let topParams = {width:ht,height:ht,backStripeVisible:ht/100,backStripeWidth:1.5*1.2*ht,backStripeHeight:1.2*ht}

Object.assign(rs,topParams);



rs.initProtos = function () {
	this.lineP = linePP.instantiate();
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = 5;
}  


export {rs};


