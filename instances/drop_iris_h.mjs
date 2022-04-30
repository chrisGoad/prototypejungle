
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_iris.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_iris_h',0,'drop_iris');
let ht  = 700;
let topParams = {saveState:0,width:ht,height:ht,backStripeWidth:1.5*1.2*ht,backStripeHeight:1.2*ht,backStripeVisible:ht/100}

Object.assign(rs,topParams);


rs.initProtos = function () {
	core.assignPrototypes(this,'lineP',linePP);
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = 2;
}  



export {rs};


