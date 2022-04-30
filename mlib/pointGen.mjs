
const rs = function (rs) {


rs.ringPoints = function (params) {
 //gen params = {};
/* Object.assign(params,this);
 if (iparams) {
   Object.assign(params,iparams);
 }*/
	let {numRings,radius,pos=Point.mk(0,0),randomFactor = 0,fromAngle=0,toAngle=2*Math.PI,numPointsPerRing=20,ringSeparation} = params;
	let pnts = [];
	let dr = ringSeparation?ringSeparation:radius/numRings;
	let spread = toAngle - fromAngle;
//	let da = (2*Math.PI/numRings)
	let da = spread/numPointsPerRing;
  let rnd = 100;
	let r = radius;
  for (let i = 0;i<numRings;i++) {
		let angle = fromAngle;
	//	for (let j = 0;j<numRings;j++) {
		for (let j = 0;j<numPointsPerRing;j++) {
			let rr = r + randomFactor*(Math.random()-0.5);
			let p = Point.mk( Math.cos(angle)*rr,Math.sin(angle)*rr);
			pnts.push(p.plus(pos));
			angle += da;
		}
		r -= dr;
	}
  return pnts;
}

const ringPoints2PolygonPoints = function (pnts) {
	let ln = pnts.length;
	let pp = [];
	lno2 = ln/2;
	for (let i=0;i<lno2;i++) {
		pp.push(pnts[i]);
	}
	for (let i=ln-1;i>=lno2;i--) {
		pp.push(pnts[i]);
	}
	return pp;
}

rs.rings2polygon = function (pnts) {
	let ppnts = ringPoints2PolygonPoints(pnts);
	let pgon = polygonPP.instantiate();
	pgon.corners = ppnts;
	return pgon;
}


rs.randomWalkPoints = function (params) {
	let {initialPos,initialDirection,width,step,delta,numSteps}  = params;
	let cpos = initialPos;
	let sidepos;
	let cdir = initialDirection;
	let pnts = [];
	let sidepnts = [];
	for (let i=0;i<=numSteps;i++) {
		let unitvec = Point.mk(Math.cos(cdir),Math.sin(cdir));
    let toside = (unitvec.normal()).times(-width);
    let along = unitvec.times(step);
    let next = cpos.plus(along);
		if (!sidepos) {
			sidepos = cpos.plus(toside);
		}
		pnts.push(cpos);
	//	pnts.push(sidepos);
		sidepnts.push(sidepos);
		cpos = next;
		sidepos = next.plus(toside);
		cdir = cdir + delta * (Math.random() - 0.5);
	}
	return pnts.concat(sidepnts);
}
	

const interpolate = function (v0,v1,fr) {
	let d  = v1-v0;
	if (d===0) {
		return v0;
	}
	let rs = v0+fr*d;
	return rs;
}
	

const interpolatePoints = function (end0,end1,fr) {
	let v = end1.difference(end0);	
	let rs = end0.plus(v.times(fr));		
	return rs;
}
	
rs.gridPoints = function (iparams) {
 let params = {};
 	let props = ['width','height','numRows','numCols','left','right','k','missingRows','missingCols','jiggle','pos'];
  core.transferProperties(params,this,props);
  core.transferProperties(params,iparams,props);
	let {width,height,numRows,numCols,left:ileft,right:iright,k=1,missingRows=0,missingCols=0,jiggle=0,pos=Point.mk(0,0)} = params;
	const doJiggle = function (p) {
		if (jiggle) {
			let {x,y} = p;
			let jx = Math.random() * jiggle;
			let jy = Math.random() * jiggle;
			return Point.mk(x+jx,y+jy);
		} else {
			return p;
		}
	}
  let left,right;
	let rs  = [];
//	debugger;
  if (ileft) {
		left = ileft;
		right = iright
	} else {
		
		let hw = 0.5*width;
		let hh = 0.5*height;
		let ul = Point.mk(-hw,-hh).plus(pos);
		let ll = Point.mk(-hw,hh).plus(pos);
		let ur = Point.mk(hw,-hh).plus(pos);
		let lr = Point.mk(hw,hh).plus(pos);
		left = geom.LineSegment.mk(ul,ll);
		right = geom.LineSegment.mk(ur,lr);
	}
	let {end0:left0,end1:left1} = left;
	let {end0:right0,end1:right1} = right;
	//the constant k: the first two points are 1/numCols apart and the last are k*j/numRows 
	// but this leads to a length of greater than the distance from end0 to end1 so we need to scale by kf
	let tln = 0;
	let lns = [];
	let hcols = 0.5*numCols;
	let hrows = 0.5 *numRows;
	//debugger;
	for (let i=0;i<numCols;i++) {
		let cd = (1/numCols) * interpolate(1,k,i/(numCols-1));
		lns.push(tln);
	  tln += cd;
	}
	let kf = 1/tln;
	for (let j=0;j<=numRows;j++) {
		if (Math.abs(j-hrows) >= missingRows) {
			let end0 = interpolatePoints(left0,left1,j/numRows);
			let end1 = interpolatePoints(right0,right1,j/numRows);
			
			for (let i=0;i<numCols;i++) {
				if (Math.abs(i-hcols) >= missingCols) {
					let p = interpolatePoints(end0,end1,kf * lns[i]);
					let jp = doJiggle(p);
					jp.gridc = Point.mk(i,j);
					
					rs.push(jp);
				}
			}
			let jp = doJiggle (end1);
			jp.gridc = Point.mk(numCols,j);

			rs.push(jp);
		}
	}
	return rs;
}

rs.pascalPoints = function (params) {
	let {numRows,rowSep} = this;
	let cy = 0;
	let pnts = [];
	let disp = 0.5*numRows*rowSep;
	for (let i=0;i<numRows;i++) {
		let cx = -i*0.5*rowSep;
		for (let j=0;j<=i;j++) {
			pnts.push(Point.mk(cx,cy-disp));
			cx += rowSep;
		}
		cy += rowSep;
	}
	return pnts;
}
			
		
	
rs.placeShapesAtPoints = function (pnts,shapeP) {
	this.set('shapes',core.ArrayNode.mk());
	pnts.forEach( (p) => {
		let shape = shapeP.instantiate();
		shape.show();
		this.shapes.push(shape);
		shape.moveto(p);
	});
}


}

export {rs};
