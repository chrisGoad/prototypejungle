
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as generatorP} from '/generators/grid_grid_3.mjs';
import {rs as basicsP} from '/generators/basics.mjs';


let rs = basicsP.instantiate();
rs.setName('grid_grid_3_i_1',1);
let wd = 400;
let nr = 20;
let fwd = 1.2  * wd;
let topParams = {saveState:0,width:fwd,height:fwd,numRows:nr,numCols:nr,innerRows:2,innerCols:2,pointJiggle:10,innerRows:5,backgroundColor:'rgb(0,0,100)',framePadding:0.75*fwd,frameStrokee:'white'};

Object.assign(rs,topParams);

rs.set('g00',generatorP.instantiate());
rs.set('g10',generatorP.instantiate());
rs.set('g01',generatorP.instantiate());
rs.set('g11',generatorP.instantiate());
Object.assign(rs,topParams);

rs.decider = function (rvs,cell) {
  let {numRows} = this;
  let hnr = numRows/2;
  return (cell.x+cell.y) % 2 === 0;
  return  cell.x < hnr;
}

rs.decider = function (rvs,cell) {
  return Math.random() < 0.5;
  let {numRows} = this;
  let hnr = numRows/2;
  return (cell.x+cell.y) % 2 === 0;
  return  cell.x < hnr;
}
 

rs.computeState  = function () {
   debugger;
   let st =
   [["g00/whichElts",this.g00.whichElts],["g00/eltDState1",this.g00.eltDState1],["g00/eltDState2",this.g00.eltDState2],
   ["g01/whichElts",this.g01.whichElts],["g01/eltDState1",this.g01.eltDState1],["g01/eltDState2",this.g01.eltDState2],
   ["g10/whichElts",this.g10.whichElts],["g10/eltDState1",this.g10.eltDState1],["g10/eltDState2",this.g10.eltDState2],
   ["g11/whichElts",this.g11.whichElts],["g11/eltDState1",this.g11.eltDState1],["g11/eltDState2",this.g11.eltDState2]];
   return st;
} 
  
rs.initialize = function () {
  core.root.backgroundColor = 'rgb(0,0,0)';
  debugger;
  this.addFrame();
  const performBuild = (svs) =>  {
    this.g00.saveState = svs;
    this.g10.saveState = svs;
    this.g01.saveState = svs;
    this.g11.saveState = svs;
    this.g00.initialize();
    this.g01.initialize();
    this.g10.initialize();
    this.g11.initialize();
    this.saveTheState();
    let mv = 0.5*wd;
    this.g00.moveto(Point.mk(-mv,-mv));
    this.g10.moveto(Point.mk(mv,-mv));
    this.g01.moveto(Point.mk(-mv,mv));
    this.g11.moveto(Point.mk(mv,mv));
  }
  if (this.saveState) {
    performBuild(1);
    this.saveTheState();
  } else {
    this.getTheState(() => {
      debugger;
      performBuild(0);
    });
  } 
}

export {rs};

 