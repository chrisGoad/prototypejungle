
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as generatorP} from '/generators/grid_cloth.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_cloth_h');
let ht  = 400;
let nr = 100;

let topParams = {numCols:1.5*nr,numRows:nr,width:1.5*ht,height:ht,backStripeVisible:0}

Object.assign(rs,topParams);

rs.initProtos = function () {
	core.assignPrototypes(this,'rectP',rectPP);
	this.rectP.fill = 'white';
	this.rectP['stroke-width'] = 0;
	this.rectP.width = 1;
	this.rectP.height = 4;
}  


export {rs};


