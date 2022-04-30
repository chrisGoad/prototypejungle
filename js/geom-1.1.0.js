// Copyright 2019 Chris Goad
// License: MIT

//import * as core from "/js/core-1.1.0.min.js";
import * as core from "/js/core-1.1.0.js";

let codeRoot = core.codeRoot;

let geomr = codeRoot.set("geom",core.ObjectNode.mk());
geomr.__builtIn = true;
geomr.set("Point",core.ObjectNode.mk()).__namedType();
let Point = geomr.Point;
let geometricObject; // defined up in dom by defineGeometric

const isGeometric = function (nd) {
  return core.ArrayNode.isPrototypeOf(nd) || (geometricObject && geometricObject.isPrototypeOf(nd));
}


Point.mk = function (x,y) {
  let rs = Object.create(Point);
  if (typeof x==="number") {
    rs.x = x;
    rs.y = y;
  } else {
    rs.x = 0;
    rs.y =0;
  }
  return rs;
}

const rotationMatrix  = function (th) {
	let r00 = Math.cos(th);
	let r10 = -Math.sin(th);
	let r01 = -r10;
	let r11 = r00;
	return [r00,r01,r10,r11];
}

Point.rotate =  function (rm) {
	let [r00,r01,r10,r11] = rm;
	let {x,y} = this;
	let rx = r00*x + r10 * y;
	let ry = r10*x + r11 * y;
	return Point.mk(rx,ry);
}
  
Point.nonNegative = function () {
  this.x = Math.max(0,this.x);
  this.y = Math.max(0,this.y);
  return this;
}

Point.hasNaN = function () {
  return isNaN(this.x) || isNaN(this.y);
}

  
  
  // set the property p of this to v construed as a point 
  
core.ObjectNode.__setPoint = function (p,v) {
  let pnt;
  if (v) {
    pnt = toPoint(v);
  } else {
    pnt = Point.mk();
  }
  this.set(p,pnt);
  return pnt;
}



Point.x = 0;
Point.y = 0;



Point.plus = function (q) {
  let p = this;
  return Point.mk(p.x + q.x,p.y + q.y);
};

Point.plusX = function (x) {
  return Point.mk(this.x + x,this.y);
}
  
  
Point.plusY = function (y) {
  return Point.mk(this.x,this.y+y);
}

Point.length = function () {
  let {x,y} = this;
  return Math.sqrt(x*x + y*y);
}

// x might be an array, or a point, or x and y might be numbers
const pointify = function (mkNew,x,y) {
  let p;
  if (x === undefined) {
    p = Point.mk(0,0);
  } else if (typeof y ==="number") {
    p = Point.mk(x,y);
  } else if (core.ArrayNode.isPrototypeOf(x) || Array.isArray(x)) {
    p = Point.mk(x[0],x[1])
  } else {
    p = mkNew?Point.mk(x.x,x.y):x;
  }
  return p;
}



const toPoint = function (x,y) {
  return pointify(0,x,y);
}

Point.copy = function () {
  return Point.mk(this.x,this.y);
}
  
  
Point.copyto = function (src) {
  this.x = src.x;
  this.y = src.y;
  return this; 
}


const newPoint = function (x,y) {
  return pointify(1,x,y);
}

core.ObjectNode.setPointProperty = function (prop,pnt) {
  if (this.__get(prop)) {
    this[prop].copyto(pnt);
  } else {
    this[prop] = pnt.copy();
  }
}

Point.angleOf= function () {
  return normalizeAngle(Math.atan2(this.y,this.x));
}

Point.difference = function (q) {
  let p = this;
  return Point.mk(p.x - q.x,p.y - q.y);
}

Point.directionTo = function (pnt) {
    return pnt.difference(this).normalize();
}
geomr.set("Interval",core.ObjectNode.mk()).__namedType();
let Interval = geomr.Interval;

export {Interval};
Interval.mk = function (lb,ub) {
  let rs = Object.create(Interval);
  rs.lb = lb;
  rs.ub = ub;
  return rs;
}

const mkInterval = function (lb,ub) {
  return Interval.mk(lb,ub);
}

Interval.intersectsInterval = function (intv) {
	let {lb,ub} = this;
	let lb1 = intv.lb;
	let ub1 = intv.ub;
	let ni = (ub < lb1) || (ub1 < lb);
	return !ni;
}

Point.setCoords = function (x,y) {
  this.set("x",x);
  this.set("y",y);
}

// if p is null, compute distance from origin
Point.distance = function (p) {
  let vx,vy;
  if (p) {
    vx = this.x - p.x;
    vy = this.y - p.y;
  } else {
    vx = this.x;
    vy = this.y;
  }
  return Math.sqrt(vx*vx + vy * vy);
}

Point.boxcarDistance = function (p) {
	let {x:ax,y:ay} = this;
	let {x:bx,y:by} = p;
	let rs = Math.abs(ax - bx) + Math.abs(ay - by);
	return rs;
}

Point.times = function (f) {
  let p = this;
  return Point.mk(f*p.x,f*p.y);
}


Point.normalize = function () {
  let ln = this.length();
  return Point.mk(this.x/ln,this.y/ln);
}


Point.normal = function () {
  return Point.mk(-this.y,this.x);
}

Point.minus = function () {
  return Point.mk(-this.x,-this.y);
}

Point.dotp = function (p) {
  return this.x * p.x + this.y * p.y;
}
const angleToDirection = function (a) {
  return Point.mk(Math.cos(a),Math.sin(a));
}

const mkRadialPoint = function (r,a) {
  return Point.mk(r*Math.cos(a),r*Math.sin(a));
}


Point.interpolate = function (dst,fc) {
   let d = dst.difference(this);
   let vc  = d.times(fc);
   let rs = this.plus(vc);
   return  rs;
}


Point.toRectangle = function () {
  let {x,y} = this;
  let xt = Point.mk(Math.abs(x),Math.abs(y));
  let cx = (x<0)?x:0;
  let cy = (y<0)?y:0;
  let crn = Point.mk(cx,cy);
  return Rectangle.mk({corner:crn,extent:xt});
}

Point.toString = function () {
  let {x,y} = this;
  return "["+x+","+y+"]";
}

geomr.set("Transform",core.ObjectNode.mk()).__namedType();

let Transform = geomr.Transform
// every transform will have all three of scale, rotation,translation defined.
// scale might be scale or a point. In the latter case, the scaling in  x and y are the scale's coordinates.
Transform.mk = function (o,scale,rotation) {
  let rs = Object.create(Transform);
  let otranslation,oscale,orotation;
  rs.scale = 1;
  rs.rotation = 0;
  if (!o) {
    rs.set("translation",Point.mk());
    return rs;
  }
  if (Point.isPrototypeOf(o)) {
    rs.set('translation',o.copy());
    if (typeof scale === 'number') {
      rs.scale = scale;
    } else if  (Point.isPrototypeOf(scale)) {
      rs.set('scale',scale.copy());
    }
    if (typeof rotation === 'number') {
      rs.rotation = rotation;
    }
    return rs;
  }
  otranslation = o.translation;
  if (otranslation) {
    rs.set('translation',otranslation.copy());
  }
  oscale = o.scale;
  if (typeof oscale === "number") {
    rs.scale = oscale;
  } else if  (Point.isPrototypeOf(oscale)) {
      rs.set('scale',oscale.copy());
  }
  orotation = o.rotation;
  if (typeof orotation === "number") {
    rs.rotation = orotation;
  } 
  return rs;
}

Transform.copyto = function (xf) {
  this.scale = xf.scale;
  this.rotation = xf.rotation;
  this.translation.copyto(xf.translation);
}

Transform.hasNaN = function() {
  if (isNaN(this.scale)) {
    return true;
  }
  if (isNaN(this.rotation)) {
    return true;
  }
  let tr = this.translation;
  if (tr) {
    return tr.hasNaN();
  }
}


const normalizeAngle = function (a) { // normalize to between 0 and 2*Pi
  let m = a%(Math.PI*2);
  if (m < 0) {
    m = m + Math.PI*2;
  }
  return m;
}
  
// see __draw: __properties translation (a point), subject and optionally scale,rotation (later matrix xform)
// if the subject is another translation

  
  
const mkRotation = function (r) {
  let trns =  Transform.mk();
  trns.rotation = r;
  return trns;

}

// x might be a point; this is in the object's own coord system
const mkTranslation = function (x,y) {
  let p = newPoint(x,y);
  let trns = Transform.mk({translation:p});
  return trns;
}

const mkScaling = function (s) {
  let trns = Transform.mk();
  trns.scale = s;
  return trns;
}
  
