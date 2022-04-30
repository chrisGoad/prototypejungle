
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
addRandomMethods(rs);	
rs.setName('random_stripes');
let rdim = 1;
rs.initProtos = function () {
  rs.rectP  = rectPP.instantiate();
  rs.rectP.fill = 'white';
  rs.rectP['stroke-width'] = 0;
  rs.rectP.width = rdim;
  rs.rectP.height = rdim;
}  

rs.mkStripes = function (n,ornt,minWd,maxWd) {
   let {width:wd,height:ht} = this;
  let delta = maxWd;
  let v = ornt === 'vertical';
  let rw = v?0:1;
  let no2 = n/2;
  for (let i=0;i<n;i++) {
    let rvs = this.randomValuesAtCell(this.randomGridsForShapes,i,0);
    let rv = rvs.v;//*0.001;
    let dim0 = Math.abs(i-no2)/no2;
    let dim = rv*delta;
    let stripe = this.rectP.instantiate();
    let pos = v? Point.mk((i/n) * wd-0.5*wd,0):Point.mk(0,(i/n) * ht-0.5*ht)
    this.set((v?'v':'h')+'stripe'+i,stripe);
    stripe.moveto(pos);
    stripe.fill = 'white';
  }
  this.updateStripes(n,ornt,minWd,maxWd);
 }
    
  

rs.updateStripes = function (n,ornt,minWd,maxWd) {
  let {width:wd,height:ht} = this;
  let delta = maxWd;// - minWd;
  let v = ornt === 'vertical';
  let rw = v?0:1;
  let no2 = n/2;
  for (let i=0;i<n;i++) {
    let stripe = this[(v?'v':'h')+'stripe'+i];
    let rvs = this.randomValuesAtCell(this.randomGridsForShapes,i,0);
    let rv = rvs.v;//*0.002;
    let dim = rv*delta;
    stripe.width = v?Math.max(dim,0):wd;
    stripe.height =v?ht:Math.max(dim,0);
    let pos = v? Point.mk((i/n) * wd-0.5*wd,0):Point.mk(0,(i/n) * ht-0.5*ht);
    stripe.moveto(pos);
    stripe.update();
  }
 }
    

let nr = 64;
let nc = 100;
let wd = 200;
let topParams = {saveState:0,numRows:2,numCols:nc,width:wd,height:wd,framePadding:0.15*wd};

Object.assign(rs,topParams);

rs.computeState  = function () {
   return [["randomGridsForShapes",this.randomGridsForShapes]];
}

rs.initialize = function () {
   this.initProtos();
   this.addFrame();
   let {width:wd,height:ht,numCols:nc,saveState} = this;
   let fr =0.005;
   if (saveState) {
     this.setiupRandomGridForShapes('v',{step:fr*10,stept:fr*10,min:-fr*100,max:0.9*fr*100});
     this.saveTheState();
     this.mkStripes(nc,'vertical',0,wd/50);
     this.mkStripes(nc,'horizontal',0,ht/50);

   } else  {
    this.getTheState(() => {
       this.mkStripes(nc,'vertical',0,wd/50);
       this.mkStripes(nc,'horizontal',0,ht/50);
       this.addFrame();  
         dom.svgDraw();
    });
   }
}


export {rs};


