
import {rs as generatorP} from '/generators/grid_distortion_field.mjs';

let rs = generatorP.instantiate();

rs.setName('grid_distortion_field_warped');

let nr = 40;
let dim = 400;
let topParams = {frameWidth:1.7*dim,frameHeight:1.35*dim,frameStrokee:'white',framePos:Point.mk(170,170)};

Object.assign(rs,topParams);

let root2 = Math.sqrt(2);

rs.positionMethod = function(i,j) {
  let {width,height,numRows,numCols} = this;
  let hnr  = numRows/2;
  let di = i - hnr;
  let dj = j - hnr;
  let fromMiddle = Math.sqrt(di*di + dj*dj);
  let fr = fromMiddle/(root2*hnr);
  let d = 200;
  let displacement = Point.mk(d,d).times(fr);
  let cellht = height/numRows;
  let cellwd = width/numCols;
  let frd = 1.4;
  let cwd = frd*width; // current width
  let ccellwd = frd*cellwd; // currect width of a cell
  let rs = Point.mk(-0.5*cwd + j*ccellwd,-0.5* height + i*cellht).plus(displacement);;
  return rs;
 }

export {rs};


