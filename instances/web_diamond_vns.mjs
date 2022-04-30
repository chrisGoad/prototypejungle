
import {rs as linePP} from '/line/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as generatorP} from '/generators/web_diamond.mjs';

let rs = generatorP;//instantiate();

rs.setName('web_diamond_vns');
let wd  = 3000;
let topParams = {width:wd,height:wd,backStripeWidth:1.2*wd,backStripeColorr:'red',backStripeHeight:1.5*1.2*wd,backStripeVisible:0}

Object.assign(rs,topParams);



rs.initProtos = function () {
	this.lineP = linePP.instantiate();
	this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 7;
  //for visualization/debugging
  let circleP = this.set('circleP',circlePP.instantiate()).hide();
	circleP.dimension = 20;
	circleP.fill = 'transparent';
	circleP.stroke = 'transparent';
}  


export {rs};


