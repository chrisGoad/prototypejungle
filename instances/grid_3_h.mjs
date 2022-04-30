
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/grid_3.mjs';

let rs = generatorP;

rs.setName('grid_3_h');
let onr = 10;
let owd = 1200;
let outerParams = {numRows:1.5*onr,numCols:onr,width:owd,height:1.5*owd,backStripeWidth:1.25*owd,backStripeHeight:1.5*1.25	*owd,backStripeVisible:0	}

Object.assign(rs,outerParams);

rs.horizontalize(rs,outerParams);


rs.initProtoss = function () {
	core.assignPrototypes(this,'lineP',linePP);
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = 2;
}  



export {rs};