// move to a given location where x,y are in global coords
const movetoInGlobalCoords = function (nd,x,y) { // only for points for now; inputs are in global coordinates
  let p = toPoint(x,y);
  let lp = nd.toLocalCoords(p);//desired position of this relative to its parent
  // we want to preserve the existing scaling
  let xf = nd.transform;
  let o = {};
  if (xf) {
    xf.translation.setTo(lp);
  } else {
    o.translation = lp;
    let trns = Transform.mk(o);
    nd.set("transform",trns);
  }
  if (nd.realizeTransform) {
    nd.realizeTransform();
  }
}

  
Transform.inverse =  function () {
  let s = this.scale;
  let ns,nsx,nsy,tr,nx,ny;
  if (!s) {
    s = 1;
  }
  if (typeof s === "number") {
    ns = 1/s;
    nsx = ns;
    nsy = ns;
  } else {
    nsx = 1/(s.x);
    nsy = 1/(s.y);
    ns = Point.mk(nsx,nsy);
  }
  tr = this.translation;
  if (tr) {
    nx = -(tr.x) * nsx;
    ny = -(tr.y) * nsy;
    return Transform.mk({scale:ns,translation:Point.mk(nx,ny)});
  } else {
    return Transform.mk({scale:ns});
  }
  }

   
Point.applyTransform = function (tr) {
 // order: rotation,scaling  translation
 let trns = tr.translation;
 let tx = trns.x,ty = trns.y;
 let sc = tr.scale;
 let scx,scy,rt,x,y,s,c,rx,ry,fx,fy;
 if (sc === undefined) {
    scx = scy = 1;
 } else if (typeof sc === "number") {
   scx = scy = sc;
 } else {
   scx = sc.x;
   scy = sc.y;
 }
 rt = tr.rotation;
 ({x,y} = this);
 if (rt === 0) {
   rx = x;
   ry = y;
 } else {
   s = Math.sin(rt);
   c = Math.cos(rt);
   rx = c*x - s*y;
   ry = s*x + c*y;
 }
 fx = scx*rx + tx;
 fy = scy*ry + ty;
 return Point.mk(fx,fy);
}

Transform.apply = function (p) {
  return p.applyTransform(this);
}

Transform.applyInverse = function (p) {
  // reverse order: translation, scaling, rotation
  let trns = this.translation;
  let sc = this.scale;
  let rt = this.rotation;
  let px = p.x - trns.x;
  let py = p.y - trns.y;
  let isc = 1/sc;
  let s,c,fx,fy;
  px = px * isc;
  py = py * isc;
  if (rt === 0) {
    fx = px;
    fy = py;
  } else {
    s = Math.sin(-rt);
    c = Math.cos(-rt);
    fx = c*px - s*py;
    fy = s*px + c*py;
  }
 
  return Point.mk(fx,fy);
}

Point.applyInverse = function (tr) {
  return tr.applyInverse(this);
}

Transform.applyToPoints = function (pnts) {
  let rs = core.Array.mk();
  let thisHere = this;
  pnts.forEach(function (p) {
    rs.push(p.applyTransform(thisHere));
  });
  return rs;
}
    
const toCoords = function (nd,p) {
  let xf = nd.__get("transform");
  if (xf) {
    return xf.applyInverse(p);
  } else {
    return p;
  }
}

const toParentCoords = function (nd,p) {
 return nd.toLocalCoords(p);
}
  
// ip in nd's own coordinates
const toOwnCoords = function (nd,ip) {
  let p = nd.toLocalCoords(ip);
  let xf = nd.__get("transform");
  if (xf) {
    p = xf.applyInverse(p);
  }
  return p;
}


 const translateX = function (nd,x) {
  let xf = nd.transform;
  if (xf) {
    xf.translation.x =x;
    return;
  }
  xf = mkTranslation(x,0);
  nd.set("transform",xf);
}


 const translateY = function (nd,y) {
  let xf = nd.transform;
  if (xf) {
    xf.translation.y =y;
    return;
  }
  xf = mkTranslation(0,y);
  nd.set("transform",xf);
}
  



const rotate = function (nd,r) {
  let xf = nd.transform;
  if (xf) {
    xf.rotation = r;
    return xf;
  }
  xf = mkRotation(r);
  nd.set("transform",xf);
}

    
    
Point.setTo = function (src) {
  this.x = src.x;
  this.y = src.y;
}

Point.setXY = function (x,y) {
  if (y === undefined) { // assume the one arg is a point
    this.x = x.x;
    this.y = x.y;
  } else { 
    this.x = x;
    this.y = y;
  }
}


geomr.set("Ray",core.ObjectNode.mk()).__namedType();


let Ray = geomr.Ray;

Ray.mk = function (point,vector) {
  let rs = Object.create(Ray);
  rs.point = point;
  rs.vector = vector;
  return rs;
}

/*intersecting Rays A and B


let SLA = vay/vax;
SLB = vby/vbx;
suppose you go t units along a then that will get you SLA*t units up. and SLB units down. we are going up at SLA/SLB times as fast from A as we are down from B. Let R = SLA/SLB. The meeting spot will have (y-Ay) =  -R * (By -y); thus 

y * (1 - R) = Ay- R*By;
y * (1 + R) = Ay+ R*By;
y * (1 - R) = Ay-  R*By;

y = (Ay -  R*By)/(1 - R);
y = (Ay + R*By)/(1 - R);

Then (x,y) = t*vax + Ax,t*vay + Ay)
y = t*vay + Ay;
t = (y-Ay)/vay
x = t*vax + Ax;

SLB === 0 case:
y = vby;
t = (y - Ay)/vay = (
*/


Ray.intersectRay = function (RB) {
 // let A = this;
 //debugger;
  let {point:A,vector:vA}  = this;
  let {point:B,vector:vB}  = RB;
  let {x:Ax,y:Ay} = A;
  let {x:Bx,y:By} = B;
  let {x:vax,y:vay} = vA;
  let {x:vbx,y:vby} = vB;
  let SLA = vay/vax;
  let SLB = vby/vbx;
  let y;
  if (SLB === 0) {
    if (SLA === 0) {
      return undefined;
    }
    y = By;
  } else {
    let R = SLA/SLB;
    if (R === 1) {
      return undefined;
    }
    y = (Ay -  R*By)/(1 - R);
  }

  //let y = (Ay + R*By)/(1 - R);
  let t = (y-Ay)/vay
  let x = t*vax + Ax;
 // debugger;
  return Point.mk(x,y);
  //console.log('Ay',Ay,'x',x,'y',y);
}
/*
RA = Window.geom.Ray.mk(Point.mk(0,0),Point.mk(1,1));RB = Window.geom.Ray.mk(Point.mk(0,1),Point.mk(1,-1));RC = RA.intersectRay(RB);
*/

geomr.set("Line",core.ObjectNode.mk()).__namedType();

let Line = geomr.Line;

Line.mk = function (point,direction) {
	let rs = Object.create(Line);
	rs.set('point',point.copy());
	rs.set('direction',direction.copy());
	return rs;
}

Line.toEquation = function () {
	let {direction,point} = this;
	let {x:dx,y:dy} = direction;
	let {x:px,y:py} = point;
	let m = 0;
	let im = 0;
	if (Math.abs(dx) > 0.0001) {
	  m = dy/dx;
	}
	if (Math.abs(dy) > 0.0001) {
	  im = dx/dy;
	}
	let a,b,c;
	if (Math.abs(m) > Math.abs(im)) {
		a = -m;
		b = 1;
		c = m*px-py
	} else {
		a = 1;
		b = -im;
		c = im*py-px
	}
	return {a,b,c};
}
// needs fixing - does not work
Line.nearestPoint = function (p) {
	debugger;
	let {point} = this;
  let {direction} = this;
	let tpnt = point.plus(direction);
	let {x:px,y:py} = point;
	let eqn = this.toEquation();
	let {a,b,c} = eqn;
	let xx0 = a*px + b*py + c;
	let xx1 = a*tpnt.x + b* tpnt.y + c;
	//let {a,b,c} = eqn;
	let {x,y} = p;
	let xr = (b*(b*x - a*y) - a*c)/(a*a + b*b);
	let yr = (a*(a*y - b*x) - a*c)/(a*a + b*b);
	let xx2 = a*xr + b*yr + c;
	let rs = Point.mk(xr,yr);
	// for checking
	let vec = rs.difference(p);
	let ln = vec.length();
	console.log('ln',ln);
	if (ln > 5) {
		debugger;
	}
	return rs;
}
	

	

geomr.set("LineSegment",core.ObjectNode.mk()).__namedType();

let LineSegment = geomr.LineSegment;

LineSegment.mk = function (end0,end1,dontCopy) {
  let rs = Object.create(LineSegment);
  if (!end0) {
    return rs;
  }
  if (dontCopy) {
    rs.set('end0',end0);
    rs.set('end1',end1);
  } else {
    rs.set('end0',end0.copy());
    rs.set('end1',end1.copy());
  }
  return rs;
}

