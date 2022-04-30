
const rs = function (item) {

const dSeg = function (e0,e1,p) { // displaced seg
  return LineSegment.mk(e0.plus(p),e1.plus(p));
}
item.segsFromPoints = function (pnts,p) {
  let ln = pnts.length;
  let segs = [];
  let p0,p1;
  for (let i=0;i<ln-1;i++) {
    if (i === 0) {
     p0 = p?pnts[i].plus(p):pnts[i];
    } else {
      p0 = p1;
    }
    p1 = p?pnts[i+1].plus(p):pnts[i+1];
    let sg = LineSegment.mk(p0,p1);
    segs.push(sg);
  }
  return segs;
}

item.USegments = function (wd,ht,center) {
  let hwd = 0.5 * wd;
  let hht = 0.5 * ht;
  let UL = Point.mk(-hwd,-hht);
  let LL = Point.mk(-hwd,hht);
  let LR = Point.mk(hwd,hht);
  let UR = Point.mk(hwd,-hht);
  let points = [UL,LL,LR,UR];
  return this.segsFromPoints(points,center);
}

item.UUSegments = function (wd,ht,center) {
  let hwd = 0.5 * wd;
  let hht = 0.5 * ht;
  let UL = Point.mk(-hwd,-hht);
  let LL = Point.mk(-hwd,hht);
  let LR = Point.mk(hwd,hht);
  let UR = Point.mk(hwd,-hht);
  let points = [LL,UL,UR,LR];
  return this.segsFromPoints(points,center);
}
item.triangleSegments = function (wd,ht,center) {
  let hwd = 0.5 * wd;
  let hht = 0.5 * ht;
  let LL = Point.mk(-hwd,hht);
  let TOP = Point.mk(0,-hht);
  let LR = Point.mk(hwd,hht);
  let points = [LL,TOP,LR,LL];
  return this.segsFromPoints(points,center);
}

item.rectangleSegments = function (wd,ht,center,bottomGap) {
  let hwd = 0.5 * wd;
  let hht = 0.5 * ht;
  let UL = Point.mk(-hwd,-hht);
  let UR = Point.mk(hwd,-hht);
  let LR = Point.mk(hwd,hht);
  let LL = Point.mk(-hwd,hht);
	let points;
	if (bottomGap) {
		let HL = Point.mk(-0.5*bottomGap,hht);
		let HR = Point.mk(0.5*bottomGap,hht);
    points0 = [HL,LL,UL];//,UR,LR,HR];
    points1 = [UR,LR,HR];
		return this.segsFromPoints(points0,center).concat(this.segsFromPoints(points1,center));
	} else {
    points = [UL,UR,LR,LL,UL];
	}
  return this.segsFromPoints(points,center);
}

item.crossSegments = function (wd,ht,center) {
  let hwd = 0.5 * wd;
  let hht = 0.5 * ht;
  let UC = Point.mk(0,-hht);
  let LC = Point.mk(0,hht);
  let vseg = LineSegment.mk(UC,LC);
  let LFTC = Point.mk(-hwd,0);
  let RC = Point.mk(hwd,0);
  let hseg = LineSegment.mk(LFTC,RC);
  return [vseg,hseg];
}

item.diagSegments = function (wd,ht,center) {
  let hwd = 0.5 * wd;
  let hht = 0.5 * ht;
  let ULC = Point.mk(-hwd,-hht);
  let LLC = Point.mk(-hwd,hht);
	let URC = Point.mk(hwd,-hht);
	let LRC = Point.mk(hwd,hht);
  let seg0 = LineSegment.mk(ULC,LRC);
  let seg1 = LineSegment.mk(URC,LLC);
  return [seg0,seg1];
}


      
item.sizedRectangleSegments = function (sizes,p,heightRatio=1) {
  let ln = sizes.length;
  let whichWd = Math.floor(Math.random()*ln);
  let whichHt = Math.floor(Math.random()*ln);
  let wd = sizes[whichWd];
  let ht = heightRatio?heightRatio*wd:whichHt;
  let segs = this.rectangleSegments(wd,ht,p);
  return segs;
}

item.sizedTriangleSegments = function (sizes,p,heightRatio=1) {
  let ln = sizes.length;
  let whichWd = Math.floor(Math.random()*ln);
  let whichHt = Math.floor(Math.random()*ln);
  let wd = sizes[whichWd];
  let ht = heightRatio?heightRatio*wd:whichHt;
 /* let sg0 = dSeg(Point.mk(0,0),Point.mk(wd/2,-ht),p);
  let sg1 = dSeg(Point.mk(wd/2,-ht),Point.mk(wd,0),p);
  let sg2 = dSeg(Point.mk(wd,0),Point.mk(0,0),p);*/
  let segs = this.triangleSegments(wd,ht,p);
  return segs;
}


item.sizedUSegments = function (sizes,p,heightRatio=1) {
  let ln = sizes.length;
  let whichWd = Math.floor(Math.random()*ln);
  let whichHt = Math.floor(Math.random()*ln);
  let wd = sizes[whichWd];
  let ht = heightRatio?heightRatio*wd:whichHt;
  let segs = this.USegments(wd,ht,p);
  return segs;
}

item.sizedUUSegments = function (sizes,p,heightRatio=1) {
  let ln = sizes.length;
  let whichWd = Math.floor(Math.random()*ln);
  let whichHt = Math.floor(Math.random()*ln);
  let wd = sizes[whichWd];
  let ht = heightRatio?heightRatio*wd:whichHt;
  let segs = this.UUSegments(wd,ht,p);
  return segs;
}

item.mkCenteredSeg = function (pos,length,angle) {
	let hln =0.5*length;
	let c = Math.cos(angle);
	let s = Math.sin(angle);
	let v = Point.mk(c*hln,s*hln);
	let p0 = pos.difference(v);
	let p1 = pos.plus(v);
	return LineSegment.mk(p0,p1);
}


item.mkASeg = function (pos,ln,angle) {
	let c = Math.cos(angle);
	let s = Math.sin(angle);
	let v = Point.mk(c*ln,s*ln);
	let p1 = pos.plus(v);
	return LineSegment.mk(pos,p1);
}

item.crossedSegments = function (params) {
	debugger;
	 let {direction:dir0=0,randomness=0,length0,length1,pos,centered=1} = params;
	 let dir1 = dir0 + 0.5* Math.PI;
	 let s0 = centered?this.mkCenteredSeg(pos,length0,dir0):this.mkASeg(pos,length0,dir0);
	 let s1 = centered?this.mkCenteredSeg(pos,length1,dir1):this.mkASeg(pos,length1,dir1);
	 return [s0,s1];
}


item.wigglySegments = function (params) {
  let {zigzag=0,direction=0,randomness=0,vertical=0,widths,heightRatio,numSegs,pos} = params;
 // debugger;
  let {width,height} = this;
  let uvec,nvec,stp;
  if (direction) {
    let cs = Math.cos(direction);
    let sn = Math.sin(direction);
    uvec = Point.mk(cs,sn);
    nvec = uvec.normal();
  }
  
  let ln = widths.length;
  let which = Math.floor(Math.random()*ln);
  let wd = widths[which];
  let hwd = 0.5*wd;
  if (direction) {
    //stp = pos.plus(uvec.times(-hwd));
    stp = uvec.times(-hwd);
  }
  let ht = heightRatio*wd;
  let hht = 0.5*ht;
  let pnts = [];
  let sgwd = wd/numSegs;
  let xp = -wd/2;
  for (let i = 0;i<numSegs+1;i++) {
		let y;
		let odd = i%2 === 1;
		let up = i%4===1;
		if (zigzag) {
		 let absy = odd?ht+randomness*(Math.random()-0.5)*ht:0;
		 y = up?absy:-absy;
		} else {
		 y = (Math.random()-0.5)*ht;
		}
    let pnt;
    if  (direction) {
      pnt = stp.plus(uvec.times(i*sgwd)).plus(nvec.times(y));
    } else {
		  pnt = vertical?Point.mk(y,xp):Point.mk(xp,y);
    }
    let mx = 1.05*(width/2);
    //console.log('pnt.x',pnt.x,'mx',mx);
    if ((pnt.x) > mx) {
      debugger;
    }
		pnts.push(pnt);
		xp+= sgwd;
  }
  let segs =this.segsFromPoints(pnts,pos);
  return segs;
}


item.genOneSegment = function (p,direction) {
  let {sepNext,segLength:len,lineExt=0} = this;
  debugger;
	let seg = this.genSegment(p,len,direction,sepNext);
  return seg;
}
// a "unit" has the form [[segs],[lines]] Seeds are starter units
item.genSingletonUnit =  function (lineP,p,direction,clr) {
  let {lineExt=0} = this;
	let seg = this.genOneSegment(p,direction);
	//let ln = this.genLine(seg.end0,seg.end1,sepNext);
	let ln = this.genLine(seg,lineP,lineExt);
  if (clr) {
		ln.stroke = clr;//'white';//clr;
  }
	return [[seg],[ln]];
}


}
export {rs};




      