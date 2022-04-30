import {rs as basicsP} from '/generators/basics.mjs';
import {rs as gfs} from '/generators/grid_for_superposition.mjs';
let rs = basicsP.instantiate();
let grid1 = rs.set('grid1',gfs.instantiate());
let grid2 = rs.set('grid2',gfs.instantiate());

rs.setName('grid_superposition');
let wd = 200;
let fc = 1.1;
grid1.width = wd;
grid1.height = fc*wd;
grid2.width = fc*wd;
grid2.height = wd;

let  topParams = {width:wd,height:wd,framePadding:0.25*wd};
Object.assign(rs,topParams);

rs.initialize = function () {
  this.grid1.initialize();
  this.grid2.initialize();
  this.addFrame();
}

export {rs};


