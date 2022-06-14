
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/dropForest.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();
addDropMethods(rs);
addRandomMethods(rs);
addSegsetMethods(rs);

rs.setName('drop_iris');
let ht = 700;
let ringRadius = 0.3 * 0.5 * ht;
 
let topParams = {saveState:0,width:ht,height:ht,numRows:20,numCols:30,segLengthh:10,framePadding:0.1*ht}

let dropParams = {dropTries:10,fromEnds:1,sepNext:.1,extendWhich:'random',segLength:10,exclusionZones:[geom.Circle.mk(Point.mk(0,0),ringRadius)],doNotExit:[geom.Circle.mk(Point.mk(0,0),0.5*ht)], randomDirectionChange:0.3*Math.PI,sepNext:.1,splitChance:0.5,splitAmount:0.08 * Math.PI,directionChange:0.025 * Math.PI}
//let fanParams = {randomDirectionChange:0.3*Math.PI,sepNext:.1,splitChance:0.5,splitAmount:0.08 * Math.PI,directionChange:0.025 * Math.PI}
	
let ringParams = {numSeeds:100,ringRadius};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 2;
}  
/*
rs.generateDrop = function (p) {
  let segs = this.generateFan(p);
  let lines = segs.map( s => this.genLine(s,this.lineP,dropParams.lineExt));
  return {geometries:segs,shapes:lines};
}*/
rs.generateDrop = function (p,rvs) {
  debugger;
  let {r,g,b} = rvs;
  let clr = `rgb(${r},${g},${b})`;
  let segs =  this.generateFan(p);
  let lines = segs.map( s => this.genLine(s,this.lineP,dropParams.lineExt));
  lines.forEach((line) => line.stroke = clr);
  return {geometries:segs,shapes:lines};
}

rs.initialDrop = function () {
 /* let {width} = this;
  let rad = 0.3 * 0.5 * width;
  let exc = geom.Circle.mk(Point.mk(0,0),rad - 1);
  this.exclusionZones = [exc];
  let dnc = geom.Circle.mk(Point.mk(0,0),3*rad);
  this.doNotExit= [dnc];*/
  let segs= this.ringSeeds(ringParams); 
 let lines = segs.map((sg) => this.genLine(sg,this.lineP)); 
  return {geometries:segs,shapes:lines};  
}

rs.computeState  = function () {
   return [["randomGridsForShapes",this.randomGridsForShapes]];
}

rs.initialize = function () {
  let {saveState,stateOpsDisabled} = this;
  this.initProtos();
  ringParams.lineP = this.lineP;
  this.addFrame();
  if (this.saveState  || stateOpsDisabled) {
    this.setupColorGridsForShapes({step:10,min:100,max:240});
    this.saveTheState();
    this.generateDrops(dropParams);
  } else {
    this.getTheState(() => {
      this.generateDrops(dropParams);
    });
  }
}

export {rs};


