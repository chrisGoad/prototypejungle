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
 
rs.dropCenters = function () {
  let drops= this.drops;
  let rs = drops.map((d) => d.center);
  return rs;
 }
  
rs.generateDrops = function (params) {
  let {shapes,drops,numRows,randomGridsForShapes,positions,saveState} = this;
  if (!shapes) { 
    shapes = this.set('shapes',arrayShape.mk());
  }
  if (!drops) {
    drops = this.drops = [];
  }
  let initialDropsLn = drops.length;
  if (this.initialDrop) {
    let idrop = this.initialDrop();
    if (idrop) {
      let {geometries:igeoms,shapes:ishapes} =  idrop;
      drops = this.drops = igeoms;
      ishapes.forEach((s) => shapes.push(s));
    }
  }
  this.dropParams = params;
  let {maxLoops=Infinity,maxDrops=Infinity,dropTries} = params;
  let cnt =0;
  let tries = 0;
  let rvs;
  let tgs;
  const dropAt = (pnt) => {
    if (numRows && randomGridsForShapes) {
      let cell = this.cellOf(pnt);
      rvs = this.randomValuesAtCell(randomGridsForShapes,cell.x,cell.y);
    }
    let drop = this.generateDrop(pnt,rvs);
    if (!drop) {
      return;
    } 
    let gs = drop.geometries;
    tgs = gs.map((g) => geom.moveBy(g,pnt));
    return drop;
  }
  const installDrop = (drop,pnt) => {
    debugger;
    let moveNeeded = 1;
    if (positions) {
      positions.push(pnt);
    }
    let newShapes = drop.shapes; 
    newShapes.forEach((s) => {
      let sp = s.getTranslation();
      s.moveto(pnt.plus(sp));
      shapes.push(s);
    });
    tgs.forEach((g) => drops.push(g));
    tries = 0;
  }
  if (!saveState && (saveState !== undefined)) {
    // drop points were stored in this.positions
    debugger;
    positions.forEach((ipnt) => {
      let pnt = Point.mk(ipnt.x,ipnt.y);
      let drop = dropAt(pnt);
      if (drop) {
        installDrop(drop,pnt);
      }
     });
     return;
  }
  // the live drop collision  detection is done
  while ((cnt < maxLoops) && ((drops.length-initialDropsLn) < maxDrops)) {
    cnt++;
    let pnt = this.genRandomPoint();
    let drop = dropAt(pnt);
    if (!drop) {
      continue;
    } 
    if (geometriesIntersect(tgs,drops)) {
      tries++;
      if (tries >= dropTries) {
        //console.log('dropTries',dropTries,'exceeded');
        debugger;
        return drops;
      }
    } else {
      installDrop(drop,pnt);
      tries = 0;
    }
  }
  debugger;
}
      
}


export {rs};      
    
    
      