LineSegment.toLine = function () {
	let {end0,end1} = this;
	let vec = end1.difference(end0);
	let nvec = vec.normalize();
	let line = Line.mk(end0,nvec);
	return line;
}

LineSegment.nearestPoint = function (p) {
	let line = this.toLine();
	let rs = line.nearestPoint(p);
	return rs;
}

LineSegment.length = function () {
  return (this.end1.difference(this.end0)).length();
}

LineSegment.pointAlong = function (fraction) {
  let end0,end1;
  ({end0,end1} = this);
  let d = end1.difference(end0);
  return end0.plus(d.times(fraction));
}

LineSegment.middle = function () {
  return this.pointAlong(0.5);
}

LineSegment.xBounds = function () {
	let {end0,end1} = this;
	let x0 = end0.x;
	let x1 = end1.x;
	if (x0<x1) {
		return Interval.mk(x0,x1);
	}
	return Interval.mk(x1,x0);
}

LineSegment.yBounds = function () {
	let {end0,end1} = this;
	let y0 = end0.y;
	let y1 = end1.y;
	if (y0<y1) {
		return Interval.mk(y0,y1);
	}
	return Interval.mk(y1,y0);
}

LineSegment.lengthen = function (ln) {
	let {end0,end1} = this;
	let cntr = end0.plus(end1).times(0.5);
	let vc= end1.difference(end0);
	let hvc = vc.times(0.5);
	let nvc = vc.normalize();
	let nhvc = hvc.plus(nvc.times(0.5*ln));
	let nend0 = cntr.difference(nhvc);
	let nend1 = cntr.plus(nhvc);
	return LineSegment.mk(nend0,nend1);
}
  
LineSegment.intersect = function (line1) {
	let verbose = false;
  let line0 = this;
  let x0 = line0.end0.x;
  let y0 = line0.end0.y;
  let x1 = line1.end0.x;
  let y1 = line1.end0.y;
	let e1x0 = line0.end1.x;
	let e1y0 = line0.end1.y;
	let e1x1 = line1.end1.x;
	let e1y1 = line1.end1.y;
  let maxX0 = Math.max(line0.end0.x,line0.end1.x);
  let minX0 = Math.min(line0.end0.x,line0.end1.x);
  let maxX1 = Math.max(line1.end0.x,line1.end1.x);
  let minX1 = Math.min(line1.end0.x,line1.end1.x);
  if ((minX1 > maxX0)||(minX0 > maxX1)) {
		if (verbose) {
			console.log('No Intersect 0 [[',x0,y0,'][',e1x0,e1y0,']] [[',x1,y1,'][',e1x1,e1y1,']]');
		}
    return false;
  }
  let maxY0 = Math.max(line0.end0.y,line0.end1.y);
  let minY0 = Math.min(line0.end0.y,line0.end1.y);
  let maxY1 = Math.max(line1.end0.y,line1.end1.y);
  let minY1 = Math.min(line1.end0.y,line1.end1.y);
  if ((minY1 > maxY0)||(minY0 > maxY1)) {		
	  if (verbose) {
			console.log('No Intersect 1 [[',x0,y0,'][',e1x0,e1y0,']] [[',x1,y1,'][',e1x1,e1y1,']]');
		}

		
    return false;
  }
 
  let n = line0.end1.difference(line0.end0).normalize().normal();
  let nx = n.x;
  let ny = n.y;
  let v1 = line1.end1.difference(line1.end0);
  let length = v1.length();
  let d = v1.times(1/length);
  let dx = d.x;
  let dy = d.y;
  let den = (dx*nx + dy*ny);
  if (Math.abs(den) < 0.001) { // lines are parallel
    let distN0 = line0.end0.dotp(n);
    let distN1 = line1.end0.dotp(n);
		if (Math.abs(distN1-distN0) < 0.001) {
			if (verbose) {
				console.log('Intersect 2 [[',x0,y0,'][',e1x0,e1y0,']] [[',x1,y1,'][',e1x1,e1y1,']]');
			}
			return true;
		} else {
      return false;
		}
  }
  let t = -((y1-y0)*ny + (x1-x0)*nx)/den;
  if ((t<0) || (t > length+0)) {// line1 terminates before it meets line0
		if (verbose) {
			console.log('No Intersect 3 [[',x0,y0,'][',e1x0,e1y0,']] [[',x1,y1,'][',e1x1,e1y1,']]');
		}
    return false;
  }
  let ip = line1.end0.plus(d.times(t));// intersection point
  if (ip.difference(line0.end0).dotp(ip.difference(line0.end1))<=0) {
    return ip;
  }
	if (verbose) {
		console.log('No Intersect 4 [[',x0,y0,'][',e1x0,e1y0,']] [[',x1,y1,'][',e1x1,e1y1,']]');
	}
  return false;
  
}
LineSegment.intersectsLineSegment = function (seg) {
	return !!this.intersect(seg);
}
LineSegment.distanceTo = function (p) {
  let {end0,end1} = this;
  let vec = end1.difference(end0);
  let vecln = vec.length();
  let nvec = vec.times(1/vecln);
  let nnvec = vec.normal();
  let e0v = nvec.dotp(end0);
  let e1v = nvec.dotp(end1);
  let pv = nvec.dotp(pv);
 //let d = pv - e0v; // distance along vec
 // let between = ((e0v <= pv) && (pv <= e1v)) || ((e1v <= pv) && (pv <= e0v));
  let d;
  let between = ((e0v <= pv) && (pv <= e1v));
  if (between)  {
    let e0nv = nnvec.dotp(end0);
    let pnv = nnvec.dotp(pv);
    d = Math.abs(e0nv-pnv);
  } else {
    let e0d = end0.distance(p);
    let e1d = end1.distance(p);
    d = Math.min(e0d,e1d);
  }
  return d;
}

const separation1  = function (ths,seg) {
  let {end0:t0,end1:t1} = ths;
  let tvec = t1.difference(t0);
  let tvecln = tvec.length();
  let ntvec = tvec.times(1/tvecln);
  let nntvec = tvec.normal();
  let t0v = ntvec.dotp(t0);
  let t1v = ntvec.dotp(t1);
  let {end0:e0,end1:e1} = seg;
  let e0v = ntvec.dotp(e0);
  let e1v = ntvec.dotp(e1);
  if (e0v > e1v) {
    let tmp = e0v;
    e0v = e1v;
    e1v = tmp;
  }
  let e0beyondt1 = e0v >= t0v;
  if (e0beyondt1) {
    let e0distt1 = e0.distance(t1);
    let e1distt1 = e1.distance(t1);
    return Math.min(e0distt1,e1distt1);
  }
  let e1beforet0 = e1v <= t0v;
  if (e1beforet0) {
    let e0distt0 = e0.distance(t0);
    let e1distt0 = e1.distance(t0);
    return Math.min(e0distt0,e1distt0);  
  }
  const distToPoint = function (p) {
     let tv = nntvec.dotp(e0);
     let pv = nntvec.dotp(p);
     return Math.abs(tv-pv);
  }
  let p0,pi;
  let evec = e1.difference(e0);
  if ((t0v<e1v) && (e1v <t1v)) {
     let fr = (t0v-e0v)/(e1v - e0v);
     let p = e0.plus(evec.times(fr));
     let d0 = distToPoint(p);
     let d1 = distToPoint(e1);
     return Math.min(d0,d1);
  }
  let fr = (t1v-e0v)/(e1v - e0v);
  let p = e0.plus(evec.times(fr));
	let d0 = distToPoint(p);
	let d1 = distToPoint(e0);
	return Math.min(d0,d1);
}

LineSegment.separation = function (seg) {
  let sep0 = separation1(this,seg);
  let sep1 = separation1(seg,this);
  return Math.min(sep0,sep1);
}
      
LineSegment.allIntersections = function (segs) {
	let rs = [];
	segs.forEach( (seg) => {
		if (seg === this) {
			return;
		}
	  let intr = this.intersect(seg);
		if (intr) {
		  rs.push([intr,seg]);
		}
	});
	let {end0,end1} = this;
	let vec = end1.difference(end0);
	let {x,y} = vec;
	let orderByX = Math.abs(x) > Math.abs(y);
	let reverse = orderByX?x<0:y<0;
	const compare = function (a,b) {
		let va = orderByX?a[0].x:a[0].y;
		let vb = orderByX?b[0].x:b[0].y;
		if (reverse) {
			let tmp = va;
			va = vb;
			vb = tmp;
		}
		if (va < vb) {
			return -1;
		} else if (va === vb) {
			return 0;
		} else {
			return 1;
		}
	}
	rs.sort(compare);
	return rs;

};

