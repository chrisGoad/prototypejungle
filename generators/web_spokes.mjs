
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPointGenMethods} from '/mlib/pointGen.mjs';	
import {rs as webSpoke} from '/generators/web_spoke.mjs';	
let rs = basicP.instantiate();

addPointGenMethods(rs);

let spokes = rs.set('spokes',arrayShape.mk());

rs.setName('web_spokes');

let wd= 2000;
let ht = 0.02*wd; // height  of stripes

let  topParams = {width:wd,height:wd,framePadding:.15*wd,numSpokes:18};
let  gridParams = {initialPos:Point.mk(-0.0*wd,0),initialDirection:0,width:ht,step:0.007*wd,delta:0.02*Math.PI,numSteps:70};

Object.assign(rs,topParams);
	
let numSpokes = 18;

rs.initProtos = function () {	
  let lineP = this.lineP = linePP.instantiate();
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = 3;
}  

rs.initialize = function () {
  
	this.initProtos();
  let {numSpokes,lineP} = this;

	debugger;
	this.addFrame();
	for (let i=0;i<numSpokes;i++) {
		gridParams.initialDirection = 2*i*(Math.PI/numSpokes);
    let points = this.randomWalkPoints(gridParams);
    let spoke = webSpoke.instantiate();
    spoke.lineP = lineP;
    spokes.push(spoke);
		spoke.generateWeb({points});
	}	
}

export {rs};


