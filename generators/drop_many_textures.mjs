import {rs as circlePP} from '/shape/circle.mjs';
import {rs as linePP} from '/shape/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/newDrop.mjs';

let rs = basicP.instantiate();
addDropMethods(rs);

rs.setName('drop_many_textures');
let ht= 1000;
let topParams = {width:ht,height:ht,numRows:4,numCols:4}
Object.assign(rs,topParams);

let dropParams = {dropTries:150,radius:60,maxDrops:10000,maxLoops:100000}

rs.initProtos = function () {
  let circleP = this.circleP = circlePP.instantiate();
  circleP.fill = 'transparent';
  circleP['stroke-width'] = 3;
  circleP.stroke = "black";
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP['stroke-width'] = 3; 
}  


rs.segParams = function (np) {
  let r = Math.random();
 // let np = 4;
  let angle = (np === -1)?Math.PI/2:Math.floor(r*np)* (Math.PI/np)
  let length = 30;// + Math.floor(r*np)*4;
  return {angle,length};
} 	

rs.whichSquare = function (p) {
  let {width:wd,height:ht,numRows:nr,numCols:nc} =this;
  debugger;
  let hht = 0.5*ht;
  let hwd = 0.5*wd;
  let wc = Math.floor((nc*(p.x + hwd))/wd);
  let wr = Math.floor((nr*(p.y + hht))/ht);
  return {row:wr,col:wc};
 } 
  
rs.generateDrop = function (p) {
   debugger;
   let p0 = Point.mk(0,0);
   let ws = this.whichSquare(p);
   let wr = ws.row;
   let wc = ws.col;
   let sp = this.segParams(wc===1?1:(wc===2?2:4));
   let {angle,length} = sp
   let crc = Circle.mk((wc+1)*10);
   let seg = LineSegment.mkAngled(p0,angle,length);
   let lseg = LineSegment.mkAngled(p0,angle,length+10);
   let ln = seg.toShape(this.lineP);
   let crcs = crc.toShape(this.circleP,0.5);
   crcs.fill = 'white';
   crcs.stroke = 'blue';
  if ((wr+wc)%2) {
    return {geometries:[crc],shapes:[crcs]};
  } else {
   return {geometries:[lseg],shapes:[ln]};
  }
}

rs.initialize = function () {
  this.initProtos();
  let {numCircles,circleP} = this;
  debugger;
  this.generateDrops(dropParams);
}

export {rs};


