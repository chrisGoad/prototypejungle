
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_aphelion.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_aphelion_v');
let wd  = 6000;
let topParams = {width:wd,height:wd,backStripeVisible:wd/100,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd}

Object.assign(rs,topParams);



rs.initProtos = function () {
	this.lineP = linePP.instantiate();
	this.lineP.stroke = 'yellow';
	this.lineP['stroke-width'] = 8;
}  


export {rs};