Line.sortIntersections = function (intrs,orderBy) {
	let rs = intrs.map((x) => x);
	let compare = function (a,b,orderBy) {
		let av = orderBy==='x'?a[0].x:a[0].y;
		let bv = orderBy==='y'?a[0].x:a[0].y;
		if (av < bv) return -1;
		if (av === bv) return 0;
		return 1;
	}
	rs.sort(compare);
}

let Circle = geomr.set("Circle",core.ObjectNode.mk()).__namedType();


Circle.mk = function(center,radius) {
  let rs = Object.create(Circle);
  rs.set('center',center.copy());
  rs.radius = radius;
  return rs;
}

Circle.intersectsCircle = function (crc) {
	let {center:tc,radius:tr} = this;
	let {center:cc,radius:cr} = crc;
	let d = tc.distance(cc);
	return d <(tr + cr);
}

Circle.intersects = function (target) {
  return this.intersectsCircle(target);
}
	
Circle.intersectLine = function (point,vec) {
  let px = point.x;
  let py = point.y;
  let center = this.center;
  let r = this.radius;
  let cx = center.x;
  let cy = center.y;
  let vx = vec.x;
  let vy = vec.y;
  let qx = px-cx;
  let qy = py-cy;
  /* (qx + t*vx)*(qx + t*vx) + (qy + t*vy)*(qy + t*vy) = r*r
  qx*qx + 2*t*vx*qx + t*t*vx*vx + qy*qy + 2*t*vy*qy + t*t*vy*vy 
  
  qy*qy + t * 2*(qx*vx +  qy*vy) + t*t * (vx + vy) = r*r */
  let a =  vx*vx + vy*vy;
  let b = 2*(qx*vx + qy*vy);
  let c = qx*qx + qy*qy - r*r;
  let sqz = b*b - 4*a*c;
  if (sqz <= 0) {
    return undefined;
  }
  let z = Math.sqrt(sqz);
  let t0 = (z - b)/(2*a);
  let t1 = -(z+b)/(2*a);
  let s0 = point.plus(vec.times(t0));
  let s1 = point.plus(vec.times(t1));
  let d0 = s0.distance(center);
  let d1 = s1.distance(center);
  return [s0,s1];
}

Circle.contains = function (point) {
  let v = point.difference(this.center);
  let {x,y}= v;
  let r = this.radius;
  return (x*x + y*y) < r*r;
}

geomr.set("Arc",core.ObjectNode.mk()).__namedType();
let Arc = geomr.Arc;
 

// two argument forms: center, angle0, angle1, or end0,end1,radius
Arc.mk = function (center,angle0,angle1,radius) {
	let rs = Object.create(Arc);
	if (typeof angle0 === 'number') {
	  rs.center = center;
		rs.angle0 = angle0;
		rs.angle1 = angle1;
		rs.radius = radius;
	} else {
		let a = center;
		let b = angle0;
		let rv = angle1;
		let r = Math.abs(rv);
		let vec = b.difference(a);
		let ln = vec.length();
		let c = a.plus(vec.times(0.5));
	  let excess = r -  (ln/2);
		let vnrm = vec.times(1/ln);
		let nrm = vnrm.normal();
	  let cntr =c.plus(nrm.times(rv>0?excess:-excess));
		rs.set('center',cntr);
		let avec = a.difference(cntr);
		let bvec = b.difference(cntr);
		if  (1 || (r > 0)) {
		  rs.angle0 = Math.atan2(avec.y,avec.x);
		  rs.angle1 = Math.atan2(bvec.y,bvec.x);
		} else {
			rs.angle1 = Math.atan2(avec.y,avec.x);
		  rs.angle0 = Math.atan2(bvec.y,bvec.x);
		}
		rs.radius = Math.abs(r);
	}
	return rs;
}

Arc.pointAlong = function (fr) {
	let {center,angle0,angle1,radius} = this;
	let angle = angle0 + fr*(angle1-angle0);
	let vec = Point.mk(Math.cos(angle),Math.sin(angle));
  let rs = center.plus(vec.times(radius));
	return rs;
}

geomr.set("Rectangle",core.ObjectNode.mk()).__namedType();
let Rectangle = geomr.Rectangle;
// takes corner,extent or {corner:c,extent:e,style:s} style being optional, or no args
// Rectangles without styles are often used for purely computational purpose - never drawn.
Rectangle.mk = function (a0,a1) {
  let rs = Object.create(Rectangle);
  let c,e,style;
  if (!a0) {
    return rs;
  }
  if (a1) {
    c = a0;
    e = a1;
  } else {
    if (a0.style) {
      style = core.draw.Style.mk();
      rs.set("style",style);
      core.extend(style,a0.style);
    }
    c = a0.corner;
    e = a0.extent;
  }
  rs.__setPoint("corner",c);
  rs.__setPoint("extent",e);
  return rs;
}

Rectangle.mkCentered = function (center,extent) {
	let {x,y} = extent;
	let {x:cx,y:cy} = center;
	let corner = Point.mk(cx-0.5*x,cy - 0.5*y);
	let rs = Rectangle.mk(corner,extent);
	return rs;
}

  
Rectangle.toString = function () {
  let corner,extent;
  ({corner,extent} = this);
  return '[['+corner.x+','+corner.y+'],['+extent.x+','+extent.y+']]';
}

Rectangle.hasNaN = function () {
  let crn = this.corner;
  let xt = this.extent;
  if (crn) {
    if (isNaN(crn.x) || isNaN(xt.y)) {
      return true;
    }
  }
  if (xt) {
    if (isNaN(xt.x) || isNaN(xt.y)) {
      return true;
    }
  }
}


Rectangle.addSides = function () {
  let hw,hh;
	let {corner,extent} = this;
	hw = (extent.x)/2;
	hh = (extent.y)/2;
	let {x:cx,y:cy} = corner;
	let {x:ex,y:ey} = extent;
  let UL = Point.mk(cx,cy)
  let UR = Point.mk(cx+ex,cy)
  let LL = Point.mk(cx,cy+ey)
  let LR  = Point.mk(cx+ex,cy+ey);
  let sides = this.set('sides',core.ArrayNode.mk());
  sides.push(geom.LineSegment.mk(UL,UR));
	sides.push(geom.LineSegment.mk(UR,LR));
  sides.push(geom.LineSegment.mk(LR,LL));
  sides.push(geom.LineSegment.mk(LL,UL));
  return sides;
}


Rectangle.set("corner",Point.mk());
Rectangle.set("extent",Point.mk(1,1));

Rectangle.corners = function () {
  let rs = [];
  let c = this.corner;
  let cx = c.x,cy = c.y;
  let xt = this.extent;
  let xtx = xt.x;
  let xty = xt.y;
  // right hand rule
  rs.push(Point.mk(cx+xtx,cy+xty));
  rs.push(Point.mk(cx+xtx,cy));
  rs.push(c);
  rs.push(Point.mk(cx,cy+xty));
  return rs;
}

Rectangle.xBounds = function () {
	let {corner,extent} = this
	let lb = corner.x;
	let ub = corner.x + extent.x;
	return Interval.mk(lb,ub);
}
Rectangle.yBounds = function () {
	let {corner,extent} = this
	let lb = corner.y;
	let ub = corner.y + extent.y;
	return Interval.mk(lb,ub);
}

Rectangle.intersectsRectangle = function (rect) {
	let xb0 = this.xBounds();
	let xb1 = rect.xBounds();
	let yb0 = this.yBounds();
	let yb1 = rect.yBounds();
	let xi = xb0.intersectsInterval(xb1);
	let yi = yb0.intersectsInterval(yb1);
	let rs = xi && yi;
	if (!rs) {
		debugger;
		xi = xb0.intersectsInterval(xb1);
	 yi = yb0.intersectsInterval(yb1);
		
	}
	return rs;
}

Rectangle.intersectsLineSegment = function (seg) {
	let xb0 = this.xBounds();
	let yb0 = this.yBounds();
	let xb1 = seg.xBounds();
	let yb1 = seg.yBounds();
	if ((!xb0.intersectsInterval(xb1)) || (!yb0.intersectsInterval(yb1))) {
		return false;
	}
	let {end0,end1} = seg;
	if (this.contains(end0)||this.contains(end1)) {
		return true;
	}
// now the hard case
  let sides = this.sides();
	debugger;
	let rs = seg.intersect(sides[0]) || seg.intersect(sides[1]) || seg.intersect(sides[2]) || seg.intersect(sides[3]);
  return rs;
}
 Rectangle.intersects = function (g) {
	 if (Rectangle.isPrototypeOf(g)) {
		 return this.intersectsRectangle(g);
	 } else if (LineSegment.isPrototypeOf(g)) {
		 return this.intersectsLineSegment(g);
	 } else {
		 error('unsupported case for Rectangle.intersects');
	 }
 }

