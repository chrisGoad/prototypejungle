
import {rs as linePP} from '/line/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as generatorP} from '/generators/grid_vortex.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_vortex_v');
let wd  = 360;
let topParams = {width:wd,height:wd,backStripeHeight:1.5*1.25*wd,
	backStripeWidth:1.25*wd,backStripeVisible:wd/100}

Object.assign(rs,topParams);


	
rs.initProtos = function () {
   this.circleP = circlePP.instantiate().show();
	this.circleP['stroke-width'] = 0.4;
	this.circleP.fill = "red";
	this.circleP.dimension = 1;
  this.lineP = linePP.instantiate().show();
  this.lineP.stroke = 'black';
  this.lineP.stroke = 'red';
	this.lineP['stroke-width'] = 0.5;
}

export {rs};


