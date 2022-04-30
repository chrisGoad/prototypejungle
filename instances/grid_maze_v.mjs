
import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as generatorP} from '/generators/grid_maze.mjs';

let rs = generatorP;//.instantiate();

rs.setName('grid_maze_v');
let wd  = 200;
let nc = 50;

let topParams = {numCols:nc,numRows:1.5*nc,width:wd,height:1.5*wd,backStripeVisible:0}

Object.assign(rs,topParams);

rs.initProtos = function () {
	core.assignPrototypes(this,'rectP',rectPP);
	this.rectP.fill = 'white';
	this.rectP['stroke-width'] = 0;
	this.rectP.width = 1;
	this.rectP.height = 4;
}  

export {rs};


