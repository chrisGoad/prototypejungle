
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as starMapP} from '/generators/grid_star_map.mjs';

let rs = basicsP.instantiate();
rs.setName('grid_star_maps');

let grid0 = rs.set('grid0',starMapP.instantiate());
let grid1 = rs.set('grid1',starMapP.instantiate());
Object.assign(grid0,{spacing:3,chance:0.02});
Object.assign(grid1,{spacing:5,chance:0.02});

let ht  = 300;
let topParams = {frameWidth:1.5*ht,frameHeight:1.2*ht}
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


