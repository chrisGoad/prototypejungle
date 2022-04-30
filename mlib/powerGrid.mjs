

const rs = function (rs)	{ 

//let sqd = 128;
let sqd = 48;
sqd = 16;
let ar = 2;
// in 0_8, parameters can be associated with cells 
rs.powerParamsByCell = null;
rs.paramsByRow = null;
rs.paramsByCol = null;

rs.getParam = function (cell,prop) {
 // debugger;
	let {powerParamsByCell,paramsByRow,paramsByCol,globalParams,numRows} = this;
	let {x,y} = cell;
	let cellParams,rowParams;
	//debugger;
	if (powerParamsByCell) {
		cellParams = this.powerParamsByCell(cell);
	} else {
    cellParams = this.powerParams;
  }
  let propv = cellParams[prop];
  return propv;
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
		
			 
	


rs.sizeFactor = function ( cell,sizeMap) {
 // debugger;
	let numRows = this.numRows;
	let {x,y} = cell;
	let szPower = this.getParam(cell,'root');
	let maxSizeFactor = sizeMap?sizeMap.length:Infinity;
	let px = this.numPowers(x,szPower);
	let py = this.numPowers(y,szPower);
	let sf =  Math.min(px,py,maxSizeFactor);
	//console.log('x',x,'sf',sf);
	return sf;
}


rs.colorSetter = function (shape,ifc,cell) {
  //debugger;
	let fillMap = this.getParam(cell,'fillMap');
	if (!fillMap) {
	//	debugger;
	}
  let ln = fillMap.length;
  let fc = Math.min(ln-1,ifc);
	let colorF = fillMap[fc];
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
	//let propVs = this.getParams(cell,['randomizingFactor','sizeMap','root','widthFactor','heightFactor']);
	let propVs = this.getParams(cell,['randomizingFactor','sizeMap','root','widthFactor','heightFactor']);
	let {randomizingFactor,sizeMap,root,widthFactor,heightFactor} = propVs;
	if (!sizeMap) {
    return;
  }
  let fc = this.sizeFactor(cell,sizeMap);
	let szf = sizeMap[fc];
  let numPy = this.numPowers(cell.y,root);
	let szfy = sizeMap[numPy];
	if (randomizingFactor) {
	//	console.log('szf',szf,'szfy',szfy,'numPy',numPy);
		//debugger;
		let hszf = 1.0*szf;
	  szf = Math.max(hszf,szf*(1-randomizingFactor)   + szfy*randomizingFactor * Math.random());
	}
	let wf = widthFactor?widthFactor:1;
	let hf = heightFactor?heightFactor:1;
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
  //debugger;  
  let corners = this.cellCorners(cell);
  let c0 = corners[0];
  let c1 = corners[1];
  let c2 = corners[2];
  let c3= corners[3];
  let xd = c0.distance(c1);
  let yd = c0.distance(c3);
 // console.log('x',cell.x,'y',cell.y,'fc',fc,'xd',xd,'yd',yd,'wdf',wdf,'htf',htf);
  if (xd > 10) {
   // debugger;
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
  //debugger;
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
  if (sz) {
    if (sz.x === 0) {
      shape.hide();
      return;
    }
    this.setDims(cell,shape,sz.x,sz.y,sz.fc);
  }
	this.colorSetter(shape,sz.fc,cell);
	shape.update();
	return shape;
}

rs.toFun = function (v) {
	return () => v;
}
}

export {rs};



