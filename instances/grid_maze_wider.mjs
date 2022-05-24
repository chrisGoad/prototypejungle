
//import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as generatorP} from '/generators/grid_maze.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_maze_wider');
let ht  = 20;
let nr = 25;
let fc = 6;

let topParams = {numCols:fc*nr,numRows:nr,width:fc*ht,height:ht,framePadding:0}

Object.assign(rs,topParams);


export {rs};


