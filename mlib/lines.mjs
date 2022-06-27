// this is documented in https://prototypejungle.net/doc/lines.html

const rs = function (item) {

let defaults = {angleMax:90,angleMin:-90};

Object.assign(rs,defaults);

item.segmentToLineFunction = function (seg,lineP) {
  let line = seg.toShape(lineP);
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
  rect.topSide = geom.LineSegment.mk(UL,UR);
  rect.rightSide = geom.LineSegment.mk(UR,LR);
  rect.bottomSide = geom.LineSegment.mk(LR,LL);
  rect.leftSide = geom.LineSegment.mk(LL,UL);
}

item.inRange= function (pnt) {
  if (!pnt) {
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
//  snips inLseg by side effect. directions "fromAbove", "fromBelow", "fromLeft", "fromRight" 
// end0.x < end1.x, it is assumed.

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
 
item.addShortenedLine = function (p0,p1,inside) {
  let {shortenBy,lines} = this;
  let sp0,sp1;
  if (!p1) {
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
  let shape = proto.instantiate();
  let setDimension = setDimensions[which];
  shapes.push(shape);
  shape.moveto(pnt);
  setDimension(this,shape, 2 * radii[i]);  
  shape.update();
  shape.show();
  }
}
  
item.randomPointInCircle = function (circle) {  
  let r = circle.radius;
  let center = circle.center; 
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

let nextSides = {topSide:"rightSide", rightSide:"bottomSide", bottomSide:"leftSide", leftSide:"topSide"};
  let prevSides = {topSide:"leftSide", rightSide:"topSide", bottomSide:"rightSide", leftSide:"bottomSide"};

item.generateLines = function (iparams) {
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
      let line = this.segmentToLineFunction(seg,lineP);
      lines.push(line);
    }
  }
}
};

export {rs};

    
