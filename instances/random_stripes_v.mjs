
//import {rs as linePP} from '/line/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';

import {rs as generatorP} from '/generators/random_stripes.mjs';

let rs = generatorP.instantiate();

rs.setName('random_stripes_v',0,'random_stripes');

let nr = 64;
let nc = 100;
let wd = 200;
let topParams = {saveState:0,numRows:2,numCols:nc,width:wd,height:1.5*wd,backStripeVisible:0,backStripePadding:0.1*wd,}


//topParams = {numRows:2,numCols:nc,width:wd,height:wd,backStripeColor:'rgb(2,2,2)',pointJiggle:40,backStripePadding:0.15*wd,numTimeSteps:100};

Object.assign(rs,topParams);
let rdim = 1;

rs.initProtos = function () {
	rs.rectP  = rectPP.instantiate();
	rs.rectP.fill = 'red';
	rs.rectP.fill = 'white';
	
	rs.rectP['stroke-width'] = 0;
	rs.rectP.width = rdim;
	rs.rectP.height = rdim;

}  



export {rs};


