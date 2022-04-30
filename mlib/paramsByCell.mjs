

const rs = function (rs)	{ 

//let sqd = 128;
let sqd = 48;
sqd = 16;
let ar = 2;
// in 0_8, parameters can be associated with cells 
rs.paramsByCell = null;
rs.paramsByRow = null;
rs.paramsByCol = null;

rs.getParam = function (cell,prop) {
 // debugger;
	let {paramsByCell,paramsByRow,paramsByCol,globalParams,numRows} = this;
	let {x,y} = cell;
	let cellParams,rowParams,propv;
	//debugger;
	if (paramsByCell) {
		cellParams = this.paramsByCell(cell);
	}
  if (paramsByRow) {
   let ln = paramsByRow.length;
   if (y < ln) {
     rowParams = paramsByRow[y];
   }
	}
	if (cellParams) {
		propv = cellParams[prop]
	}
	if (propv !== undefined) {
		return propv;
	}
  if (rowParams) {
    propv == rowParams[prop]
  }
	return propv!==undefined?propv:globalParams[prop]
}

rs.getParams = function (cell,props) {
	let ps  = {};
	props.forEach((prop) => {
		let pv = this.getParam(cell,prop);
		ps[prop] = pv;
	});
	return ps;
}
		
			 
	


rs.sizeFactor = function ( cell) {
	let numRows = this.numRows;
	let {x,y} = cell;
	let szPower = this.getParam(cell,'sizePower');
	let maxSizeFactor = this.getParam(cell,'maxSizeFactor');
	let px = this.numPowers(x,szPower);
	let sf;
	if (numRows === 1) {
		sf = Math.min(px,maxSizeFactor);
	} else {
  	let py = this.numPowers(y,szPower);
	  sf =  Math.min(px,py,maxSizeFactor);
	}
	//console.log('x',x,'sf',sf);
	return sf;
}


rs.colorSetter = function (shape,fc,cell) {
  debugger;
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

rs.globalParams = {randomizingFactor:0,sizePower:2,widthFactor:1,heightFactor:1,maxSizeFactor:2,genCircles:0,genPolygons:0,
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

rs.colorSetter = function (shape,fc,cell) {
  //debugger;
	let colorMap = this.getParam(cell,'colorMap');
	if (!colorMap) {
		debugger;
	}
	let colorF = colorMap[fc];
  let fill = ((typeof colorF) === 'string')?colorF:colorF(cell);
	if (shape.setFill) {
		shape.setFill(fill);
	} else {
	  shape.fill = fill;
	}
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
	//debugger;
	let {x,y} = cell;
	if ((x===40) && (y===2000)) {
//		debugger;
	}
	let propVs = this.getParams(cell,['randomizingFactor','sizeMap','sizePower','widthFactor','heightFactor']);
	let {randomizingFactor,sizeMap,sizePower,widthFactor,heightFactor} = propVs;
	
  let fc = this.sizeFactor(cell);
	let szf = sizeMap[fc]
  let numPy = this.numPowers(cell.y,sizePower);
	let szfy = sizeMap[numPy];
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

let centerLengths = [0,0,0,0,0,0]
rs.setDims = function (cell,shape,wdf,htf,fc) { // scale the shape to fit the cell, then scale it by wdf, htr 
  debugger;  
  let corners = this.cellCorners(cell);
  let c0 = corners[0];
  let c1 = corners[1];
  let c2 = corners[2];
  let c3= corners[3];
  /*let p11 = this.pointAt(pnts,x,y);
	let p12 =  this.pointAt(pnts,x,y+1);
	let p21 =  this.pointAt(pnts,x+1,y);
	let p22 =  this.pointAt(pnts,x+1,y+1);
  	let corners = [p11,p21,p22,p12];
*/
  let xd = c0.distance(c1);
  let yd = c0.distance(c3);
 // console.log('x',cell.x,'y',cell.y,'fc',fc,'xd',xd,'yd',yd,'wdf',wdf,'htf',htf);
  if (xd > 10) {
    debugger;
  }
  let nm = shape.shape_name;
  if (nm === 'rectangle') {
    shape.width = wdf * xd;
    shape.height = htf * yd;
  } else if (nm === 'circle') {
    shape.dimension = wdf * Math.min(xd,yd);
  } else if (nm === 'polygon') {
    let center = c0.plus(c2).times(0.5);
    let cl = center.length();
    let clsf = centerLengths[fc];
    centerLengths[fc] = Math.max(cl,clsf);
    console.log('fc',fc,'center length',centerLengths[fc]);
    let rCorners = this.displaceArray(corners,center.times(-1));
		let sCorners = this.scaleArray(rCorners,wdf,htf);
		//let sCorners = this.scaleArray(rCorners,sz.x,sz.y);
		shape.corners = sCorners;
  }
	shape.show();
  shape.update();
  return shape;
}


rs.shapeUpdater = function (shape,rvs,cell,center) {
	let {shapes,rectP,circleP,deltaX,deltaY,numRows,numCols,sizeValues,width,height} = this;
	//debugger;
	let propVs = this.getParams(cell,['randomizingFactor','genCircles','sizeMap','widthFactor','heightFactor','genCircles','genPolygons']);
	let {randomizingFactor,sizeMap,widthFactor,heightFactor,genCircles,genPolygons,shapeProto} = propVs;
	let sz;
  debugger;
	if (!shape) {
		degbugger;
	}
	if ((cell.x === 29)&& (cell.y === 15)) {
	//	debugger;
	}
	if (sizeValues) {
		sz = this.lookupSize(cell);
	} else {
    //debugger;
		sz = this.computeSize(cell);
	}
  
	if (sz.x === 0) {
		shape.hide();
		return;
	}
	/*if (genPolygons) {
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
    let d0 = c0.distance(c1);
    let d1 = c0.distance(c1);
		this.colorSetter(shape,sz.fc,cell);
   	shape.dimension = Math.min(d0,d1)* (sz.x);
		return shape;
	}*/

	//let fszx = deltaX * (sz.x);
	let fszx = (sz.x);
	/*let cellCenterX = (-0.5*width) + (cell.x +0.5)* deltaX;
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
	}*/
//	if (genCircles) {
//		shape.dimension = deltaX * (sz.x);
//	} else {
		//this.setDims(cell,shape,fszx,deltaY*(sz.y));
	this.setDims(cell,shape,fszx,sz.y,sz.fc);
		//this.setDims(shape,fszx,(sz.y));
//	}
	this.colorSetter(shape,sz.fc,cell);
	shape.update();
	return shape;
}

rs.shapeGenerator = function (rvs,cell,center) {
 debugger;
	//let {shapes,rectP,circleP,polygonP,shapeProto} = this;
  let propVs = this.getParams(cell,['shapeProto']);
	let {shapeProto} = propVs;
	if (this.hideThisCell(cell)) {
	  let {x,y} = cell;
		console.log('hideCell',x,y);
		return;
	}
	//let genCircles = this.getParam(cell,'genCircles');
	//let genPolygons = this.getParam(cell,'genPolygons');
  debugger;
	let shape = shapeProto.instantiate().show();
	//let shape = genCircles?circleP.instantiate():
	//    (genPolygons?polygonP.instantiate():rectP.instantiate());
	//shapes.push(shape);
	//shape.show();
	//this.shapeUpdater(shape,rvs,cell,center);
	return shape;
}


rs.toFun = function (v) {
	return () => v;
}
}

export {rs};



