import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_all_0');
let ht= 1000;
let topParams = {width:ht,height:ht,framePadding:0.1*ht,sqdim:0.14*ht,sqoff:0.14*ht,sqfill:'rgba(30,30,60)'}
Object.assign(rs,topParams);

rs.dropParams = {dropTries:150,scale:0.5,maxDrops:10000,radius:50}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'transparent';
  circleP.stroke = 'white';
  circleP['stroke-width'] =0.6;
  let circleP2 = this.circleP2 = circlePP.instantiate();
  circleP2.fill = 'white';
  circleP2.stroke = 'white';
  circleP2['stroke-width'] =0;
  let rectP = this.rectP = rectPP.instantiate();
  rectP.fill = 'transparent';
  rectP.stroke = 'white';
  rectP['stroke-width'] = 0.6;
  let rectP2= this.rectP2 = rectPP.instantiate();
  rectP2.fill = 'white';
  rectP2.fill = 'transparent';
  rectP2.fill = 'white';
  rectP2.stroke = 'white';
  rectP2['stroke-width'] = 0;
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 1;; 
}

rs.generateDrop= function (p) {
  let {height:ht} = this;
  let p0 = Point.mk(0,0);
  let rd;
  let hht = 0.5*ht;
  let {x,y} = p;
  let xa = x + hht;
  let ya = y + hht;
  let hSizes = [0,3,0,5,0,9,0];
  let vSizes = [0,9,0,5,0,3,0];
  let hTypes = [0,'hline',0,'hline',0,'hline'];
  let vTypes = [0,'vline',0,'vline',0,'vline'];
  let numS = hSizes.length;
  let strh = Math.floor((numS*ya)/ht);
  let strv = Math.floor((numS*xa)/ht);
  const inStripe = (horizontal) => {
    let xory = horizontal?ya:xa;
    return Math.floor((numS*xory)/ht);
  }
  let vsz = vSizes[strv];
  let hsz = hSizes[strh];
  let vtp = vTypes[strv];
  let htp = hTypes[strh];
  let rnd = 3+10*Math.random();
  let isCircle =0;
  let isRect = 0;
  let isLsg = 0;
  let tp;
  const toSolid = (tp) => {
    if (tp==='hline') {
      return 'srect';
    }
    if (tp==='vline') {
      return 'scircle'
    }
    return tp;
  }
    
  if (hsz && vsz) {
    if ((strv===3)||(strh===3)) {
      debugger;
        htp = toSolid(htp);
        vtp = toSolid(vtp);
      }
    tp =  (Math.random()<0.5)?htp:vtp;
  } else if (hsz) {
    rd = hsz;
    tp = htp;
  } else if (vsz) {
    rd = vsz;
    tp = vtp;
  }  else {
    return;
  }
  //console.log('xa',xa,'ya',ya,'strh',strh,'strv',strv,'hsz',hsz,'vsz',vsz,'radius',rd);
  let geom,shp;
   if ((tp === 'hline')||(tp==='vline')) {
    debugger;
    let angle = (tp==='hline'?0:Math.PI/2) +0.2 * (Math.random() - 0.5) *Math.PI;
    let length = 30;
    geom =   LineSegment.mkAngled(p0,angle,length);
    shp = geom.toShape(this.lineP);
  } else if ((tp === 'rect') || (tp === 'srect')) {
    geom = Rectangle.mk(Point.mk(-rnd,-rnd),Point.mk(2*rnd,2*rnd));
    shp = geom.toShape(tp === 'srect'?this.rectP2:this.rectP);
  } else {
    geom = Circle.mk(rnd);
    geom.isDisk = tp ===  'scircle';
    shp = geom.toShape(tp==='scircle'?this.circleP2:this.circleP);
  }

  return {geometries:[geom],shapes:[shp]}
}

rs.initialize = function () {
  let {sqdim,sqoff,sqfill} = this;
  this.initProtos();
  let {circleP,dropParams} = this;
  this.addFrame();
  this.addRectangle({width:sqdim,height:sqdim,position:Point.mk(-sqoff,-sqoff),stroke_width:0,fill:sqfill});
  this.addRectangle({width:sqdim,height:sqdim,position:Point.mk(sqoff,-sqoff),stroke_width:0,fill:sqfill});
  this.addRectangle({width:sqdim,height:sqdim,position:Point.mk(-sqoff,sqoff),stroke_width:0,fill:sqfill});
  this.addRectangle({width:sqdim,height:sqdim,position:Point.mk(sqoff,sqoff),stroke_width:0,fill:sqfill});
  let drops =  this.generateDrops(dropParams);
}

export {rs};



