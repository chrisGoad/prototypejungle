import {rs as circlePP} from '/shape/circle.mjs';
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
 
let topParams = {saveState:0,width:ht,height:ht,numRows:20,numCols:30,segLengthh:10,framePadding:0.1*ht,stayWithin:geom.Circle.mk(Point.mk(0,0),0.5*ht),stayOutside:geom.Circle.mk(Point.mk(0,0),ringRadius) }

let dropParams = {dropTries:10,maxTotalTries:100000,fromEnds:1,sepNext:.1,extendWhich:'random',segLength:10,randomDirectionChange:0.3*Math.PI,sepNext:.1,splitChance:0.5,splitAmount:0.08 * Math.PI,directionChange:0.025 * Math.PI}
//let fanParams = {randomDirectionChange:0.3*Math.PI,sepNext:.1,splitChance:0.5,splitAmount:0.08 * Math.PI,directionChange:0.025 * Math.PI}
	
let ringParams = {numSeeds:100,ringRadius};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 2;
   this.circleP = circlePP.instantiate();
  this.circleP.stroke= 'white';
  this.circleP.fill= 'transparent';
  this.circleP['stroke-width'] = 1;
}  

rs.generateForestDrop = function (p,rvs) {
  debugger;
  let {stayWithin:sw,stayOutside:so} = this;
  let {r,g,b} = rvs;
  let clr = `rgb(${r},${g},${b})`;
  let segs = this.generateFan(p);
  let isegs = segs.filter( (s)=>  sw.contains(s,p));
  let osegs = isegs.filter( (s)=>  !so.contains(s,p));
  let lines = osegs.map( s => s.toShape(this.lineP,dropParams.lineExt));
  //let lines = osegs.map( s => this.genLine(s,this.lineP,dropParams.lineExt));
  lines.forEach((line) => line.stroke = clr);
  return {geometries:osegs,shapes:lines};
}

rs.initialForestDrop = function () {
 /* let {width} = this;
  let rad = 0.3 * 0.5 * width;
  let exc = geom.Circle.mk(Point.mk(0,0),rad - 1);
  this.exclusionZones = [exc];
  let dnc = geom.Circle.mk(Point.mk(0,0),3*rad);
  this.doNotExit= [dnc];*/
  let segs= this.ringSeeds(ringParams); 
 let lines = segs.map((sg) => sg.toShape(this.lineP)); 
  return {geometries:segs,shapes:lines};  
}

rs.computeState  = function () {
   return [["randomGridsForShapes",this.randomGridsForShapes]];
}

rs.initialize = function () {
debugger;
  let {saveState,stateOpsDisabled,stayWithin} = this;
  this.initProtos();
  ringParams.lineP = this.lineP;
  this.addFrame();
  this.set('crc',stayWithin.toShape(this.circleP));
  if (this.saveState  || stateOpsDisabled) {
    this.setupColorGridsForShapes({step:10,min:100,max:240});
    this.saveTheState();
    this.generateForestDrops(dropParams);
  } else {
    this.getTheState(() => {
      this.generateForestDrops(dropParams);
    });
  }
}

export {rs};


