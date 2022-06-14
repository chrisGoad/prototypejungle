// documented in https://prototypejungle.net/doc/dropCircles.html

const rs = function (rs) {

let defaults = {dropTries:5,maxLoops:Infinity};

Object.assign(rs,defaults);
      

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
  
rs.generateDrops = function (params) {
  debugger;
  let {shapes,drops} = this;
  if (!shapes) { 
    shapes = this.set('shapes',arrayShape.mk());
  }
  if (!drops) {
    drops = this.drops = [];
  }
  if (this.initialDrop) {
    let idrop = this.initialDrop();
    let {geometries:igeoms,shapes:ishapes} =  idrop;
    drops = this.drops = igeoms;
    ishapes.forEach(s => shapes.push(s));
  }
  //core.transferProperties(params,this,props);
  //core.transferProperties(params,iparams,props);
  this.dropParams = params;
  let {maxLoops=Infinity,maxDrops=Infinity,dropTries} = params;
  let cnt =0;
  let tries = 0;
  debugger;
  while ((cnt < maxLoops) && (drops.length < maxDrops)) {
    cnt++;
    let pnt = this.genRandomPoint();
    let drop = this.generateDrop(pnt);
    if (!drop) {
      continue;
    } 
    let gs = drop.geometries;
    let tgs = gs.map((g) => geom.moveBy(g,pnt));
    if (geometriesIntersect(tgs,drops)) {
      tries++;
      if (tries >= dropTries) {
        //console.log('dropTries',dropTries,'exceeded');
        return drops;
      }
    } else {
      let moveNeeded = 1;
      let newShapes = drop.shapes; 
      newShapes.forEach((s) => {
        let sp = s.getTranslation();
        s.moveto(pnt.plus(sp));
        shapes.push(s);
      });
      tgs.forEach((g) => drops.push(g));
      tries = 0;
    }
  }
}
      
}


export {rs};      
    
    
      
