
import {rs as basicP} from '/generators/basics.mjs';
import {rs as fromCenterP} from '/generators/lines_from_center.mjs';	
import {rs as cobwebP} from '/generators/lines_cobweb.mjs';	

let rs = basicP.instantiate();

rs.setName('lines_1');
let wd = 600;
let topParams = {width:wd,height:wd,framePadding:0.1*wd};
Object.assign(rs,topParams);

rs.initialize = function () {
  let {width} = this;
  let mv = 0.25*width;
  this.addFrame();
  let quad00 = this.set('quad00',fromCenterP.instantiate().show());
  quad00.width = quad00.height = 0.5*wd;
  quad00.initialize();
  quad00.moveto(Point.mk(-mv,-mv));
  let quad10 = this.set('quad10',fromCenterP.instantiate().show());
  quad10.width = quad10.height = 0.5*wd;
  quad10.lineColor = 'black';
  quad10.backFill = 'white';
  quad10.initialize();
  quad10.moveto(Point.mk(mv,-mv));
  let quad01= this.set('quad01',cobwebP.instantiate().show());
  quad01.width = quad01.height = 0.5*wd;
  quad01.initialize();
  quad01.moveto(Point.mk(-mv,mv));
  let quad11 = this.set('quad11',cobwebP.instantiate().show());
  quad11.width = quad11.height = 0.5*wd;
  quad11.lineColor = 'black';
  quad11.backFill = 'white';
  quad11.initialize();
  quad11.moveto(Point.mk(mv,mv));

}

export {rs};
