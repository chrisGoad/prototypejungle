import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as generatorP} from '/generators/grid_void.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_void_h');
let wd  = 100;
let topParams = {width:wd,height:wd,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd,backStripeVisible:wd/100,backStripePadding:0.1*wd,}

Object.assign(rs,topParams);


rs.initProtos = function () {
	let rectP = this.set('rectP',rectPP.instantiate()).hide();
	this.rectP.stroke = 'rgba(0,0,0,.8)';
	this.rectP['stroke-width'] = 0.2;
}

rs.horizontalize(topParams);


export {rs};


