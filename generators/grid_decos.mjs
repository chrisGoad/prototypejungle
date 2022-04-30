
//core.require('/ngen1/grid0_deco.js','/gen0/Basics.js',
//core.require('/shape/rectangle.js','/shape/line.js','/shape/circle.js','/gen0/grid0.js','/gen0/lines0.js',
//function (template,basicP)	{ 

import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as gridDecoP} from '/generators/grid_deco.mjs';

let rs = basicsP.instantiate();
	
  
rs.initProtos = function () {
	
	this.rectP = rectPP.instantiate();
	this.rectP.fill = 'blue';
  this.rectP['stroke-width'] = 0;
	
}  

let grid0= rs.set('grid0',gridDecoP.instantiate());
let grid1= rs.set('grid1',gridDecoP.instantiate());
let grid2= rs.set('grid2',gridDecoP.instantiate());

rs.setName('grid_decos');

let topParams = {randomizeOrder:0,orderByOrdinal:1,width:300,height:300,pointJiggle:0,backFill:'black',numRows:64,numCols:64,ordinalMap:[0,1,2,3,4,5,6]};

Object.assign(grid0,topParams);
Object.assign(grid1,topParams);
Object.assign(grid2,topParams);
grid2.numCols = 64+8; 

let oo = 0.7;
let b = 255;
let r = 255;
let pByCT = {
	opacityMap:{0:oo,1:oo,2:1,3:oo,4:oo,5:oo,6:oo},
	widthFactor:2,
	heightFactor:2,
	sizePower:2,
	maxSizeFactor:4,
	genCircles: 0,
	randomizingFactor:0,
	colorMap:{
0:`rgba(0,20,0,${oo})`,
1:`rgba(20,100,20,${oo})`,
2:() => {let rnd = Math.random()*200; return `rgba(${rnd},200,${rnd},${oo})`},
3:`rgba(${b},${b},${b},${oo})`,
4:`rgba(0,${r},0,${oo})`,
5:`rgba(0,0,0,${oo})`,
6:`rgba(${r},${r},0,${oo})`},
sizeMap:{0:2,1:2,2:2,3:0,4:0,5:0,6:0}};

let pByC0 = {}; Object.assign(pByC0,pByCT);
let pByC1 = {}; Object.assign(pByC1,pByCT);


grid2.pByC = pByC1;
grid1.pByC = pByC1;
grid0.pByC = pByC1;

let pbr0 = [];
let pbr1 = [];
let pbr2 = [];
grid2.paramsByRow = pbr2;
grid1.paramsByRow = pbr1;
grid0.paramsByRow = pbr0;
let sw = 0.5;
let ew = 2;
rs.setPbr= function (is1,pbr) {
	let nr = grid1.numRows;
	let nrh = 0.5* nr;
	let v0 = is1?sw:ew;
	let v1 = is1?ew:sw;
	for (let i = 0;i<nrh;i++) {
		let fr = i/nrh;
		pbr[i] = {widthFactor:v1 + fr*(v0-v1),shapeProto:this.rectP};
	}
	for (let i = nrh;i<nr;i++) {
		let fr = (i-nrh)/nrh;
		pbr[i] = {widthFactor:v0 + fr*(v1-v0),shapeProto:this.rectP};
	}
}

/*setPbr(0,pbr0);
//setPbr(1,pbr1);
setPbr(0,pbr1);
setPbr(0,pbr2);  */  
debugger;
rs.initialize = function () {
  debugger;
  this.initProtos();
  this.setPbr(0,pbr0);
  this.setPbr(0,pbr1);
  this.setPbr(0,pbr2);
	let wd = this.grid0.width;
	this.grid0.initialize();
  this.grid1.theShapeOrder = this.grid0.theShapeOrder;
  this.grid1.inverseShapeOrder = this.grid0.inverseShapeOrder;
	this.grid1.initialize();
	this.grid2.initialize();
	let mvp = 1.1;
	this.grid0.moveto(Point.mk(-mvp*wd,0));
	this.grid2.moveto(Point.mk(0,0));
	this.grid1.moveto(Point.mk(mvp*wd,0));
}

export {rs};


