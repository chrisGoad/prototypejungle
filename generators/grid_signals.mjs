
import {rs as basicP} from '/generators/basics.mjs';
import {rs as signalP} from '/generators/grid_signal.mjs';

let rs = basicP.instantiate();
rs.setName('grid_signals');
let grid1 = signalP.instantiate();
let grid2 = signalP.instantiate();
let grid3 = signalP.instantiate();
let grid4 = signalP.instantiate();
let wd = 2000;
let topParams = {width:wd,height:wd,frameColor:'rgb(2,2,2)',framePadding:0.17*wd};
Object.assign(rs,topParams);

rs.initialize = function () {
  let hwd = this.width/2;
  grid1.height = grid1.width = hwd;
  grid2.height = grid2.width = hwd;
  grid3.height = grid3.width = hwd;
  grid4.height = grid4.width = hwd;
  grid1.powerParams = Object.assign({},grid1.powerParams);
  grid2.powerParams = Object.assign({},grid1.powerParams);
  grid3.powerParams = Object.assign({},grid1.powerParams);
  grid4.powerParams = Object.assign({},grid1.powerParams);
  grid1.powerParams.randomizingFactor = 1.5;
  grid2.powerParams.randomizingFactor = 1.5;
  grid3.powerParams.randomizingFactor = 0;
  grid4.powerParams.randomizingFactor = 2;
  let {width} = grid1;
  let {height} = grid1;
  this.addRectangle(this.backFill);
  this.set('grid1',grid1);
  this.set('grid2',grid2);
  this.set('grid3',grid3);
  this.set('grid4',grid4);
  grid1.initialize();
  grid2.initialize();
  grid3.initialize();
  grid4.initialize();
  let mvx = 0.5*width;
  let mvy = 0.5*height;
  grid1.moveto(Point.mk(-mvx,-mvy));
  grid2.moveto(Point.mk(mvx,-mvy));
  grid3.moveto(Point.mk(-mvx,mvy));
  grid4.moveto(Point.mk(mvx,mvy));
  this.addFrame();  
}
export {rs};
