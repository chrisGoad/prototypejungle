import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as linePP} from '/line/line.mjs';
import {rs as generatorP} from '/generators/random_stripes.mjs';

let rs = generatorP.instantiate();

rs.setName('random_stripes_v');
let wd  = 200;
let topParams = {width:wd,height:wd,backStripeVisible:wd/100,backStripeWidth:1.2*wd,backStripeHeight:1.5*1.2*wd}

Object.assign(rs,topParams);

let rdim = 1;

rs.initProtos = function () {
	rs.rectP  = rectPP.instantiate();
	rs.rectP.fill = 'white';
	rs.rectP['stroke-width'] = 0;
	rs.rectP.width = rdim;
	rs.rectP.height = rdim;
  return;
  rs.blineP  = linePP.instantiate();
  rs.blineP['stroke-width'] = 0.4;
  rs.blineP.stroke = 'cyan';
  rs.blineP.stroke = 'white';
} 


export {rs};


