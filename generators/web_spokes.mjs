
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPointGenMethods} from '/mlib/pointGen.mjs';	
import {rs as webSpoke} from '/generators/web_spoke.mjs';	
let rs = basicP.instantiate();

addPointGenMethods(rs);

let spokes = rs.set('spokes',arrayShape.mk());

rs.setName('web_spokes');

let wd= 2000;

let  topParams = {width:wd,height:wd,framePadding:.15*wd,spokeHeight:40,numSpokes:18};

Object.assign(rs,topParams);
	
rs.initProtos = function () {	
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 3;
}  

rs.initialize = function () {
  this.initProtos();
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


