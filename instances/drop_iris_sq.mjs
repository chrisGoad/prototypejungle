
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_iris.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_iris_sq',0,'drop_iris');
let wd  = 700;
let topParams = {saveState:0,width:wd,height:wd,backStripeVisible:0,backStripePadding:0.1*wd,}

Object.assign(rs,topParams);


rs.initProtos = function () {
	core.assignPrototypes(this,'lineP',linePP);
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = 2;
}  



export {rs};


