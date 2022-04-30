



import {rs as eyeP} from '/generators/lines_bugeye.mjs';
import {rs as basicP} from '/generators/basics.mjs';

let item = basicP.instantiate();
item.setName('lines_bugeyes');
let ht= 235;
let topParams = {width:ht*1.5,height:ht,frameWidth:1.5*1.12*ht,frameHeight:1.12*ht,frameVisible:0,sigX:0.4,sigY:0.35};
Object.assign(item,topParams);

item.initialize = function () {
  
  let left = this.set('left',eyeP.instantiate());
  left.left = 1;
  let right = this.set('right',eyeP.instantiate());
	left.initialize();
	right.initialize();
  left.moveto(Point.mk(-90,0));
  right.moveto(Point.mk(90,0));
  this.addFrame();
 
}	

export {item as rs};


      

