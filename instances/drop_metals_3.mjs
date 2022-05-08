
import {rs as basicP} from '/generators/basics.mjs';
import {rs as metalP} from '/generators/drop_metal_3.mjs';	

let rs = basicP.instantiate();

rs.setName('drop_metals_3');
let wd = 1600;
let topParams = {width:wd,height:wd,framePadding:0.1*wd};
Object.assign(rs,topParams);
let fr = 0.2;
let pi = Math.PI;
let pio2 = pi/2;
let range = (1-2*fr)*pio2;
rs.initialize = function () {
  let {width} = this;
  let mv = 0.333*width;
  this.addFrame();
  let metal0 = this.set('metal0',metalP.instantiate().show());
  metal0.width = metal0.height = 0.333*wd;
  Object.assign(metal0,{dir0L:0,dir0H:pio2,dir1L:pio2,dir1H:pi});

  
  metal0.initialize();
  metal0.moveto(Point.mk(-mv,0)); 
  let metal1 = this.set('metal1',metalP.instantiate().show());
    Object.assign(metal1,{dir0L:fr*pio2,dir0H:fr*pio2+range,dir1L:(1+fr)*pio2,dir1H:(1+fr)*pio2+range});

  metal1.width = metal1.height = 0.333*wd;
  metal1.initialize();
  metal1.moveto(Point.mk(0,0));
  let metal2 = this.set('metal2',metalP.instantiate().show());
  metal2.width = metal2.height = 0.333*wd;
  metal2.initialize();
  metal2.moveto(Point.mk(mv,0));
}

export {rs};
