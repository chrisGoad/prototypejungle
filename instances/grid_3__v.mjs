
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_3.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_3_v');
let wd  = 100;
let topParams = {width:wd,height:1.5*wd,numLines:2000,backStripeWidth:1.25*wd,backStripeHeight:1.5*1.25	*wd,backStripeVisible:0	,backStripePadding:0.25*wd,}

Object.assign(rs,topParams);


rs.initProtoss = function () {
	core.assignPrototypes(this,'lineP',linePP);
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = 2;
}  



export {rs};


