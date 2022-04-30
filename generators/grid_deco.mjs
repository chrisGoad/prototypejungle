//active
//core.require('/gen0/GridLinesRandom.js',
//core.require('/shape/rectangle.js','/shape/line.js','/shape/circle.js','/shape/polygon.js','/gen0/GridLinesRandom.js',
//function (rs)	{ 
//function (rectPP,linePP,circlePP,polygonPP,GridLinesRandomP)	{ 
//core.require('/shape/line.js','/shape/circle.js','/shape/rectangle.js','/gen0/basics.js','/mlib/grid.js','/mlib/boundedRandomGrids.js','/mlib/ParamsByCell.js',


import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addParamsByCellMethods} from '/mlib/ParamsByCell.mjs';

let rs = basicsP.instantiate();

//function (linePP,circlePP,rectPP,rs,addGridMethods,addRandomMethods,addParamsByCellMethods) {
  debugger;	//this.initProtos();
  addGridMethods(rs);
  addRandomMethods(rs);
  addParamsByCellMethods(rs);

//let sqd = 128;
let sqd = 48;
sqd = 16;
let ar = 2;
/* in 0_8, parameters can be associated with cells */
rs.paramsByCell = null;
rs.paramsByRow = null;
rs.paramsByCol = null;

let topParams = {randomizeOrder:0,orderByOrdinal:1,width:300,height:300,pointJiggle:0,backFill:'black',numRows:64,numCols:64,ordinalMap:[0,1,2,3,4,5,6]};

Object.assign(rs,topParams);

let oo = 0.1;
let b = 255;
let r = 255;
rs.pByC = {
	opacityMap:{0:oo,1:oo,2:1,3:oo,4:oo,5:oo,6:oo},
//	widthFactor:2,
	widthFactor:1,
//	heightFactor:2,
	heightFactor:1,
	sizePower:2,
	maxSizeFactor:4,
	genCircles: 0,
	randomizingFactor:0,
	colorMap:{
//0:(r,g,b,opacity) => `rgba(100,100,100,${opacity})`,
0:`rgba(0,150,0,${oo})`,
1:(r,g,b,oo) => `rgba(150,150,150,${oo})`,
2:`rgba(200,200,200,${oo})`,
//2:`rgba(255,255,255,${oo})`,
3:`rgba(0,${b},${b},${oo})`,
//3:`rgba(0,255,255,${oo})`,
4:`rgba(0,0,${r},${oo})`,
5:`rgba(0,0,0,${oo})`,
6:`rgba(${r},${r},0,${oo})`},
//sizeMap:{0:1,1:0,2:0,3:0,4:0,5:0,6:0}
sizeMap:{0:2,1:2,2:2,3:3,4:4,5:0,6:0}
};


rs.paramsByCelll = function (cell) {
  return this.pByC;
}

rs.initProtos = function () {
	
	this.rectP = rectPP.instantiate();
	this.rectP.fill = 'blue';
  this.rectP['stroke-width'] = 0;
	
}  

rs.initialize = function () {
	this.initProtos();
  this.pByC.shapeProto = this.rectP;
  this.generateGrid();
}

export {rs};

