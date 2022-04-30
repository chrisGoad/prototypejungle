
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as generatorP} from '/generators/grid_grid_1.mjs';

let rs = generatorP.instantiate();
rs.setName('grid_grid_1_i_3',13);
let wd = 400;
let nr = 20;
let topParams = {saveState:0,width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:10,innerRows:5,backgroundColor:'rgb(0,0,100)',backStripeWidth:1.15*wd,backStripeHeight:1.15*wd,backStripeVisible:0};

Object.assign(rs,topParams);

rs.initProtos = function () {
  let {innerWidth} = this;
  let rectP1 = this.rectP1 = rectPP.instantiate();
  rectP1['stroke-width'] = 0;
  rectP1.fill = 'rgba(255,255,255,0.5)';
  rectP1.fill = 'white';
 // rectP1.fill = 'pink';
  let rectP2 = this.rectP2 = rectPP.instantiate();
  rectP2['stroke-width'] = 0;
  rectP2.fill = 'rgba(0,0,255,0.5)';
  rectP2.fill = 'white';
  rectP2.fill = 'pink';
 //rectP2.fill = 'rgb(100,100,250)';
  rectP1.width = .2*innerWidth;
  rectP1.height = .2*innerWidth;  
  rectP1.width = .5*innerWidth;
  rectP1.height = .5*innerWidth; 
  rectP2.width = .9*innerWidth;
  rectP2.height = .9*innerWidth;
}

rs.decider = function (rvs,cell) {
  let {numRows} = this;
  let hnr = numRows/2;
  return (cell.x+cell.y) % 2 === 0;
  return  cell.x < hnr;
}

rs.decider = function (rvs,cell) {
  return Math.random() < 0.5;
  let {numRows} = this;
  let hnr = numRows/2;
  return (cell.x+cell.y) % 2 === 0;
  return  cell.x < hnr;
}
  
  
rs.initializeInstance = function () {
  core.root.backgroundColor = 'rgb(0,0,0)';
  this.addFrame();
  this.addBackground();
}

export {rs};

 