LineSegment.intersects = function (g) {
	 if (Rectangle.isPrototypeOf(g)) {
		 return g.intersectsRectangle(this);
	 } else if (LineSegment.isPrototypeOf(g)) {
		 return this.intersectsLineSegment(g);
	 } else {
		 error('unsupported case for LineSegment.intersects');
	 }
}


Rectangle.sides = function () {
  let corners = this.corners();
  let rs = [];
  rs.push(LineSegment.mk(corners[0].copy(),corners[1].copy()));
  rs.push(LineSegment.mk(corners[1].copy(),corners[2].copy()));
  rs.push(LineSegment.mk(corners[2].copy(),corners[3].copy()));
  rs.push(LineSegment.mk(corners[3].copy(),corners[0].copy()));
  return rs;
}
const pointArrayToLineSegments = function (ar) {
  let ln = ar.length;
	let rs = [];
	for (let i=0;i<ln-1;i++) {
		let lns = LineSegment.mk(ar[i],ar[i+1]);
		rs.push(lns);
	}
	return rs;
}
// The point is some point outide the rectangle. This determines where a ray from the center with the given direction 
// intersects the rectangle. Used in graph construction interface. Could be optimized in several ways
// retuns {interesection:Point,side:integer,sideFraction:real}. sideFraction is the fraction  of the way along the side
// at which the interesection point appears.
let rp_time = 0;

Rectangle.peripheryAtDirection = function(direction) {
  let tms = Date.now();
  let sides = this.sides();
  let dim = 2*Math.max(this.extent.x,this.extent.y);
  let center = this.center();
  let line = LineSegment.mk(center,center.plus(direction.times(dim)));
  for (let i=0;i<4;i++) {
    let side = sides[i];
    let intersection = line.intersect(sides[i]);
    if (intersection) {
      let fractionAlong =  ((intersection.difference(side.end0)).length())/(side.length());
      rp_time += Date.now() - tms;
      return {intersection,side:i,sideFraction:fractionAlong};
    }
  }
}

Rectangle.alongPeriphery = function (edge,fraction) {
  let sides = this.sides();
  let side = sides[edge];
  return side.pointAlong(fraction);
}


Rectangle.expandBy = function (x,y) {
  let xt = this.extent;
  let c = this.corner;
  let nex = xt.x + x;
  let ncx = c.x - 0.5*x;
  let ney =  xt.y + y;
  let ncy =  c.y -0.5*y;
  return Rectangle.mk(Point.mk(ncx,ncy),Point.mk(nex,ney));
}

  
// expand the extent of this to at least x in x and y in y

Rectangle.expandTo = function (x,y) {
  let xt = this.extent;
  let xx = (xt.x < x)?(x-xt.x):0;
  let yx = (xt.y < y)?(y-xt.y):0;
  if ((xx === 0) && (yx === 0)) {
    return  this;
  }
  return this.expandBy(xx,yx);
}
  

// the bounding rectangle of an array of points

const boundingRectangle = function (pnts) {
  let ln = pnts.length;
  if (ln===0) {
    return undefined;
  }
  let p0 = pnts[0];
  let minx = p0.x;
  let maxx = minx;
  let miny = p0.y;
  let maxy = miny;
  for (let i=1;i<ln;i++) {
    let p = pnts[i];
    let px = p.x,py = p.y;
    maxx = Math.max(maxx,px);
    minx = Math.min(minx,px);
    maxy = Math.max(maxy,py);
    miny = Math.min(miny,py);
  }
  return Rectangle.mk({corner:Point.mk(minx,miny),extent:Point.mk(maxx-minx,maxy-miny)});
}

// this ignores any transforms the rectangles might have 
Rectangle.extendBy = function (xby) {
  let corners = this.corners().concat(xby.corners());
  return boundingRectangle(corners);
}

const boundsForRectangles = function (rectangles) {
  let ln = rectangles.length;
  if (ln === 0) {
    return undefined;
  }
  let allCorners = [];
  rectangles.forEach(function (rectangle) {
    let corners = rectangle.corners();
    corners.forEach(function (corner) {
      allCorners.push(corner);
    });
  });
  return boundingRectangle(allCorners);
}
    
  
Rectangle.center = function () {
  let xt = this.extent;
  let c = this.corner;
  return Point.mk(c.x + 0.5*xt.x,c.y + 0.5*xt.y);
}


Rectangle.width = function () {
  return this.extent.x
}


Rectangle.height = function () {
  return this.extent.y
}

Rectangle.scaleCentered = function (sc) { // while maintaining the same center
  let wd = this.width();
  let ht = this.height();
  let cnt = this.center();
  let swd =  sc * wd;
  let sht =  sc * ht;
  let crn = cnt.plus(Point.mk(-0.5 * swd,-0.5 * sht));
  let xt = Point.mk(swd,sht);
  return Rectangle.mk({corner:crn,extent:xt});
}

Rectangle.plus = function (p) { // __translate
  let rs = Rectangle.mk({corner:this.corner.plus(p),extent:this.extent});
  return rs;
}

Rectangle.contains = function (p) {
  let c = this.corner;
  let px = p.x;
  let py,ex;
  if (px < c.x) {
    return false;
  }
  py = p.y;
  if (py < c.y) {
    return false;
  }
  ex = this.extent;
  if (px > c.x + ex.x) {
    return false;
  }
  if (py > c.y + ex.y) {
    return false;
  }
  return true;
}


  
Rectangle.distance2 = function (p,msf) {
  if (!this.contains1(p)) {
    return undefined;
  }
  let c = this.corner;
  let xt = this.extent;
  let ux = c.x + xt.x;
  let uy = c.y + xt.y;
  let d = Math.min(p.x - c.x,ux - p.x,p.y - c.y,uy - p.y);
  if (d < msf) {
    return d;
  }
  return undefined;
}

// for rotation, all four corners need consideration
Rectangle.applyTransform = function (tr) {
  let rt = tr.rotation;
  let crn,xt,sc,rcrn,rxt,corners,xcorners;
   if (rt === 0) {
    crn = this.corner;
    xt = this.extent;
    sc = tr.scale;
    rcrn = crn.applyTransform(tr);
    rxt = xt.times(sc);
    return Rectangle.mk({corner:rcrn,extent:rxt});
  } else {
    corners = this.corners();
    xcorners = corners.map(function (c) {return c.applyTransform(tr)});
    return boundingRectangle(xcorners);
  }
  // the transform which fitst the rectangle this evenly into the rectangle dst
}



Rectangle.applyInverse = function (xf) {
  let tcorner = xf.applyInverse(this.corner);
  let textent = this.extent.times(1/xf.scale);
  let rs = Rectangle.mk(tcorner,textent);
  return rs;
}
  
Rectangle.upperLeft = function () {
  return this.corner;
}

Rectangle.lowerLeft = function () {
  let corner = this.corner;
  let  x =  corner.x;
  let y = corner.y + this.extent.y;
  return Point.mk(x,y);
}



Rectangle.upperRight = function () {
  let corner = this.corner;
  let  x =  corner.x + this.extent.x;
  let y = corner.y;
  return Point.mk(x,y);
}


Rectangle.lowerRight = function () {
  let corner = this.corner;
  let  x =  corner.x + this.extent.x;
  let y = corner.y + this.extent.y;
  return Point.mk(x,y);
}



Rectangle.containsRectangle = function (r) {
  return this.contains(r.upperLeft()) && this.contains(r.lowerRight());
}
 
//  does not work with rotations
Transform.times = function (tr) {
  let sc0 = this.scale;
  let sc0N,sc0x,sc0y,sc1N,sc1x,sc1y,tr0,tr1,sc,sc1,scx,scy,trX,trY,rtr,rs;
  if (typeof sc0 === "number") {
    sc0N = 1;
    sc0x = sc0;
    sc0y = sc0;
  } else {
    sc0x = sc0.x;
    sc0y = sc0.y;
  }
  sc1 = tr.scale;
  if (typeof sc1 === "number") {
    sc1N = 1;
    sc1x = sc1;
    sc1y = sc1;
  } else {
    sc1x = sc0.x;
    sc1y = sc0.y;
  }
  tr0 = this.translation;
  tr1 = tr.translation;
  if (sc0N && sc1N) {
    sc = sc0 * sc1;
  } else {
    scx = sc0x*sc1x;
    scy = sc0y*sc1y;
    sc = Point.mk(scx,scy);
  } 
  trX = sc1x * tr0.x + tr1.x;
  trY = sc1y * tr0.y + tr1.y;
  rtr = Point.mk(trX,trY);
  rs = Transform.mk({scale:sc,translation:rtr});
  return rs;
}
    
    
    
