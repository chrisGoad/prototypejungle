
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as starMapP} from '/generators/grid_star_map.mjs';

let rs = basicsP.instantiate();
rs.setName('grid_star_maps');

let grid0 = rs.set('grid0',starMapP.instantiate());
let grid1 = rs.set('grid1',starMapP.instantiate());
grid0.spacing = 3
grid0.chance = 0.02;
grid1.spacing = 5;
grid1.chance = 0.02;
let ht  = 1.3*200;

let topParams = {frameVisible:0,frameWidth:1.5*1.2*ht,frameHeight:1.2*ht}
Object.assign(rs,topParams);

rs.initialize = function () {
  this.addFrame();
  grid0.initialize();
  grid1.initialize();
  let wd = grid0.width;
  let mv = 1.1 * 0.5 * wd;
  grid0.moveto(Point.mk(-mv,0));
  grid1.moveto(Point.mk(mv,0));
}

export {rs};


