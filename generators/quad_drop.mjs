
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addQuadMethods} from '/mlib/quadTree.mjs';	
import {rs as addDropMethods} from '/mlib/drop.mjs';	

let rs = basicP.instantiate();
addQuadMethods(rs);
addDropMethods(rs);
rs.setName('quad_drop');

let wd = 1000;
let topParams = {width:wd,height:wd,gap:.1,fractal:0,framePadding:0.1*wd}
Object.assign(rs,topParams);

let quadParams = {levels:4,chance:0.8,alwaysSplitBefore:2}

rs.dropParams = {dropTries:3500,maxDrops:1000000}
rs.dropParams = {dropTries:35,maxDrops:10000}

rs.initProtos = function () {
  this.circleP =  circlePP.instantiate();
  this.circleP.stroke = 'white';
  this.circleP.fill = 'white';
  this.circleP['stroke-width'] =.15; 
  this.rectP =  rectPP.instantiate();
  this.rectP.stroke = 'white';
  this.rectP.fill = 'transparent';
  this.rectP['stroke-width'] = .15;
   this.lineP =  linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP.fill = 'transparent';
  this.lineP['stroke-width'] =1;//.15;
} 

const URish = function (where) {
 let ln = where.length;
 if (ln===0) {
  return 0;
 }
 let lst = where[ln-1];
 return (lst ==='UL')||(lst === 'LR');
}
rs.splitHere = function (qd) {
  debugger;
  let params = qd.root.params;
  let {fractal} = this;
  if (!fractal) {
    return this.randomSplit(qd,params);
  }
  let {levels} = params;
  let {where} = qd;
  let d = where.length;
  return (d<=levels) && !URish(where); 
}

rs.displayCell = function (qd,depth) {
  let {ishapes,cells,rectP,gap} = this;
  cells.push(qd);
  let rect = qd.rectangle;
  let rs = rect.toShape(rectP,1-gap);
  ishapes.push(rs);
}

rs.initialDrop = function() {
  let {width:wd,height:ht,gap} = this;
  this.cells = [];
  this.ishapes = [];
  let r = Rectangle.mk(Point.mk(-0.5*wd,-0.5*ht),Point.mk(wd,ht));
  let qd = {rectangle:r};
  this.extendQuadNLevels(qd,quadParams);
    this.displayQuad(qd);
  debugger;
  let geoms = this.cells.map((qd) => {
    let r = qd.rectangle;
    let d = qd.where.length;
    let sr = r.scaleCentered(1-gap);
    qd.scaledRectangle = sr;
    return sr;
  });
  this.igeoms = [...geoms];
  return {geometries:geoms,shapes:this.ishapes};
}

rs.generateDrop = function (p) {
  const inWhichQuad = (p) => {
    debugger;
    let cells = this.cells;
    let ln = cells.length;
    for (let i=0;i<ln;i++) {
      let cell =cells[i];
      let sr = cell.scaledRectangle;
      if (sr.containsPoint(p)) {
        return cell;
      }
    }
    debugger;
  }
  let p0 = Point.mk(0,0);
  let qd = inWhichQuad(p);
  if (!qd) {
    return;
  }
  let which = qd.which;
  if (!which) {
    which = qd.which = (Math.random()<0.5)?'circles':'lines';
   }
  let dp = qd.where.length;
  let {circleP} = this;
  let crc = Circle.mk((dp%3)?5:10);
  let crcs = crc.toShape(circleP,.5);
  let seg = LineSegment.mkAngled(p0,0,5);
  let angle = 0;
  let lseg = LineSegment.mkAngled(p0,angle,length+10);
  let ln = seg.toShape(this.lineP);
  if (dp % 2) {
    crcs.fill = 'blue';
    ln.stroke = 'blue';
  }
  return  (which==='circles')?{geometries:[crc],shapes:[crcs]}:{geometries:[lseg],shapes:[ln]};
  }

rs.initialize = function () {
  let {width:wd,height:ht,dropParams} = this;
  this.addFrame();
  this.initProtos();
  debugger;
    let drops =  this.generateDrops(dropParams);
  return;
  let r = Rectangle.mk(Point.mk(-0.5*wd,-0.5*ht),Point.mk(wd,ht));
  let qd = {rectangle:r};
  this.extendQuadNLevels(qd,quadParams);
  let shapes = this.set('shapes',arrayShape.mk());

  this.displayQuad(qd);
}	

export {rs};

      

