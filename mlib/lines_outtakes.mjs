//active
//core.require('/shape/rectangle.js',function (addAnimationMethods,rectangleP) {
const rs = function (item) {


item.width = 200;
item.height = 200;
item.interpolate = false;
item.shapeExpansionFactor = 1;
/* for lines */
item.numLines = 2;
item.angleMax = 90;
item.angleMin =  -90;
item.excludeLineFuncton = undefined;
item.segmentToLineFunction = undefined;

item.backgroundColor = undefined; //undefined if no background wanted
/* for shapes*/
item.minRadius = 10;
item.maxRadius = 20;
item.numPoints = 3;
item.maxTries = 100;
item.margin = 10;
item.shortenBy = 10;
/* end */


item.segmentToLineFunction = function (seg,lineP) {
  let line = this.genLine(seg,lineP);
  line.show();
  return line;
}
 
 const chooseSides = function () {
   let sd0 = Math.floor(4*Math.random());
   let sd1 = Math.floor(3*Math.random());
   let rs;
   if (sd1 < sd0) {
     rs = [sd1,sd0];
   } else {
     rs = [sd0,sd1+1];
   }
   console.log('sides',rs);
   return rs;
}

item.randomPointInRect = function (rect,on) {
    let {corner,extent} = rect;
    let lx = corner.x;
    let ly = corner.y;
    let x = Math.random() * extent.x + lx;
    let y = Math.random() * extent.y + ly;
    return Point.mk(x,y);
 }
 
item.randomSegOnRect = function (rect,on) {
  //debugger;
  let sides;
  if (!sides) {
    sides = this.sides = rect.sides();
  } else {
    sides = this.sides = this.rectSides(rect);
  }
  let csides = chooseSides();
  let side0 = sides[csides[0]];
  let side1 = sides[csides[1]];
  let p0 = this.randomPointOnSegment(side0);
  let p1 = this.randomPointOnSegment(side1);
  return LineSegment.mk(p0,p1);
}


item.randomPointOnRect = function (rect,on) {
  debugger;
  let sides;
  if (!sides) {
    sides = this.sides = rect.sides();
  } else {
    sides = this.sides = this.rectSides(rect);
  }
  let sdi = Math.floor(4*Math.random());

  let csides = chooseSides();
  let side = sides[sdi];
  let side1 = sides[csides[1]];
  return this.randomPointOnSegment(side);
}

 item.randomPoint = function (shape,on) {
   if (geom.Rectangle.isPrototypeOf(shape)) {
     return on?this.randomPointOnRect(shape):this.randomPointInRect(shape);
   }
   if (geom.LineSegment.isPrototypeOf(shape)) {
     return this.randomPointOnSegment(shape);
   }
   if (geom.Circle.isPrototypeOf(shape)) {
     return on?this.randomPointOnCircle(shape):this.randomPointInCircle(shape);
   }
   
 }
   
   
 


item.randomUnitVector = function () {
  let amin = Math.PI*(this.angleMin/180);
  let amax = Math.PI*(this.angleMax/180);
  let dir = amin + (amax - amin)*Math.random();
  let vec = Point.mk(Math.cos(dir),Math.sin(dir));
  return vec;
}

item.generatePointAndRadius = function () {
  let {width,height,minRadius,maxRadius,numPoints,margin} = this;
  let rr = maxRadius - minRadius;
  let r = minRadius + rr*Math.random();
  let x = (Math.random() -0.5) * width;
  x = (x>0)?x-r- margin:x+r+margin;
  let y = (Math.random() -0.5)*height;
  y = (y>0)?y-r- margin:y+r+margin;
  let p = Point.mk(x,y);
  return [p,r];
}
      


item.addSides = function (rect) {
	let hw,hh;
	let {corner,extent} = rect;
	hw = (extent.x)/2;
	hh = (extent.y)/2;
	let {x:cx,y:cy} = corner;
	let {x:ex,y:ey} = extent;
  let UL = Point.mk(cx,cy)
  let UR = Point.mk(cx+ex,cy)
  let LL = Point.mk(cx,cy+ey)
  let LR  = Point.mk(cx+ex,cy+ey)
	/* let UL = Point.mk(-hw,hh)
  let UR = Point.mk(hw,hh)
  let LL = Point.mk(-hw,-hh)
  let LR  = Point.mk(hw,-hh)*/
  rect.topSide = geom.LineSegment.mk(UL,UR);
	rect.rightSide = geom.LineSegment.mk(UR,LR);
  rect.bottomSide = geom.LineSegment.mk(LR,LL);
  rect.leftSide = geom.LineSegment.mk(LL,UL);
}


item.inRange= function (pnt) {
	if (!pnt) {
		debugger;
		return;
	}
  let {x,y} = pnt;
  let hwd = 0.5*this.width;
  let hht = 0.5*this.height;
  return (-hwd <= x) && (x<=hwd) && (-hht<=y) && (y<=hht);
}



item.allIntersections = function (segs) {
	let rs = [];
	let ln = segs.length;
	for (let i=0;i<ln;i++) {
		for (let j = i+1;j<ln;j++) {
			let segi = segs[i];
			let segj = segs[j];
			let p = segi.intersect(segj);
			if (p) {
				rs.push(p);
			}
		}
	}
	return rs;
}
//  snips inLseg by side effect. directions "fromAbove","fromBelow","fromLeft","fromRight"
  
  
// end0.x < end1.x, it is assumed. Returns 

const intersectSegmentAtX = function (sg,x) {
  let {end0,end1} = sg;
  let e0x = end0.x;    
  let e1x = end1.x;
  let e0y = end0.y;
  let e1y = end1.y;
  if ((e1x < x) || (e0x > x)) {
    return;
  }
  let fr = (x - e0x)/(e1x - e0x);
  let y = e0y + fr*(e1y - e0y);
  return Point.mk(x,y);
}

const onWrongSideX = function (sg,x,direction) {
  let {end0,end1} = sg;
  let e0x = end0.x;
  let e1x = end1.x;
  return (direction === 'fromRight')? e1x <= x:e0x >= x;
}



const insideXs = function (sg,x0,x1) {
  let {end0,end1} = sg;
  let e0x = end0.x;
  let e1x = end1.x;
  return (x0 <= e0x) && (e1x <= x1);
}
 
  
// works by side effect; returns "remove" if the segment is entirely on the wrong side

const snipAtX = function (sg,x,direction) {
  let {end0,end1} = sg;
  let e0x =end0.x;
  let e1x = end1.x;

  if (direction == "fromRight") {
    if (e0x >= x) {
      return false;
    }
 
    if (e1x <= x) {
        return false;
    }
  }
  let intr = intersectSegmentAtX(sg,x);
  if (intr) {
    let ix = intr.x;
    let e0x = end0.x;
    let e1x = end1.x;
    if (direction === "fromRight") {
      if (ix < e0x) {
        end1.copyto(intr);
      } else {
        end0.copyto(intr);
      }
    } else {
       if (ix > e0x) {
        end1.copyto(intr);
      } else {
        end0.copyto(intr);
      }
    }
    return true;
  }
}


const snipAtXs = function (sg,x0,x1) {
  let {end0,end1} = sg;
  let e0x =end0.x;
  let e1x = end1.x;
  if (e0x >= x1) {
    return false;
  }
  if (e1x <= x0) {
    return false;
  }
  let notInt;
  let intrLow,intrHigh;
  if (e0x >= x0) {
    notInt = 'x0';
  }
  if (e1x <= x1) {
    notInt = 'x1';
  }
  if (notInt !== 'x0') {
    intrLow = intersectSegmentAtX(sg,x0);
  }
  if (notInt !== 'x1') {
    intrHigh = intersectSegmentAtX(sg,x1);
  }
  if (intrLow && intrHigh) {
    let rs = geom.LineSegment.mk(intrHigh,end1.copy());
    end1.copyto(intrLow);
    return rs;
  }
  if (intrLow) {
    end1.copyto(intrLow);
    return 'ok';
  }
  if (intrHigh) {
    end0.copyto(intrHigh);
    return 'ok'
  }
}


item.intersectionsWithLine = function (p,vec,inside) {
  let boxSeg = this.intersectWithRectangle(p,vec);
  let boxPoints;
  if (boxSeg) {
    boxPoints = [boxSeg.end0,boxSeg.end1];
  }  else {
    debugger;
    return undefined;
  }	
 // let boxPoints = this.intersectWithRectangle(p,vec);
  let {points,radii} = this;
  let rsOut = [boxPoints[0]];
  let rsIn = [];
  let ln = points.length;
  for (let i=0;i<ln;i++) {
    let center = points[i];
    let radius = radii[i]*this.shapeExpansionFactor;
    let circle = geom.Circle.mk(center,radius);
    let ints = circle.intersectLine(p,vec);
    if (!ints) {
      continue;
    }
    let [int0,int1] = ints;
		if (int0 && int1) {
			rsOut.push(int0);
			rsOut.push(int1);
			if (inside) {
				rsIn.push(int0);
				rsIn.push(int1);
			}
		}
  }
 // this.genSides();
  rsOut.push(boxPoints[1]);
  rsOut.sort((p0,p1) => {return (p0.x < p1.x)?-1:1});
  if (inside) {
   rsIn.sort((p0,p1) => {return (p0.x < p1.x)?-1:1});
   return [rsOut,rsIn]
  }
  return rsOut;
}

item.addShortenedLine = function (p0,p1,inside) {
 // let blf = 0.2 + Math.random() * 0.8;
  let {shortenBy,lines} = this;
  let sp0,sp1;
  if (!p1) {
    debugger; //keep
    return;
  }
  let vec = p1.difference(p0);
  let ln = vec.length();
  if (shortenBy*2 > ln) {
    return;
  }
  let sby = (ln - shortenBy)/ln;
  
  let svec = vec.times(0.5*sby);
  let midpoint = p0.plus(p1).times(0.5);
  sp0 = midpoint.plus(svec.times(-1));
  sp1 = midpoint.plus(svec);
  let line = inside?this.lineP2.instantiate():this.lineP.instantiate()
  line.setEnds(sp0,sp1);    
  this.shapes.push(line);
  line.update();
  line.show();
  return  line;
}

item.displaySegments = function (ints,inside) {
  let ln = ints.length;
  for (let i = 0 ;i<ln/2;i++){
    let e0=ints[i*2];
    let e1 = ints[i*2+1];
    if ((i == 0) && !this.inRange(e0)) {
      e0 = ints[2];
      e1 = ints[3]
      i =+ 1;
    } else if (this.inRange(e1)) {
      this.addShortenedLine(e0,e1,inside);
    }
  }
}
  
    
      
      
  

item.generateShapes = function (protos,setDimensions,probabilities) {
  let {points,radii} = this;
  let shapes = this.set("shapes",core.ArrayNode.mk());
  let ln = points.length;
  nump = protos.length;
  let start = this.hasHole?1:0;
  let which;
  for (let i=start;i<ln;i++) {
    let pnt = points[i]
    let lsv = this.leaveSpotVacantFunction;
    if (lsv && lsv(pnt)) {
      continue;
    }
    if (probabilities) {
      if ((nump === 1) || (Math.random() < probabilities[0])) {
        which = 0;
      } else if ((nump === 2) || (Math.random() < probabilities[1])) {
          which = 1;
      } else {
        which = 2;
      }
    } else {
      which = Math.floor((Math.random()-0.0001) * nump);
    }
    let proto = protos[which];
    if (!proto) {
      debugger; //keep
    }
    let shape = proto.instantiate();
    let setDimension = setDimensions[which];
    shapes.push(shape);
    shape.moveto(pnt);
    setDimension(this,shape, 2 * radii[i]);	
    shape.update();
    shape.show();
  }
}
  
/* never tested*/
/*
item.intersectSegmentWithCircle = function (lsg,circle) {
	//debugger;
	let {end0:p,end1} = lsg;
	let vec = end1.difference(p);
  let intersections = circle.instersectLine(p,vec);
	if (!intersections) {
		return;
	}
	let i0 = intersections[0];
	let i1 = intersections[1];
	let c = circle.center;
	const fractionAlong = function (pnt) {
		let v = pnt.difference(c);
		let a = Math.atan2(v.y,v.x);
		return a/(2*Math.PI);
	}
	let fr0 = fractionAlong(i0);
	let fr1 = fractionAlong(i1);
	let descriptions = [fr0,fr1];
  let rs =  geom.LineSegment.mk(i0,i1);
	rs.descriptions = descriptions;
	return rs;
}



item.intersectSegmentWithRectangle = function (lsg,rect) {
	let end0 = lsg.end0;
  let intersections = [];
	let descriptions = [];
	const fractionAlong = function (seg,p) {
	  let {end0,end1} = seg;
		let dp = p.distance(end0);
		let ln = end1.distance(end0);
		return dp/ln;
  }
  const pushIfNnul = function (sideName,x) {
    if (x) {
			let side = rect[sideName];
      intersections.push(x);
			descriptions.push([sideName,fractionAlong(side,x)]);;
    }
  }
  pushIfNnul('topSide',rect.topSide.intersect(lsg));
  pushIfNnul('bottomSide',rect.bottomSide.intersect(lsg));
  pushIfNnul('leftSide',rect.leftSide.intersect(lsg));
  pushIfNnul('rightSide',rect.rightSide.intersect(lsg));
  if (intersections.length < 2) {
    debugger;//keep
    return undefined;
  }
	//end0 should be closer to int0 than int1
	
  let [int0,int1] = intersections;
	let de0i0 = int0.boxcarDistance(end0);
	let de0i1 = int1.boxcarDistance(end0);
  if (de0i0 > de0i1) {
    let tmp = int0;
    int0 = int1;
    int1 = tmp;
		let d0 = descriptions[0];
		let d1 = descriptions[1];
		tmp = d0;
		d0 = d1;
		d1 = tmp;
		descriptions[0] = d0;
		descriptions[1] = d1;
  }
  let rs =  geom.LineSegment.mk(int0,int1);
	rs.end0.side = descriptions[0][0]
	rs.end1.side = descriptions[1][0]
	rs.end0.fractionAlong = descriptions[0][1]
	rs.end1.fractionAlong = descriptions[1][1]
	//rs.descriptions = descriptions;
  rs.whichCircle = lsg.whichCircle;
  return rs;
}
item.intersectWithRectangle = function (p,ivec) {
	 let vec = ivec.times(this.width * 4);
  let e0 = p.plus(vec.minus()) ;
  let e1 = p.plus(vec);
  let lsg = geom.LineSegment.mk(e0,e1);
	let rs = this.intersectSegmentWithRectangle(lsg,this.rect);
	return rs;
}
*/
	
	
 
item.randomPointInCircle = function (circle) {	
  let r = circle.radius;
  let center = circle.center; 
	if (!center) {
		debugger;//keep
	}
  const genPoint = () => {
    let {x,y} = center;
    let corner = Point.mk(x-r,y-r);
    let extent = Point.mk(r*2,r*2);
    let rect = geom.Rectangle.mk(corner,extent);
    let p = this.randomPoint(rect);
    return p;
  }
  while (true) {
    let rs = genPoint();
    if (rs.distance(center) < r) {
      return rs;
    }
  }
}


item.randomPointOnCircle = function (circle) {
  let r = circle.radius;
  let center = circle.center;
	let fr = Math.random(); 
	let dir = 2 * Math.PI*fr;
	let vec = Point.mk(Math.cos(dir),Math.sin(dir));
	let rs =  center.plus(vec.times(r));
	rs.fractionAlong = fr;
	rs.onShape = circle;
	return rs;
}
	
    
    
item.randomPointOnSegment = function (seg) {
  let {end0,end1} = seg;
  let vec = end1.difference(end0);
  let rn = Math.random();
  return end0.plus(vec.times(rn));
}
    
    
    
const extendSegment = function (sg,ln) {
  let p = sg.end0;
  let vec = sg.end1.difference(p);
  let longVec =  vec.times(ln);
  let le0 = p.plus(longVec.minus()) ;
  let le1 = p.plus(longVec);
  return geom.LineSegment.mk(le0,le1);
}  


item.intersectUnitSegment = function(usg,rect) {
  let rsg;
  let {end0,end1} = usg;
  if (this.dimension) {
    let circle = this.circle;
    let vec = end1.difference(end0);
    let sols = circle.intersectLine(end0,vec);
    if (sols) {
      rsg = geom.LineSegment.mk(sols[0],sols[1]);
    } else {
      return;
    }
  } else {
    let longSeg = extendSegment(usg,this.width * 4);
    rsg = this.intersectSegmentWithRectangle(longSeg,rect);
  }
  return rsg;
}
    

item.randomSegment = function (src,srcOn,dst,dstOn) {
//  debugger;
  let srcP;
  let dstP;
  let srcIsRect = geom.Rectangle.isPrototypeOf(src);
  let seg;
  if (srcIsRect && srcOn && dstOn && (src===dst)) {
    seg = this.randomSegOnRect(src);
  } else {
    let srcP = this.randomPoint(src,srcOn);
    let dstP = this.randomPoint(dst,dstOn);
    seg = geom.LineSegment.mk(srcP,dstP,true);// true = don't copy
  }
  return seg;
}
/*
  if (srcIsCircle) {
    srcP = srcOn?this.randomPointOnCircle(src):this.randomPointInCircle(src);
  } else {
    srcP = this.randomPoint(src,srcOn);
  }
  if (dstIsCircle) {
    dstP = onCircle?this.randomPointOnCircle(dst):this.randomPointInCircle(dst);
  } else {
    dstP = this.randomPoint(dst,dstOn);
  }
  let rsg = geom.LineSegment.mk(srcP,dstP,true);// true = don't copy
  segments.push(rsg);
  return rsg;
 } 
*/
const putIn0_1 = function (x) {
	while (x < 0) {
		x++;
	}
	while (x>1) {
		x--;
	}
	return x;
}

const interpolateValues = function (v0,v1,fr) {
  let vi = v1-v0;
  return v0 + (v1-v0) * fr;
}

const interpolatePoints = function (p0,p1,fr) {
  let {x:p0x,y:p0y} = p0;
  let {x:p1x,y:p1y} = p1;
  let ix = interpolateValues(p0x,p1x,fr);
  let iy= interpolateValues(p0y,p1y,fr);
  return Point.mk(ix,iy);
}

const interpolateUnitSegments = function (sgA,sgB,fr) {
  let {end0:A0,angle:angleA} = sgA;
  let {end0:B0,angle:angleB} = sgB;
  let e0 = interpolatePoints(A0,B0,fr);
  let angle = interpolateValues(angleA,angleB,fr);
  let vec = Point.mk(Math.cos(angle),Math.sin(angle));
  let e1 = e0.plus(vec);
  let lsg = geom.LineSegment.mk(e0,e1);
  lsg.angle = angle;
  return lsg;
}
  
item.snipSegmentsAtX = function (x,direction,fraction) {
  let segments = this.segments;
  let cnt = 0;
  segments.forEach((sg) => {
    if (sg && (onWrongSideX(sg,x,direction) || intersectSegmentAtX(sg,x))) {
      cnt++;
    }
  });
  let numToSnip = Math.floor(fraction * cnt);
  cnt = 0;
  let idx = -1;
  while (cnt < numToSnip) {
    idx++;
    let sg = segments[idx];
    if (!sg) {
      continue;
    }
    if (onWrongSideX(sg,x,direction)) {
      segments[idx] = null;
      cnt++;
      continue;
    }
    if (snipAtX(sg,x,direction)) {
      cnt++;
    }
  }
}
  
item.snipSegmentsAtXs = function (x0,x1,fraction) {
  let segments = this.segments;
  let cnt = 0;
  segments.forEach((sg) => {
    if (sg && (insideXs(sg,x0,x1) || intersectSegmentAtX(sg,x0) || intersectSegmentAtX(sg,x1))) {
      cnt++;
    }
  });
  let numToSnip = Math.floor(fraction * cnt);
  cnt = 0;
  let idx = -1;
  while (cnt < numToSnip) {
    idx++;
    let sg = segments[idx];
    if (!sg) {
      continue;
    }
    if (insideXs(sg,x0,x1)) {
      segments[idx] = null;
      cnt++;
      continue;
    }
    let rsg = snipAtXs(sg,x0,x1);
    cnt++;
    if (rsg && (rsg!=='ok')) {
      segments.push(rsg);
    }
  }
}
    


item.genSides = function () {
  if (this.topSide) {
    return;
  }
  let hw = this.width/2;
  let hh = this.height/2;
  let UL = Point.mk(-hw,hh)
  let UR = Point.mk(hw,hh)
  let LL = Point.mk(-hw,-hh)
  let LR  = Point.mk(hw,-hh)
  this.topSide = geom.LineSegment.mk(UL,UR);
  this.bottomSide = geom.LineSegment.mk(LL,LR);
  this.leftSide = geom.LineSegment.mk(UL,LL);
  this.rightSide = geom.LineSegment.mk(UR,LR);
}      
    
 
     
item.showPoints = function () {
  let points = this.points
  points.forEach( (p) => {
    let dp = this.circleP.instantiate();
    this.circles.push(dp);
    dp.moveto(p);
    dp.show();
    dp.update();
  });
}

item.alongCircle = function (circle,fr) {
	let a = 2*Math.PI*fr;
	let {center,radius} = circle;
	let vec = Point.mk(Math.cos(a),Math.sin(a));
	return center.plus(vec.times(radius));
}



	let nextSides = {topSide:"rightSide",rightSide:"bottomSide",bottomSide:"leftSide",leftSide:"topSide"};
	let prevSides = {topSide:"leftSide",rightSide:"topSide",bottomSide:"rightSide",leftSide:"bottomSide"};




item.preliminaries = function (irect) {
	let {backgroundColor,backgroundPadding,outerBackgroundColor:obc,outerBackgroundPaddingX:obpx,outerBackgroundPaddingY:obpy,width,height} = this;
	let rect;
	//debugger;
	if (irect) {
		rect = irect;
	} else {
		let hw = 0.5 * this.width;
		let hh = 0.5 * this.height;
		let corner = Point.mk(-hw,-hh);
		let extent = Point.mk(width,height);
	  rect = geom.Rectangle.mk(corner,extent);
	}
	this.addSides(rect);
	this.rect = rect;
	//this.addBackground();
	
}
	
item.generateLines = function (iparams) {
  debugger;
  let params = {};
  let props = ['src','srcOn','dst','dstOn','numLines','lineP','excludeSegFunction'];
   core.transferProperties(params,this,props);
   core.transferProperties(params,iparams,props);
  let {src,srcOn,dst,dstOn,numLines,lineP,excludeSegFunction} = params;
  let lines = this.lines;
  if (!lines) {
 	  lines = this.set('lines',core.ArrayNode.mk());
  }
  let exf = excludeSegFunction?excludeSegFunction:() => 0;
	for (let j=0;j<numLines;j++) {
    let seg = this.randomSegment(src,srcOn,dst,dstOn);
    if (!exf(seg)) {
    debugger;
    let line = this.segmentToLineFunction(seg,lineP);
    lines.push(line);
    //  this.addLine({lines:lines,segment:seg,lineP:lineP});
    }
  }
}


	
};

export {rs};

      
