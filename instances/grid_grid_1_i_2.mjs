
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as generatorP} from '/generators/grid_grid_1.mjs';

let rs = generatorP.instantiate();
rs.setName('grid_grid_1_i_2');
let wd = 400;
let nr = 20;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:10,innerRows:7};

Object.assign(rs,topParams);

rs.initProtos = function () {
  let {innerWidth} = this;
  let rectP1 = this.rectP1 = rectPP.instantiate();
  rectP1['stroke-width'] = 0;
  rectP1.fill = 'rgba(255,255,255,0.5)';
  let rectP2 = this.rectP2 = rectPP.instantiate();
  rectP2['stroke-width'] = 0;
  rectP2.fill = 'rgba(0,0,255,0.5)';
  rectP1.width = 1.9*innerWidth;
  rectP1.height = 1.9*innerWidth; 
  rectP2.width = 1.9*innerWidth;
  rectP2.height = 1.9*innerWidth;
}
  
rs.initializeInstance = function () {
  core.root.backgroundColor = 'black';
}

export {rs};

 