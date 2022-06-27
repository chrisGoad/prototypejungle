
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/dropForest.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();
addDropMethods(rs);
addRandomMethods(rs);
addSegsetMethods(rs);

rs.setName('drop_leaves');
let ht = 300;
let wd = 1.5 * ht;

let topParams = {width:wd,height:ht,framePadding:0.17*ht,segLength:5};

let dropParams = {dropTries:100,maxTotalTries:400000,sepNext:1,maxDrops:100000, fromEnds:1,extendWhich:'random',splitChance:.010,splitAmount:0.0005 * Math.PI, directionChange:0.000*Math.PI, randomDirectionChange:0.0051*Math.PI, segLength:10};
//let fanParams = {splitChance:.10,splitAmount:0.005 * Math.PI,directionChange:0.0*Math.PI,sepNextt:0.1,randomDirectionChange:0.051*Math.PI};
let sideParams = {numSeeds:10,sepNext:5,whichSide:'both',segLength:5};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = .5;
}  


rs.initialForestDrop = function () {
debugger;
  let segs= this.sideSeeds(sideParams); 
 let lines = segs.map((sg) => sg.toShape(this.lineP)); 
  return {geometries:segs,shapes:lines};  
}


rs.generateForestDrop = function (p) {
  debugger;
  let segs =  this.generateFan(p);
  let lines = segs.map( s => this.genLine(s,this.lineP,dropParams.lineExt));
  return {geometries:segs,shapes:lines};
}

rs.initialize = function () {
  debugger;
  this.addFrame();
  this.initProtos();
 // dropParams.lineP = this.lineP;
 // this.initialForestDrop();
  this.generateForestDrops(dropParams);
}

export {rs};


