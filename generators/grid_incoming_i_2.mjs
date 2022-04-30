//core.require('/shape/line.js','/shape/circle.js','/shape/rectangle.js','/gen0/basics.js','/mlib/grid.js','/mlib/boundedRandomGrids.js',

//function (linePP,circlePP,rectPP,rs,addGridMethods,addRandomMethods) {

import {rs} from '/generators/grid_incoming.mjs';

let grid1 = rs.grid1;
let grid2 = rs.grid2;
let pj = 5;
grid1.pointJiggle = pj;
grid2.pointJiggle = pj;

rs.setName('grid_incoming_i_2');
	
export {rs};


