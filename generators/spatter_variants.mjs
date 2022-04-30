
import {rs as basicP} from '/generators/basics.mjs';
import {rs as sfv} from '/generators/spatter_for_variants.mjs';

let rs = basicP.instantiate();
	
rs.setName('spatter_variants');

let grid1 = rs.set('grid1',sfv.instantiate());
let grid2 = rs.set('grid2',sfv.instantiate());
let grid3 = rs.set('grid3',sfv.instantiate());
let grid4 = rs.set('grid4',sfv.instantiate());

grid1.which = 1;
grid2.which = 2;
grid3.which = 3;
grid4.which = 4;
 
let wd = 1000;
let topParams = {width:wd,height:wd,framePadding:0.1*wd};
Object.assign(rs,topParams);

rs.initialize = function () {
  grid1.initialize();
  grid2.initialize();
  grid3.initialize();
  grid4.initialize(); 
  let mv = 0.25*this.width;
  grid1.moveto(Point.mk(-mv,-mv));
  grid2.moveto(Point.mk(mv,-mv));
  grid3.moveto(Point.mk(-mv,mv));
  grid4.moveto(Point.mk(mv,mv));
  this.addFrame();
}
	
export {rs};


