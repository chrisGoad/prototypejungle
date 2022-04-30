import {rs as basicsP} from '/generators/basics.mjs';
import {rs as quiltP} from '/generators/grid_one_quilt.mjs';
let rs = basicsP.instantiate();

let ht = 450;
let topParams = {width:1.5*ht,height:ht,framePadding:0.1*ht,frameVisible:0};
Object.assign(rs,topParams);
rs.setName('grid_two_quilts');
rs.initialize = function() {
  this.addRectangle(this.backFill);
  let grid0 = rs.set('grid0',quiltP.instantiate());
  let grid1 = rs.set('grid1',quiltP.instantiate());
  grid0.initialize();
  grid1.initialize();
  let mby = 0.6 * grid1.width;
  grid0.moveto(Point.mk(-mby,0));
  grid1.moveto(Point.mk(mby,0));
  this.addFrame();
}

export {rs};


