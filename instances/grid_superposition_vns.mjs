
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_superposition.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_superposition_v');
let wd  = 200;
let topParams = {backStripeWidth:1.25*wd,backStripeHeight:1.5*1.25	*wd,backStripeVisible:0	,backStripePadding:0.25*wd,}

Object.assign(rs,topParams);


rs.initProtos = function () {
	core.assignPrototypes(this,'lineP',linePP);
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = 2;
}  



export {rs};


