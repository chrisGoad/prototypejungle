// documented in https://prototypejungle.net/doc/dropCircles.html

const rs = function (rs) {

let defaults = {dropTries:5,maxLoops:Infinity};

Object.assign(rs,defaults);
      
rs.collides0 = function (point1,radius1,point2,radius2) {
  let p1x = point1.x;
  let p1y = point1.y;
  let p2x = point2.x;
  let p2y = point2.y;
  let minDist =  radius1 + radius2 ;
  //console.log('minDist',minDist,'xd',p2x-p1x,'yd',p2y-p1y,'d',d);
  if (Math.abs(p2x - p1x) >=  minDist) {return false;}
  if (Math.abs(p2y - p1y) >= minDist) {return false;}
  let d= point1.distance(point2);
  return minDist >= d;
}

rs.collides = function (point,radius,points,radii) {
  let n = points.length;
  for (let i=0;i<n;i++) {
    if (this.collides0(point,radius,points[i],radii[i])) {
      return true;
    }
  }
  return false
}

rs.genRandomPoint = function (rect) {
  if (rect) {
    let {corner,extent} = rect;
    let lx = corner.x;
    let ly = corner.y;
    let x = Math.random() * extent.x + lx;
    let y = Math.random() * extent.y + ly;
    return Point.mk(x,y);
  }
  let {width,height} = this;
  let rx = (Math.random()-0.5) * width;
   let ry= (Math.random()-0.5) * height;
  return Point.mk(rx,ry);
}

rs.via3d = function (p) {
  if (this.genPoint3d) {
    let p3d = this.genPoint3d(p);
    let rs = this.camera.project(p3d);
    return rs;
  }
  return p;
}
  
rs.generateCircleDrop = function (iparams) {
  let props = ['radius','maxLoops','maxDrops','dropTries','maxDrops'];
  let params = {};
  core.transferProperties(params,this,props);
  core.transferProperties(params,iparams,props);
  let {radius,maxLoops=Infinity,maxDrops=Infinity,dropTries} = params;
  let cnt =0;
  let tries = 0;
  let points = [];
  let radii = [];
  let numDrops = 0;
  let fill;
  while ((cnt < maxLoops) && (numDrops < maxDrops)) {
    cnt++;
    let pnt = this.genRandomPoint();
    if (this.radiusGenerator) {
      radius = this.radiusGenerator(pnt);
    }
    if (radius <= 0) {
      continue;
    }
    let cl = this.collides(pnt,radius,points,radii);
    //console.log('tries',tries,'collide',cl);
    if (cl) {
      tries++;
      if (tries >= dropTries) {
        //console.log('dropTries',dropTries,'exceeded');
        return {radii,points};
      }
    } else {
      points.push(pnt);
      radii.push(radius);
      tries = 0;
      numDrops++;
    }
  }
  return {radii,points,fills};
}
}


export {rs};      
    
    
      
