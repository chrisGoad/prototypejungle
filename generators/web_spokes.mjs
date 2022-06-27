
import {rs as basicP} from '/generators/basics.mjs';
import {rs as webSpoke} from '/generators/web_spoke.mjs';	
let rs = basicP.instantiate();

let spokes = rs.set('spokes',arrayShape.mk());

rs.setName('web_spokes');

let wd= 2000;

let  topParams = {width:wd,height:wd,framePadding:.15*wd,spokeHeight:40,numSpokes:18};

Object.assign(rs,topParams);
	
rs.initialize = function () {
  let {numSpokes,lineP} = this;
  this.addFrame();
  for (let i=0;i<numSpokes;i++) {
    let spoke = webSpoke.instantiate();
    spoke.lineP = lineP;
    spokes.push(spoke);
    let dir = 2*i*(Math.PI/numSpokes);
    spoke.initialize(this.spokeHeight,dir);
  }  
}

export {rs};


