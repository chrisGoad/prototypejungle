
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
let rs = basicsP.instantiate();
addDropMethods(rs);
addRandomMethods(rs);
addSegsetMethods(rs);

rs.setName('drop_iris');
let ht = 160;
 ht = 700;
let topParams = {saveState:0,width:ht,height:ht,numRows:20,numCols:30,dropTries:20,segLength:10,framePadding:0.1*ht,fromEnds:1,sepNext:.1,lineExt:.2,extendWhich:'random','numSeedss':100}

let fanParams = {randomDirectionChange:0.3*Math.PI,sepNext:.1,splitChance:0.5,splitAmount:0.08 * Math.PI,directionChange:0.025 * Math.PI}
	
let ringParams = {numSeeds:100,ringRadius:0.3 * 0.5 * ht,stroke:'transparent'};

Object.assign(rs,topParams);

rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 2;
}  

rs.dropAt = function (p,rvs) {
  let {r,g,b} = rvs;
  let clr = `rgb(${r},${g},${b})`;
  return this.genFan(Object.assign({startingPoint:p,stroke:clr},fanParams));
}

rs.initialDrop = function () {
  let {width} = this;
  let rad = 0.3 * 0.5 * width;
  let exc = geom.Circle.mk(Point.mk(0,0),rad - 1);
  this.exclusionZones = [exc];
  let dnc = geom.Circle.mk(Point.mk(0,0),3*rad);
  this.doNotExit= [dnc];
  return this.ringSeeds(ringParams);  
}

rs.computeState  = function () {
   return [["randomGridsForShapes",this.randomGridsForShapes]];
}

rs.initialize = function () {
  this.initProtos();
  this.addFrame();
  if (this.saveState) {
    this.setupColorGridsForShapes({step:10,min:100,max:240});
    this.saveTheState();
    this.generateDrop();
  } else {
    this.getTheState(() => {
      this.generateDrop();
    });
  }
}

export {rs};


