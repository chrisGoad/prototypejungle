
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/drop_starry_night.mjs';

let rs = generatorP.instantiate();

rs.setName('drop_starry_night_v');
let wd  = 200;
let topParams = {width:wd,height:1.5*wd,backStripeVisible:wd/100}

Object.assign(rs,topParams);



rs.initProtos = function () {
  this.lineP = linePP.instantiate();
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = 0.5;
}  

export {rs};