/*
rs.getParam = function (cell,prop) {
	let {paramsByCell,paramsByRow,paramsByCol,globalParams,numRows} = this;
	let {x,y} = cell;
	let params,propv;
	//debugger;
	if (paramsByCell) {
		params = this.paramsByCell(cell);
	} else if (paramsByRow) {
		 let ln = paramsByRow.length;
		 if (y < ln) {
			 params = paramsByRow[y];
		 }
	}
	if (params) {
		propv = params[prop]
	}
	if (propv) {
		return propv;
	}
	return globalParams[prop]
}
return rs;
rs.getParams = function (cell,props) {
	let ps  = {};
	props.forEach((prop) => {
		let pv = this.getParam(cell,prop);
		ps[prop] = pv;
	});
	return ps;
}
		
			 
		

rs.pByC = {randomizingFactor:0,sizePower:2,widthFactor:1,heightFactor:1,maxSizeFactor:2,genCircles:0,genPolygons:0,
	 opacityMap:{0:0.4,1:0.4,2:0.4,3:0.4,4:0.4,5:0.4,6:0.4},
	  colorMap:{0: (r,g,b,opacity) => `rgba(${r},0,0,${opacity})`,
	            1: (r,g,b,opacity) => `rgba(${r},0,0,${opacity})`,
		          2:(r,g,b,opacity) => `rgba(255,255,255,${opacity})`,
	            3:(r,g,b,opacity) => `rgba(0,${b},${b},${opacity})`,
		          4:(r,g,b,opacity) => `rgba(255,255,255,${opacity})`,
		          5:(r,g,b,opacity) => `rgba(255,255,255,${opacity})`,
	            6:(r,g,b,opacity) => `rgba(255,255,255,${opacity})`},
		sizeMap: {0:1,1:1,2:1,3:1,4:1,5:1,6:1},
		};
let wd = 300;
let topParams = {saveImage:true,numRows:ar*sqd,numCols:ar*sqd,width:wd,height:wd,backFill:'rgb(200,2,2)',backgroundPadding:0.1*wd,pointJiggle:3,
ordinalMap: {0:0,1:1,2:2,3:3,4:4,5:4,6:6,7:7}}

Object.assign(rs,topParams);



const numPowers = function(n,p) {
	if (n === 0) {
		return 0;
	}
	if (n === p) { 
	  return 1;
	}
	if (n%p === 0) {
		return 1 + numPowers(n/p,p);
	}
	return 0;
}
rs.numPowers = function (n,p) {
	return numPowers(n,p);
}

rs.sizeFactor = function ( cell) {
	let numRows = this.numRows;
	let {x,y} = cell;
	if ((x===63) && (y===63)) {
		debugger;
	}
	let szPower = this.getParam(cell,'sizePower');
	let maxSizeFactor = this.getParam(cell,'maxSizeFactor');
	//let px = numPowers(x+1,szPower);
	let px = numPowers(x,szPower);
	let sf;
	if (numRows === 1) {
		sf = Math.min(px,maxSizeFactor);
	} else {
  	//let py = numPowers(y+1,szPower);
  	let py = numPowers(y,szPower);
	  sf =  Math.min(px,py,maxSizeFactor);
	}
	//console.log('x',x,'sf',sf);
	return sf;
}


rs.colorSetter = function (shape,fc,cell) {
	let colorMap = this.getParam(cell,'colorMap');
	if (!colorMap) {
		debugger;
	}
	let opacityMap = this.getParam(cell,'opacityMap');
	let r = 200 + Math.random() * 55;
	let g = 100 +Math.random() * 155;
	let b = 100 + Math.random() * 155;
	//console.log('fc' , fc);
	r = 225;
	g = 170;
	b = 170;
	let colorF = colorMap[fc];
	let opacity = opacityMap[fc];
	let fill = colorF(r,g,b,opacity,cell);
	if (shape.setFill) {
		shape.setFill(fill);
	} else {
	  shape.fill = fill;
	}
	//console.log(fill);
}


rs.ordinalGenerator = function (cell) {
	let fc = this.sizeFactor(cell);
	return this.ordinalMap[fc];
}

const interpolate = function (low,high,fr) {
	return low + fr * (high - low);
}	

//let ranRows = undefined;//[8,16];
rs.computeSize = function (cell) {
	let {numCols,numRows,deltaX,deltaY} = this;
	let {x,y} = cell;
	if ((x===40) && (y===2000)) {
//		debugger;
	}
	let propVs = this.getParams(cell,['randomizingFactor','sizeMap','sizePower','widthFactor','heightFactor']);
	let {randomizingFactor,sizeMap,sizePower,widthFactor,heightFactor} = propVs;
	
  let fc = this.sizeFactor(cell);
	//console.log('cell',cell.x,cell.y,'fc',fc);
	let szf = sizeMap[fc]
  let numPy = numPowers(cell.y,sizePower);
	let szfy = sizeMap[numPy];
	//if ((!ranRows) || (ranRows.indexOf(cell.y)>-1)) {
	if (randomizingFactor) {
	//	console.log('szf',szf,'szfy',szfy,'numPy',numPy);
		//debugger;
		let hszf = 1.0*szf;
	  szf = Math.max(hszf,szf*(1-randomizingFactor)   + szfy*randomizingFactor * Math.random());
	}
	let wf = widthFactor;
	let hf = heightFactor;
	return {x:szf * wf,y:szf*hf,fc:fc};
}

rs.lookupSize = function (cell) {
	let {numRows,sizeValues} = this;
	let {x,y} = cell;
	let indx = x*numRows + y;
	return sizeValues[indx];
}

rs.computeSizes = function () {
	let {numRows,numCols} = this;
	let numvals = numRows*numCols;
	let vls = [];
	for (let i=0;i<numCols;i++) {
	   for (let j=0;j<numRows;j++) {
			 let cell={x:i,y:j};
			 let sz = this.computeSize(cell);
			 vls.push(sz);
	  }
	}
	return vls;
}


rs.computeValuesToSave = function () {
	let vl = this.computeSizes();
	let vls = [[['sizeValues'],vl]];
	this.sizeValues = vl;
	return vls;
}

rs.setDims = function (shape,width,height) {
	if (shape.setDims) {
		shape.setDims(width,height);
	} else {
		shape.width = width;
		shape.height = height;
	}
}

rs.shapeUpdater = function (shape,rvs,cell,center) {
	let {shapes,rectP,circleP,deltaX,deltaY,numRows,numCols,sizeValues,width,height} = this;
	let propVs = this.getParams(cell,['randomizingFactor','genCircles','sizeMap','widthFactor','heightFactor','genCircles','genPolygons']);
	let {randomizingFactor,sizeMap,widthFactor,heightFactor,genCircles,genPolygons} = propVs;
	let sz;
	if (!shape) {
		degbugger;
	}
	if ((cell.x === 29)&& (cell.y === 15)) {
	//	debugger;
	}
	if (sizeValues) {
		sz = this.lookupSize(cell);
	} else {
		sz = this.computeSize(cell);
	}
	if (sz.x === 0) {
		shape.hide();
		return;
	}
	if (genPolygons) {
		let corners = this.cellCorners(cell);
		let mcnt = center.minus();
		let rCorners = this.displaceArray(corners,mcnt);
		let sCorners = this.scaleArray(rCorners,sz.x,sz.y);
		shape.corners = sCorners;
	  this.colorSetter(shape,sz.fc,cell);
		shape.update();
		return shape;
	}
	if (genCircles) {
		let corners = this.cellCorners(cell);
	  let c0 = corners[0];
	  let c1 = corners[1];
	  let c2 = corners[2];
	  let c3= corners[3];
	  let deltaX = Math.abs(c0.x - c1.x);
	  let deltaY = Math.abs(c0.y - c3.y);
		this.colorSetter(shape,sz.fc,cell);
   	shape.dimension = Math.min(deltaX,deltaY)* (sz.x);
		return shape;
	}

//	let cellLeftX = cellCenterX - 0.5*sz.x;
//	let gridLeftX= -0.5*width;
	let fszx = deltaX * (sz.x);
	let cellCenterX = (-0.5*width) + (cell.x +0.5)* deltaX;
	let cellLeftX = cellCenterX - 0.5*sz.x;
	let gridLeftX= -0.5*width;
	let nshape;
	if (cellLeftX < gridLeftX) {
		let chopX = gridLeftX - cellLeftX;
		fszx = deltaX * (sz.x) - 2*chopX;
	}
	let cellRightX = cellCenterX + 0.5*deltaX* (sz.x);
	let gridRightX= 0.5*width;
  if (cellRightX > gridRightX) {
		let chopX = cellRightX - gridRightX;
		fszx = deltaX*(sz.x) - 2*chopX;
	}	
	if (genCircles) {
		shape.dimension = deltaX * (sz.x);
	} else {
		this.setDims(shape,fszx,deltaY*(sz.y));
	}
	 // shape.width = fszx;
	 // shape.height= sz.y;
	//}
	this.colorSetter(shape,sz.fc,cell);
	if (nshape) {
		nshape.update();
	} else {
	  shape.update();
	}
	return nshape;
}

rs.shapeGenerator = function (rvs,cell,center) {
	let {shapes,rectP,circleP,polygonP} = this;
	if (this.hideThisCell(cell)) {
	  let {x,y} = cell;
		console.log('hideCell',x,y);
		return;
	}
	let genCircles = this.getParam(cell,'genCircles');
	let genPolygons = this.getParam(cell,'genPolygons');
	let shape = genCircles?circleP.instantiate():
	    (genPolygons?polygonP.instantiate():rectP.instantiate());
	// shapes.push(shape);
	shape.show();
	//this.shapeUpdater(shape,rvs,cell,center);
	return shape;
}




rs.initProtos = function () {
	this.rectP = rectPP.instantiate();
	this.rectP.fill = 'blue';
	
}  

rs.initialize = function () {
	this.initProtos();
  this.pByC.shapeProto = this.rectP;
	this.generateGrid();
}




rs.toFun = function (v) {
	return () => v;
}
export {rs};

*/