Rectangle.transformTo = function (dst) {
  let cnt = this.center();
  let dcnt = dst.center();
  let wd = this.width();
  let ht = this.height();
  let dwd = dst.width();
  let dht = dst.height();
  let wdr,htr,r,x,y,rs;
  if ((wd===0)&&(ht===0)) {
    return Transform.mk({translation:Point.mk(0,0),scale:1});
  }
  wdr = (wd === 0)?Infinity:dwd/wd;
  htr = (ht === 0)?Infinity:dht/ht;
  r = Math.min(wdr,htr);
  x = dcnt.x - (cnt.x)*r;
  y = dcnt.y - (cnt.y)*r;
  rs = Transform.mk({translation:Point.mk(x,y),scale:r});
  return rs;
}
  
// rectangle is  given relative  to node's coords
Rectangle.toGlobalCoords = function (node) {
  let corner = this.corner;
  let outerCorner = corner.plus(this.extent);
  let globalCorner = node.toGlobalCoords(corner);
  let globalOuter = node.toGlobalCoords(outerCorner);
  return Rectangle.mk(globalCorner,globalOuter.difference(globalCorner));
}

Rectangle.toAncestorCoords = function (node,ancestor) {
  let corner = this.corner;
  let outerCorner = corner.plus(this.extent);
  let ancestorCorner = node.toAncestorCoords(corner,ancestor);
  let ancestorOuter = node.toAncestorCoords(outerCorner,ancestor);
  return Rectangle.mk(ancestorCorner,ancestorOuter.difference(ancestorCorner));
}

// rectangle is given relative to global coords - returns relative to ownCoords
Rectangle.toOwnCoords = function (node) {
  let corner = this.corner;
  let outerCorner = corner.plus(this.extent);
  let ownCorner = toOwnCoords(node,corner);
  let ownOuter = toOwnCoords(node,outerCorner);
  return Rectangle.mk(ownCorner,ownOuter.difference(ownCorner));
}

  
const mkSquare = function (center,sz) {
  let {x,y} = center;
  let hsz = sz/2;
  let lx = x-hsz;
  let ly = y-hsz;
  return Rectangle.mk([lx,ly],[sz,sz]);
}

core.ObjectNode.__countShapes = function () {
  let cnt = 1;
  this.shapeTreeIterate(function (c) {
    cnt = cnt + c.__countShapes();
  });
  return cnt;
}


core.ArrayNode.__countShapes = core.ObjectNode.__countShapes;

const flipY = function (pnts,bias) {
  let rs = core.Array.mk();
  pnts.forEach(function (p) {
    let fp = Point.mk(p.x,bias -p.y);
    rs.push(fp);
  });
  return rs;
}

// coverage is data space, extent is image space.
// this maps the former to the later, with a y flip
// used for graphing
const transformForGraph = function (coverage,extent) {
  let cvxt = coverage.extent;
  let xtxt = extent.extent;
  let cvc = coverage.corner;
  let xtc = extent.corner;
  let scx = (xtxt.x)/(cvxt.x);
  let scy = -(xtxt.y)/(cvxt.y);
  let tx = xtc.x - scx * cvc.x;
  let ty = (xtc.y + xtxt.y) - scy * cvc.y;
  let tr = Point.mk(tx,ty);
  let sc = Point.mk(scx,scy);
  let rs = Transform.mk({scale:sc,translation:tr});
  return rs;
}

const degreesToRadians =  function (n) {return Math.PI * (n/180);}

const radiansToDegrees =  function (n) {return 180 * (n/Math.PI);}

Rectangle.randomPoint = function () {
  let c = this.corner;
  let ex = this.extent;
  let x = c.x + (ex.x)*Math.random();
  let y = c.y +(ex.y)*Math.random();
  return Point.mk(x,y);
}


export {rotationMatrix,movetoInGlobalCoords,toOwnCoords,toPoint,angleToDirection,Point,Line,Rectangle,Transform,Ray,degreesToRadians,
        LineSegment,Circle,Arc,boundsForRectangles,rp_time,pointArrayToLineSegments};
// Copyright 2019 Chris Goad
// License: MIT


geomr.set("Point3d",core.ObjectNode.mk()).__namedType();
let Point3d = geomr.Point3d;


Point3d.mk = function (x,y,z) {
  let rs = Object.create(Point3d);
  if (typeof x==="number") {
    rs.x = x;
    rs.y = y;
		rs.z = z;
  } else {
    rs.x = 0;
    rs.y =0;
    rs.z =0;
  }
  return rs;
}
  


Point3d.copy = function () {
  return Point3d.mk(this.x,this.y,this.z);
};

Point3d.difference = function (q) {
  let p = this;
  return Point3d.mk(p.x - q.x,p.y - q.y,p.z - q.z);
};


Point3d.times = function (s) {
  let p = this;
  return Point3d.mk(s*p.x,s*p.y,s*p.z);
};



Point3d.minus = function () {
  let p = this;
  return Point3d.mk(-p.x,-p.y,-p.z);
};




Point3d.plus = function (q) {
  let p = this;
  return Point3d.mk(p.x + q.x,p.y + q.y,p.z + q.z);
};


Point3d.length = function () {
  let {x,y,z} = this;
  return Math.sqrt(x*x + y*y + z*z);
}


Point3d.copy = function () {
  return Point3d.mk(this.x,this.y,this.z);
}
  
  
Point3d.copyto = function (src) {
  this.x = src.x;
  this.y = src.y;
  this.z = src.z;
  return this; 
}

Point3d.difference = function (q) {
  let p = this;
  return Point3d.mk(p.x - q.x,p.y - q.y,p.z - q.z);
}

Point3d.directionTo = function (pnt) {
    return pnt.difference(this).normalize();
}

