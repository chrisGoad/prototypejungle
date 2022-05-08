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

