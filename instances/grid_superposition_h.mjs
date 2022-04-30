
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_superposition.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_superposition_h');
let ht  = 200;
//let topParams = {width:wd,height:1.5	*wd,backStripeVisible:wd/100	,backStripePadding:0.25*wd,}


let topParams = {backStripeHeight:1.25*ht,backStripeWidth:1.5*1.25	*ht,backStripeVisible:ht/100	}

Object.assign(rs,topParams);


rs.initProtos = function () {
	core.assignPrototypes(this,'lineP',linePP);
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = 2;
}  



export {rs};


