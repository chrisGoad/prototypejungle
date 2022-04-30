
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_ice.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_blue_ice');
let ht  = 200;
let topParams = {width:1.5*ht,height:ht,framePadding:.17*ht}

Object.assign(rs,topParams);

rs.initProtos = function () {
	this.lineP = linePP.instantiate();
	this.lineP.stroke = 'blue';
	this.lineP['stroke-width'] = .3;
}  


export {rs};


