
import {rs as basicP} from '/generators/basics.mjs';
import {rs as stripeP} from '/generators/web_stripe.mjs';

let rs = basicP.instantiate();
rs.setName('web_stripes');

let wd= 2000;
let ht = wd;
let sht = stripeP.height;
let  topParams = {width:wd,height:ht,framePadding:0.17*wd};

Object.assign(rs,topParams);

let numStripes = 5;

rs.initialize = function () {
  core.root.backgroundColor = 'black';
  this.addFrame();
  let stripes = this.set('stripes',core.ArrayNode.mk());
  for (let i = 0;i<numStripes;i++) {
   let stripe = stripeP.instantiate().show();
	 stripes.push(stripe);
   let clr = (i%2 == 0)?'white':'blue';
   stripe.initialize(clr);
	 stripe.moveto(Point.mk(0,(i-2)*sht));
  }   
}


export {rs};