Point3d.setCoords = function (x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

// if p is null, compute distance from origin
Point3d.distance = function (p) {
  let vx = this.x - p.x;
  let vy = this.y - p.y;
  let vz = this.z - p.z;
  return Math.sqrt(vx*vx + vy * vy + vz*vz);
  
}


Point3d.times = function (f) {
  let p = this;
  return Point3d.mk(f*p.x,f*p.y,f*p.z);
}


Point3d.normalize = function () {
  let ln = this.length();
  return Point3d.mk(this.x/ln,this.y/ln,this.z/ln);
}


Point3d.minus = function () {
  return Point3.mk(-this.x,-this.y,-this.z);
}

Point3d.dotp = function (p) {
  return this.x * p.x + this.y * p.y + this.z * p.z;
}



Point3d.interpolate = function (dst,fc) {
   let d = dst.difference(this);
   let vc  = d.times(fc);
   let rs = this.plus(vc);
   return  rs;
}



Point3d.toString = function () {
  let {x,y,z} = this;
  return "["+x+","+y+","+z+"]";
}

Point.to3d = function () {
	let rs = Point3d.mk(this.x,this.y,0);
	return rs;
}

geomr.set("Segment3d",core.ObjectNode.mk()).__namedType();


let Segment3d = geomr.Segment3d;

Segment3d.mk = function (end0,end1,dontCopy) {
  let rs = Object.create(Segment3d);
  if (!end0) {
    return rs;
  }
  if (dontCopy) {
    rs.set('end0',end0);
    rs.set('end1',end1);
  } else {
    rs.set('end0',end0.copy());
    rs.set('end1',end1.copy());
  }
  return rs;
}

LineSegment.to3d = function() {
	let {end0,end1} = this;
	return Segment3d.mk(end0.to3d(),end1.to3d())
}

Segment3d.split = function (fr) {
	let {end0,end1} = this;
	let vec = end1.difference(end0);
	let rs0e1 = end0.plus(vec.times(0.5*(1-fr)));
	let rs1e0 = end1.difference(vec.times(0.5*(1-fr)));
	let rs0 = Segment3d.mk(end0,rs0e1);
	let rs1 = Segment3d.mk(rs1e0,end1);
	return [rs0,rs1];
}

geomr.set("Shape3d",core.ObjectNode.mk()).__namedType();

let Shape3d = geomr.Shape3d;

Shape3d.mk = function (parts,transform) {
	let rs = Object.create(Shape3d);
	if (transform) {
		rs.set('transform',transform);
	}
	let rparts = core.ArrayNode.mk();
	parts.forEach((part) => rparts.push(part));
	rs.set('parts',rparts);
	return rs;
}





geomr.set("Camera",core.ObjectNode.mk()).__namedType();
let Camera = geomr.Camera;


// simple: axis is "x" "y" or "z"
Camera.mk = function (focalPoint,focalLength,scaling,axis) {
  let rs = Object.create(Camera);
	rs.focalPoint = focalPoint;
	rs.focalLength = focalLength;
	rs.scaling = scaling;
	rs.axis = axis;
  return rs;
}

Camera.projectPoint3d = function (ip,transform) {
	let {focalPoint:fp,focalLength:fl,scaling:s,axis} = this;
	let upsideDown = 0;
	if (ip === undefined) {
		debugger; //keep
	}
	let p = transform?transform.apply(ip):ip;
	let v = fp.difference(p);
	let t,rs;
	if (axis === 'x') {
		t = fl/(v.x);
	  rs = Point.mk(s*t*v.y,s*t*v.z);
	} else if (axis === 'z') {
		t = (upsideDown?1:-1)*fl/(v.z);
		rs = Point.mk(s*t*v.x,s*t*v.y);
		}
	if (ip.hideMe) {
		//console.log('point hide me');
		rs.hideMe = 1;
	}
//	console.log('project ',ip.x,ip.y,ip.z,' rs ',rs.x,rs.y);
	rs.origin = p;
	return rs;
}

Camera.projectSegment3d = function (sg,transform) {
  let e0 = this.projectPoint3d(sg.end0,transform);
  let e1 = this.projectPoint3d(sg.end1,transform);
	let rs = LineSegment.mk(e0,e1);
	rs.origin = sg;
	return rs;
}



Camera.projectShape3d = function (shp,itrans) {
	let strans = shp.transform;
	let trans;
	if (itrans) {
		if (strans) {
			trans = itrans.times(strans);
		} else {
			trans = strans;
		}
	} else {
		trans = strans;
	}
	let hideIt = this.hideIt;
	if (trans) {
	  let xfx = trans.apply(Point3d.mk(1,0,0));
	  let xfy = trans.apply(Point3d.mk(0,1,0));
	  let xfz = trans.apply(Point3d.mk(0,0,1));
	  hideIt = hideIt || (xfz.z <= 0);
	}
	if (hideIt) {
	//debugger;
	}
	let parts = shp.parts;
	let rs = core.ArrayNode.mk();
 // parts.forEach( (part) => rs.push(this.project(part,trans)));
  parts.forEach( (part) => {
		let proto = Object.getPrototypeOf(part);
		part.hideIt = hideIt;
		if (proto === Shape3d) {
			let subparts = part.parts;
			let prj = this.project(part,trans);
			prj.forEach( (p) => rs.push(p));
		//	subparts.forEach( (subpart) => rs.push(this.project(subpart,trans)));
		} else {
      rs.push(this.project(part,trans));
		}
	});
	return rs;
}

Camera.project = function (shp,trans) {
	let proto = Object.getPrototypeOf(shp);
	if (proto === Point3d) {
		return this.projectPoint3d(shp,trans);
	}
	if (proto === Segment3d) {
		return this.projectSegment3d(shp,trans);
	}
	if (proto === Shape3d) {
		return this.projectShape3d(shp,trans);
	}
}
	


geomr.set("Affine3d",core.ArrayNode.mk());
let Affine3d = geomr.Affine3d;

//  i = row, j = column ; column major
Affine3d.select = function (i,j) {
	return this[i*4+j];
}

Affine3d.mkFromCols = function (ic1,ic2,ic3,ic4) {
	let rs = Object.create(Affine3d);
	let c1,c2,c3,c4;
	if (ic2) {
		c1 = ic1;
		c2 = ic2;
		c3 = ic3;
		c4 = ic4;
	} else {
		c1 = ic1[0];
		c2 = ic1[1];
		c3 = ic1[2];
		c4 = ic1[3];
	}
	c1.forEach((el) => rs.push(el));
	c2.forEach((el) => rs.push(el));
	c3.forEach((el) => rs.push(el));
	c4.forEach((el) => rs.push(el));
	return rs;
}

Affine3d.apply = function (p) {
	//debugger;
	let {x,y,z} = p;
	let [a11,a21,a31,a41,a12,a22,a32,a42,a13,a23,a33,a43,a14,a24,a34,a44] = this;
/*	let a11 = this[0];
	let a21 = this[1];
	let a31 = this[2];
	let a41 = this[3];
	let a12 = this[4];
	let a22 = this[5];
	let a32 = this[6];
	let a42 = this[7];	
	let a13 = this[8];
	let a23 = this[9];
	let a33 = this[10];
	let a43 = this[11];
	let a14 = this[12];
	let a24 = this[13];
	let a34 = this[14];
	let a44 = this[15];*/
	let rx = a11*x + a12*y + a13*z + a14;
	let ry = a21*x + a22*y + a23*z + a24;
	let rz = a31*x + a32*y + a33*z + a34;
	return Point3d.mk(rx,ry,rz);
}

Affine3d.row = function (n) {
	let rs = [];
	let st = n;
	for (let i=0;i<4;i++) {
		rs.push(this[st+4*i]);
	}
	return rs;
}


Affine3d.col = function (n) {
	let rs = [];
	let st = n*4;
	for (let i=0;i<4;i++) {
		rs.push(this[st+i]);
	}
	return rs;
}

Affine3d.identity = function () {
	let c1 = [1,0,0,0];
	let c2= [0,1,0,0];
	let c3= [0,0,1,0];
	let c4= [0,0,0,1];
	let rs = Affine3d.mkFromCols(c1,c2,c3,c4);
	return rs;
}

Affine3d.test = function () {
	let c1 = [11,21,31,41];
	let c2= [12,22,32,42];
	let c3= [13,23,33,43];
	let c4= [14,24,34,44];
	let rs = Affine3d.mkFromCols(c1,c2,c3,c4);
	return rs;
}
Affine3d.testRow = function (n) {
	let tst = Affine3d.test();
	return tst.row(n);
}
Affine3d.testCol = function (n) {
	let tst = Affine3d.test();
	return tst.col(n);
}


Affine3d.times = function (b) {
	//debugger;
	let aRows = [];
	let bCols = [];
	let rCols = []
	for (let i=0;i<4;i++) {
		aRows.push(this.row(i));
	}
	for (let i=0;i<4;i++) {
		bCols.push(b.col(i));
	}
	const aDotp = function (a,b) {
		let ln = a.length;
		let rs = 0;
		for (let i=0;i<ln;i++) {
			rs += a[i]*b[i];
		}
		return rs;
	}
	for (let colN = 0;colN<4;colN++) {
		let col = [];
		for (let rowN=0;rowN<4;rowN++) {
			let aR = aRows[rowN];
			let bC = bCols[colN];
		//	aR.dotp(bC);
			col.push(aDotp(aR,bC));
		}
		rCols.push(col);
	}
	let rs = Affine3d.mkFromCols(rCols);
	return rs;
 
}

Affine3d.mkRotation = function (axis,angle,translation) {
	let cos = Math.cos(angle);
	let sin = Math.sin(angle);
	let c0,c1,c2;
	if (axis === 'x') {
		c0 = [1,0,0,0];
		c1 = [0,cos,sin,0];
		c2 = [0,-sin,cos,0];
	} else if (axis === 'y') {
		c0 = [cos,0,-sin,0];
		c1 = [0,1,0,0];
		c2 = [sin,0,cos,0];
	} else if (axis === 'z') {
		c0 = [cos,sin,0,0];
		c1 = [-sin,cos,0,0];
		c2 = [0,0,1,0];
	}
	let c3;
	let tr = translation;
	if (tr) {
		let {x,y,z} = tr;
		c3 = [x,y,z,1]
	} else {
	  c3 = [0,0,0,1];
	}
	let rs = Affine3d.mkFromCols(c0,c1,c2,c3);
	return rs;
}
Affine3d.mkTranslation = function (tr) {
	//debugger;
  let {x,y,z} = tr;
  let c0 = [1,0,0,0];
  let c1 = [0,1,0,0];
  let c2 = [0,0,1,0];
  let c3 = [x,y,z,1];
	let rs = Affine3d.mkFromCols(c0,c1,c2,c3);
	return rs;
}

Point3d.crossP  = function (v) {
	let u = this;
	let {x:ux,y:uy,z:uz} = u;
	let {x:vx,y:vy,z:vz} = v;
	let rx = uy*vz - vy*uz;
	let ry = uz*vx - vz*ux;
	let rz = ux*vy - vx*uy;
	return Point3d.mk(rx,ry,rz);
}
	
	
		


geomr.set("Plane",core.ObjectNode.mk()).__namedType();
let Plane = geomr.Plane;


Plane.mk = function (point,normal) {
  let rs = Object.create(Plane);
	rs.point = point;
	rs.normal = normal;
  return rs;
}

Plane.toEquation = function () {
	let {point,normal} = this;
	let {x:a,y:b,z:c} = normal;
	let {x,y,z} = point;
	let d = -(a*x + b*y + c*z);
	return {a, b,c,d};
}
	


geomr.set("Line3d",core.ObjectNode.mk()).__namedType();
let Line3d = geomr.Line3d;


Line3d.mk = function (point,direction) {
  let rs = Object.create(Line3d);
	rs.point = point;
	rs.direction = direction;
  return rs;
}

Plane.intersect = function (line) {
	let {point:linePoint,direction} = line;
	let {x:px,y:py,z:pz} = linePoint
	let {x:dx,y:dy,z:dz} = direction;
	let equation = this.toEquation();
	let {a,b,c,d} = equation;
	let denominator = (a*dx+b*dy+c*dz);
	if (Math.abs(denominator) < 0.0002) {
		return null;
	}
	let t = -(a*px+ b*py + c*pz + d)/denominator;
	let rs = linePoint.plus(direction.times(t));
	return rs;
}


geomr.set("Cube",core.ObjectNode.mk()).__namedType();
let Cube = geomr.Cube;


Cube.mk = function (dim) {
  let rs = Object.create(Cube);
	rs.dimension  = dim;
	let v = 0.5*dim;
	let px = Plane.mk(Point3d.mk(v,0,0),Point3d.mk(1,0,0));
	let pmx = Plane.mk(Point3d.mk(-v,0,0),Point3d.mk(-1,0,0));
	let py = Plane.mk(Point3d.mk(0,v,0),Point3d.mk(0,1,0));
	let pmy = Plane.mk(Point3d.mk(0,-v,0),Point3d.mk(0,-1,0));
	let pz = Plane.mk(Point3d.mk(0,0,v),Point3d.mk(0,0,1));
	let pmz = Plane.mk(Point3d.mk(0,0,-v),Point3d.mk(0,0,-1));
  rs.sides = [px,pmx,py,pmy,pz,pmz]
  return rs;
}

Cube.within = function (p) {
	let dim = this.dimension;
	let v = 0.500001 * dim;
	let mv = -v;
	let {x,y,z} = p;
	let rs = (mv <= x) && (x <= v) && (mv <= y) && (y <= v) && (mv <= z) && (z <= v);
	return rs;
}

Cube.intersect = function (line) {
	let intersections = [];
  let sides = this.sides;
	sides.forEach((side) => {
	  let intr = side.intersect(line);
		if (intr && this.within(intr)) {
			intersections.push(intr);
		}
	});
	if (intersections.length !== 2) {
		debugger; //keep
	}
	let rs = Segment3d.mk(intersections[0],intersections[1]);
	return rs;
}
	
	
	

export {Point3d,Camera,Affine3d,Segment3d,Shape3d,Plane,Line3d,Cube	};

// Copyright 2019 Chris Goad
// License: MIT

// a geometric object is a core.Object with a transform property.  In applications, core.root is typically geometric, geometric
// descendants constitute the visible state. Some geometric objects have width and height, and possibly dimension properties.


const defineGeometric = function (geometric) {
  geometricObject = geometric;

const defineOnArray = function (name) {
  core.defineArrayNodeMethod(name,geometric[name]);
}
  

geometric.moveto = function (ix,iy) {
  let x,y,r,xf;
  let xnum = typeof ix === "number";
  let ynum = typeof iy === "number";
 
  if (xnum && ynum) {
    x = ix;
    y = iy;
  } else if (xnum) {
    x = ix;
    y = undefined;
  } else {
    ({x,y} = ix);
    r = iy;
  }
  xf = this.transform;
  if (xf) {
    if (y === undefined) {
      xf.translation.x = x;
    } else {
      xf.translation.setXY(x,y);
      if (r) {
        xf.rotation = r;
      }
    }
  }  else {
    xf = mkTranslation(x,y?y:0);
    this.set("transform",xf);
    if (r) {
      xf.rotation = r;
    }
  }
  if (this.realizeTransform) {
    this.realizeTransform();
  }
}

geometric.getTranslation = function () {
  let xf = this.transform;
  if (xf) {
    return xf.translation;
  }
  return Point.mk(0,0);
}


  
geometric.getTransform = function () {
  let rs = this.transform;
  if (!rs) {
    rs = Transform.mk();
    this.set('transform',rs);
  }
  return rs;
}


geometric.setTransform = function (transform) {
  this.set('transform',transform);
  return this;
}
geometric.getScale = function () {
  let xf = this.transform;
  if (xf) {
    return xf.scale;
  }
  return 1;
}

geometric.setScale = function (s) {
  let xf = this.transform;
  if (xf) {
    xf.scale = s;
    return;
  }
  xf = mkScaling(s);
  this.set("transform",xf);
}

geometric.getWidth = function () {
  let dim = this.dimension;
  return dim?dim:this.width;
}


geometric.getHeight = function () {
  let dim = this.dimension;
  return dim?dim:this.height;
}

geometric.getExtent = function (own) {
  let dim = own?core.getval(this,'dimension'):this.dimension;
  if (dim !== undefined) {
    return Point.mk(dim,dim);
  }
  if (own) {
    dim = this.dimension; // dimension rules, and if it is in the prototype, there is no "own" extent
    if (dim !== undefined) {
      return undefined;
    }
  }
  // for imagecontainers, for example, we set the width in the instance, but keep height in the prototype, and want this to be regarded as
  // having extent in the prototype. So both widht and height need to be in the prototype.
  if  (own) {
    if (core.getval(this,'width') && core.getval(this,'height')) {
      return Point.mk(this.width,this.height);
    } else {
      return undefined;
    }
  } else if (((typeof this.width) === 'number') && ((typeof this.height)==='number')) {
    return Point.mk(this.width,this.height);
  } else {
    return undefined;
  }
}

geometric.getOwnExtent = function () {
  return this.getExtent(true);
}


/*  THIS is the object whose extent is being modified, which might be a prototype when modifying from the resizer.
 * If it is, then each instance should be updated.  */
geometric.setExtent = function (extent,whichExtent) {
  if (this.__assembly) {
    let sc = (extent.x)/(this.width) ;
    this.setScale(sc);
    return;
  }
  if (this.__setExtent) {
    this.__setExtent(extent);
    return;
  }
  if (this.dimension) {
    if (whichExtent === 'width') {
      this.dimension = this.width = this.height = extent.x;
    } else if (whichExtent === 'height') {
      this.dimension = this.width = this.height = extent.y;
    } else {
      this.dimension = this.width = this.height = Math.max(extent.x,extent.y);
    }
  } else {
    if (whichExtent === 'width') {
      this.width = extent.x;
      if (this.scalable) {
        this.height = extent.y;
      }
    }  else if (whichExtent === 'height') {
      this.height = extent.y;
    } else {
      this.width = extent.x;
      this.height = extent.y
    }
  }
  let weo = {whichExtent};
  if (core.isPrototype(this)) {
    let beenUpdated = [];
    this.__forVisibleInheritors(function (inh) {
      let diagram = core.containingKit(inh);
      if (diagram) {
        if (beenUpdated.indexOf(diagram) === -1) {
          diagram.__update(weo);
          diagram.draw();
          beenUpdated.push(diagram);
        }
      } else {
        inh.__update(weo);
        inh.draw();
      }
    });
  } else {
    this.__update(weo);
    this.draw();    
  }
}

geometric.setWidth = function (width) {
  this.setExtent(Point.mk(width,geometric.height),'width');
}

geometric.scalingRelAncestor = function (ancestor,sofar) {
  let s = (sofar===undefined)?1:sofar;
  let pr = this.__get('__parent');
  let xf;
  if ((!pr) || (pr === ancestor)) {
    return s;
  }
  xf =this.__get("transform");
  if (xf) {
    s = xf.scale * s;
  }
 
 return pr.scalingRelAncestor(ancestor,s);
}

geometric.scalingDownHere = geometric.scalingRelAncestor;

defineOnArray('scalingRelAncestor');

// ancestor = undefined is equivalent to ancestor = core.root
geometric.toAncestorCoords = function (ip,ancestor) {
  let p = ip?ip:Point.mk(0,0);
  let pr = this.__get('__parent');
  let xf;
  if ((!pr) || (this === ancestor)) {
    return p;
  }
  xf =this.__get("transform");
  if (xf) {
    p = p.applyTransform(xf);
  }
  return pr.toAncestorCoords(p,ancestor);
}

defineOnArray('toAncestorCoords');

geometric.toGlobalCoords = geometric.toAncestorCoords;

// ip is in global coords. Return ip's coords in the coords associated with nd's parent
// (If we wish to move nd to p, we want p expressed in nd's parent's coords)
geometric.toLocalCoords = function (ip,toOwn) {
 let p = ip?ip:Point.mk(0,0);
 let pr = this.__get('__parent');
 let prIsRoot = (!pr);
 if (prIsRoot) {
   return toOwn?toCoords(this,p):p;
 }
 let gpr = pr.__get('__parent');
 prIsRoot = !(isGeometric(gpr) || core.ArrayNode.isPrototypeOf(gpr));
 if (prIsRoot) {
   return toOwn?toCoords(this,p):p;
 }
 p = pr.toLocalCoords(p); // p in the coords of the grandparent
 p = toCoords(pr,p);
 return toOwn?toCoords(this,p):p;
}
defineOnArray('toLocalCoords');


  
}
export {defineGeometric};
