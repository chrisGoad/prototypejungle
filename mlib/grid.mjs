 // documented in https://prototypejungle.net/doc/grid.html
 
const rs = function (item) {
let defaultTopParams = {numRows:10,numCols:10,width:100,height:100,pointJiggle:0,includeLetters:0,letterWidth:4,letterHeight:4,fractionInked:0.4};
Object.assign(item,defaultTopParams);

let points = [];

item.defaultPositionMethod = function (i,j) {
  let {deltaX,deltaY,numRows,numCols,width,height,points3d,camera} = this;
  let botx = -0.5 * width;
  let boty = -0.5 * height;
  return Point.mk(botx + deltaX*i,boty + deltaY*j);
  
}


// in this case there are sides sideA, and sideB, and an  each given by a function from the [0,1] to the plane. 
// then there is an interolation function I(e0,e1,x) where x is in [0,1]. It for 0 it returns e0, and 1 it returns e1.

// to generated the grid take points A0... An, B0,.... Bn on the sides and join them with the interpolation function
item.linearInterpolator = function (a,b,fr) {
  let vec = b.difference(a).times(fr);
  let rs = a.plus(vec);
  return rs;
}
  
item.sidesPositionMethod = function (i,j) {
  let {numRows,numCols,sideA:sideAi,sideB:sideBi,Interpolator} = this;
  let sideA = (typeof sideAi === 'function')?sideAi:function(fr) {return sideAi.pointAlong(fr);}
  let sideB = (typeof sideBi === 'function')?sideBi:function(fr) {return sideBi.pointAlong(fr);}
  let I = Interpolator?Interpolator:this.linearInterpolator;
  let a = sideA.call(this,(i/(numCols - 1)));
  let b = sideB.call(this,(i/(numCols - 1)));
  let rs = I(a,b,j/(numRows - 1));
  return rs;
}

item.radialPositionMethod = function (i,j) {
  let {numRows,numCols,angleMin=-180,angleMax=180, innerRadius,outerRadius,center,rotation=0} = this;
  let rotPerRow = (rotation * Math.PI)/(numCols*180);
  let rot = rotPerRow * j;
  let aMinR = (angleMin * Math.PI)/180;
  let aMaxR = (angleMax * Math.PI)/180;
  // i = how far around, j how far out 
  let aDiff = aMaxR - aMinR;
  let aR = aMinR +  aDiff * (i/(numRows-0)) +rot;
  let rDiff = outerRadius - innerRadius;
  let midR = innerRadius + rDiff * (j/(numCols -1));
  let bias  = 1*(1 + (j - 0.5*numCols)/numCols);
  let biasSq = bias*bias*bias;
  let maxBiasSq = 1.5*1.5*1.5;
  let r = innerRadius + (biasSq/maxBiasSq)*rDiff * (j/(numCols -1));
  r = innerRadius + rDiff * (j/(numCols -1));
  let vec = Point.mk(Math.cos(aR), Math.sin(aR));
  let rs = center.plus(vec.times(r));
  return rs;
  }
  

item.genPointsFunction0 = function () {
  let {numRows,numCols,positionMethod,points,rpoints} = this;
  let lx = Infinity;
  let ly = Infinity;
  let hx = -Infinity;
  let hy = -Infinity;
  for (let i = 0;i <= numCols; i++) {
    for (let j = 0;j <= numRows; j++) {
      let p = this.positionMethod?this.positionMethod(i,j):this.defaultPositionMethod(i,j);
      let {x,y} = p;
      if (x<lx) {
        lx = x;
      }
      if (y<ly) {
        ly = y;
      }  
      if (x>hx) {
        hx = x;
      }  
      if (y>hy) {
        hy = y;
      }
      points.push(p);
      rpoints.push(Point.mk(0,0));
    }
  }
  this.thePoints = points;
  if (this.isPointJiggle) {
    this.jigglePoints();
    this.thePoints = rpoints;
  }
  if (this.genPoint3d) {
    this.thePoints = this.thePoints.map((p) => this.camera.project(this.genPoint3d(p)));
  }
  this.lowX = lx;
  this.lowY = ly;
  this.highX = hx;
  this.highY = hy;
}

item.genPoints3d = function () {
  let {numRows,numCols,deltaX,deltaY} = this;
  let points3d = this.set("points3d",[]);
  for (let i = 0;i<=numCols;i++) {
    for (let j=0;j<=numRows;j++) {
      let p = Point.mk(deltaX*(i-numCols/2),deltaY*(j-numRows/2));
      let p3d = this.genPoint3d(p);
      points3d.push(p3d);
    }
  }
}


item.genPoints = function () {
  if (this.points) {
    return;
  }  
  this.set('points',core.ArrayNode.mk()); 
  this.set('rpoints',core.ArrayNode.mk()); 
  this.set('occupied',core.ArrayNode.mk()); 
  this.set('regions',core.ArrayNode.mk()); // assigns to each point its region

  let {numRows,numCols,deltaX,deltaY,genPointsFunction} = this;
  if (this.genPointsFunction)  {
    this.genPointsFunction();
  } else {
    this.genPointsFunction0();
  }
  //console.log('lowX highX lowY highY',this.lowX,this.highX,this.lowY,this.highY);
}

// i = column (corresponds to x)  j = row (corresponds to y) //column major // point coords

//points have coords (0 <= x <= numCols,0 <= y <= numRows),  index =  x*(numRows+1) + y;
//cells have coords (0 <= x < numCols,0 <= y < numCols),  index =  x*numRows + y;

item.pcoordToIndex  = function (p) {
  return (this.numRows+1)*p.x + p.y;
}

item.cellToIndex  = function (cell) {
  let {x,y} = cell;
  return (this.numRows)*x + y;
}


item.pcoordsToIndex  = function (x,y) {
  return (this.numRows+1)*x + y;
}

item.cellCoordsToIndex  = function (x,y) {
  return (this.numRows+1)*x + y;
}
item.indexToPcoord = function (idx) {
  let nr = this.numRows + 1;
  let x = Math.floor(idx/nr);
  let y = idx % nr;
  return Point.mk(x,y);
}


item.pointAt = function (points,i,j) {
  let {numRows,numCols} = this;
  if ((j<=numRows) && (i<=numCols)) {
    let idx = i*(numRows+1) + j;
    return points[idx];
  }
}

item.shapeAt = function (i,j) {
  let {numRows,numCols,shapes} = this;
  if ((j<=numRows) && (i<=numCols)) {
    let idx = i*numRows + j;
    return shapes[idx];
  }
}

item.coordToPoint = function (p) {
  let idx = pcoordIndex(p);
  return this.points[idx];
}


// i, j are cell coords
item.centerPnt = function (i,j) {
  let {isPointJiggle,thePoints:points} = this; // cg 3/26/22
  let pnt00 =  this.pointAt(points,i,j);
  let pnt11 = this.pointAt(points,i+1,j+1);
  if (pnt00 && pnt11) {
    let x = (pnt00.x + pnt11.x)/2;
    let y = (pnt00.y + pnt11.y)/2;
    return Point.mk(x,y);
  }
}

item.addCellBoundaries = function (frame,fraction) {
  let hcontainer = this.hcontainer;
  let points = this.thePoints; 
  let lines = this.lines;
  this.updating = !!lines;
  if (!lines) {
    lines = this.set('lines',core.ArrayNode.mk()); 
  }
  let {numRows,numCols,deltaX,deltaY,boundaryLineGenerator,randomGridsForBoundaries,
    isPointJiggle} = this;
  let xdim = numCols * deltaX;
  let ydim = numRows * deltaY;
  let ly = -0.5 * ydim;
  this.lineIndex = 0
  for (let i = 0;i <= numCols; i++) {
    for (let j = 0;j <=  numRows; j++) {
       let rvs = (this.randomValuesAtCell)?this.randomValuesAtCell(randomGridsForBoundaries,i,j):{};
      let points = this.thePoints; 
      let cell = {x:i,y:j};
      let p11 = this.pointAt(points,i,j);
      let p12 =  this.pointAt(points,i,j+1);
      let p21 =  this.pointAt(points,i+1,j);
      let p22 =  this.pointAt(points,i+1,j+1);
      let rs;
      if (p12) {
        rs = this.boundaryLineGenerator(p11,p12,rvs,cell,'vertical');
        if (rs) {
          lines.push(rs); 
          rs.update();
          if (this.boundaryLineUpdater) {
            this.boundaryLineUpdater(rs,p11,p12,rvs,cell,'vertical');
          }
          this.lineIndex++;
        } 
      }     
      if (p21) {
         rs = this.boundaryLineGenerator(p11,p21,rvs,cell,'horizontal');
       if (rs) {
         lines.push(rs); 
         rs.update(); 
         if (this.boundaryLineUpdater) {
            this.boundaryLineUpdater(rs,p11,p21,rvs,cell,'horizontal');
         }
          this.lineIndex++;
        } 
      }
    
    }
  }
}

item.hideThisCell = function (cell) {
  let {thePoints:pnts} = this; 
  let {x,y} = cell;
  let rs = (this.pointAt(pnts,x,y).hideMe)||(this.pointAt(pnts,x,y+1).hideMe)||(this.pointAt(pnts,x+1,y).hideMe)||(this.pointAt(pnts,x+1,y+1).hideMe);
  return rs;
}
  
  
item.cellCorners = function (cell) {
  let {rpoints,thePoints:pnts,isPointJiggle} = this;
  let {x,y} = cell;
  let p11 = this.pointAt(pnts,x,y);
  let p12 =  this.pointAt(pnts,x,y+1);
  let p21 =  this.pointAt(pnts,x+1,y);
  let p22 =  this.pointAt(pnts,x+1,y+1);
  let corners = [p11,p21,p22,p12];
  return corners;
}

item.displaceArray = function (a,disp) {
  let rs = a.map((p)=>p.plus(disp));
  return rs;
}


item.scaleArray = function (a,scaleX,scaleY) {
  let rs = a.map((p)=>{
    let nx = (p.x) * scaleX;
    let ny = (p.y) * scaleY;
    return Point.mk(nx,ny);
  });
  return rs;
}

item.updateCellBoundaries = function (frame,fraction) { 
  let points = this.rpoints;
  let {numRows,numCols,deltaX,deltaY,lines,boundaryLineGenerator,randomGridsForBoundaries} = this;
  let xdim = numCols * deltaX;
  let ydim = numRows * deltaY;
  let ly = -0.5 * ydim;
  let idx = 0;
  for (let i = 0;i <= numCols; i++) {
    for (let j = 0;j <=  numRows; j++) {
      let boundaryLine; 
      let rvs = (this.randomValuesAtCell)?this.randomValuesAtCell(randomGridsForBoundaries,i,j):{};
      let points = this.thePoints;
      let cell = {x:i,y:j};
      let p11 = this.pointAt(points,i,j);
      let p12 =  this.pointAt(points,i,j+1);
     let p21 =  this.pointAt(points,i+1,j);
      let p22 =  this.pointAt(points,i+1,j+1);
      let rs;
      if (p12) {
        boundaryLine = lines[idx++];
        this.boundaryLineUpdater(boundaryLine,p11,p12,rvs,cell,'vertical');
      }     
      if (p21) {
        boundaryLine = lines[idx++];
         this.boundaryLineUpdater(boundaryLine,p11,p21,rvs,cell,'horizontal');
      }
    
    }
  }
}


item.pcoordToIndex  = function (p) {
  return (this.numRows+1)*p.x + p.y;
}

item.cellToIndex  = function (c) {
  return (this.numRows)*c.x + c.y;
}

item.genRandomPoint = function (rect) {
    let {corner,extent} = rect;
    let {numRows,numCols} = this;
    let {x:cx,y:cy} = corner;
    let {x:xx,y:xy} = extent;
    let rx = Math.random();
    let ry = Math.random();
    let x  = cx +   rx*xx;
    let y  = cy +   ry*xy;
    let cellX = Math.floor(rx*numCols);
    let cellY = Math.floor(ry*numRows);
    return [Point.mk(cellX,cellY),Point.mk(x,y)];
}

item.genRect = function () {
  let {width,height} = this;
  let corner = Point.mk(-0.5*width,-0.5*height);
  let extent = Point.mk(width,height);
  let rect = geom.Rectangle.mk(corner,extent);
  return rect;
}

item.inRandomOrder = function (n) {
  let rs = []; 
  let inRs = [];
  for (let i=0;i<n;i++) {
    inRs[i] = 0;
  }
   const kthFree = function (k) {
    let found = 0;
    let cIndex = 0;
    while (found <= k) {
      if (inRs[cIndex]) {
         cIndex++;
      } else {
        found++;
        cIndex++;
      }
    }
    return cIndex-1;
  }
  let numFree = n;
  let cnt = 0;
  while (numFree > 0) {
    let rn =Math.floor(Math.random() * numFree);
    if (rn === numFree) {
       rn--;
    }
    let next = kthFree(rn);
    rs.push(next);
    inRs[next] = 1;
    numFree--;
  }
  return rs;
}

item.computeCellsByOrdinal = function () {
  let {numRows,numCols} = this;
  let cellsByOrdinal = {};
  let maxOrdinal = -1;
  for (let i = 0;i < numCols; i++) {
    for (let j = 0;j <  numRows; j++) {
      let cell = {x:i,y:j};
      let ord = this.ordinalGenerator(cell);
      if (ord > maxOrdinal) {
        maxOrdinal = ord;
      }
      let cells = cellsByOrdinal[ord]
      if (cells) {
        cells.push(cell);
      } else {
        cellsByOrdinal[ord] = [cell];
      }
    }
  }    
  this.cellsByOrdinal = cellsByOrdinal;
  this.maxOrdinal = maxOrdinal;
}


item.computeOrdinalOrder = function (backwards) {
  let rs = [];
  this.computeCellsByOrdinal();
  let {maxOrdinal,cellsByOrdinal,numRows} = this;
  const addCell = function (o) {
    let cells = cellsByOrdinal[o];
    if (cells) {
      cells.forEach( (cell) => {
        let {x,y} = cell;
        let idx = x*numRows + y;
        rs.push(idx);
      });
    }
  }
  if (backwards) {
    for (let o = maxOrdinal;o>=0;o--) {
      addCell(o);
    } 
  } else {
    for (let o = 0;o<=maxOrdinal;o++) {
      addCell(o);
    }
  }
  return rs;
}
item.invertMap = function (a) {
  let ln = a.length;
  let rs = [];
  rs.length = ln;
  for (let i=0;i<ln;i++) {
    let vl = a[i];
    rs[vl] = i;
  }
  return rs;
}

item.inSequence = function (n) {
  let rs = [];
  for (let i=0;i<n;i++) {
    rs.push(i);
  }
  return rs;
}

item.rotateArray = function (ar) {
  let ln = ar.length;
  let first = ar[0];
  for (let i = 0;i<ln-1;i++) {
    ar[i] = ar[i+1];
  }
  ar[ln-1] = first;
}

const perturbArray = function (ar) {
  let ln = ar.length;
  let i0 = Math.floor(Math.random()*ln);
  let i1 = Math.floor(Math.random()*ln);
  let v0 = ar[i0];
  let v1 = ar[i1];
  ar[i0] = v1;
  ar[i1] = v0;
}

item.perturbArray = function (ar,n) {
  for (let i=0;i<n;i++) {
    perturbArray(ar);
  }
}
  
  
   

item.addShapes = function () { 
  let {numRows,numCols,numDrops,width,height,shapeP,shapeGenerator,
       randomizeOrder,orderByOrdinal,spatterGenerator,randomGridsForShapes,shapes:ishapes} = this;
  if (this.timeStep === undefined) {
     this.timeStep = 0;
  }
  this.updating = !!ishapes
  let shapes;
  if (ishapes) {
    shapes = ishapes;
  } else {
    shapes = this.set('shapes',core.ArrayNode.mk());
  }
  this.shapeIndex = 0;
  let sln = numRows * numCols;
  let shapeDs = this.set('shapeDescriptors',core.ArrayNode.mk());
  shapeDs.length = sln;  
  const addAshape =  (idx) => {
    if (!(typeof idx === 'number')) {
      debugger; //keep
    }
    let nr = this.numRows;
    let x = Math.floor(idx/nr);
    let y = idx % nr;
    let cnt = this.centerPnt(x,y);
    let cell = {x,y,index:idx};
    let rvs = (this.randomValuesAtCell)?this.randomValuesAtCell(randomGridsForShapes,x,y):{};
    let  shp;
    if (this.shapeGenerator) {
      shp = this.shapeGenerator(rvs,cell,cnt,idx);
      if (shp) {
        shapes.push(shp);
        if (shp.update) {
          shp.update();
        }
      }
      if (shp && this.shapeUpdater) {
        this.shapeUpdater(shp, rvs,cell,cnt);
      }
    } else {
      shp = this.shapeP.instantiate();
      shapes.push(shp);
      shp.update();
      shp.show();
    }
    if (shp) {
      if (!this.generatorsDoMoves) {
        shp.moveto(cnt);
      }
      this.shapeIndex++;
    }  
  }
  if (randomizeOrder) {
    let numShapes = numRows * numCols;
    let order;
    if (this.theShapeOrder) {
      order = this.theShapeOrder;
    } else {    
      this.theShapeOrder = order = randomizeOrder?this.inRandomOrder(numShapes):this.computeOrdinalOrder(1);
      this.inverseShapeOrder = this.invertMap(order); 
    }
    for (let idx = 0; idx < numShapes;idx++) {
      addAshape(order[idx]);
    }
    return;
  }
  if (orderByOrdinal) {
    this.computeCellsByOrdinal();
    let {maxOrdinal,cellsByOrdinal} = this;
    for (let o = 0;o<=maxOrdinal;o++) {
      let cells = cellsByOrdinal[o];
      if (cells) {
        cells.forEach( (cell) => {
          let {x,y} = cell;
          let idx = x*numRows + y;
          addAshape(idx);
        });
      }
    }
    return;
  }    
  for (let i = 0;i < numCols; i++) {
    for (let j = 0;j <  numRows; j++) {
      let idx = i*numRows + j;
      addAshape(idx);
    }
  }
}



item.updateShapes = function () { 
  let {numRows,numCols,numDrops,width,height,shapeP,shapeGenerator,spatterGenerator,randomGridsForShapes,shapes,inverseShapeOrder,randomizeOrder} = this;
  const updateAshape =  (shape,idx) => {
    let nr = this.numRows;
    let x = Math.floor(idx/nr);
    let y = idx % nr;
    let cnt = this.centerPnt(x,y);
    let cell = {x,y,index:idx};
    let rvs = (this.randomValuesAtCell)?this.randomValuesAtCell(randomGridsForShapes,x,y):{};
    this.shapeUpdater(shape, rvs,cell,cnt,idx);
  }
  let sln = numRows * numCols;
  for (let i = 0;i < numCols; i++) {
    for (let j = 0;j <  numRows; j++) {
      let cnt = this.centerPnt(i,j);
      let idx = i*numRows + j;
      let shape = randomizeOrder?shapes[inverseShapeOrder[idx]]:shapes[idx];
      let rvs = (this.randomValuesAtCell)?this.randomValuesAtCell(randomGridsForShapes,i,j):{};
      let cell = {x:i,y:j,index:idx};
      let  shp;
      if (this.shapeUpdater && shape) {
        this.shapeUpdater(shape, rvs,cell,cnt,idx);
      }
      if (shp) {
        if (!this.updatersDoMoves) {
          shp.moveto(cnt);
        }
      }  
    }
  }
}


item.updateAtRandomPoint = function (shape) {
  let cell = shape.cell;
  let {x,y} = cell;
  let rvs = (this.randomValuesAtCell)?this.randomValuesAtCell(this.randomGridsForShapes,x,y):{};
  this.shapeUpdater(shape,rvs,cell);
}

item.updateSpatter = function () { 
  let {shapes} = this;
  if (this.shapeUpdater) {
    shapes.forEach((shape) => {this.updateAtRandomPoint(shape)});
  }
}


item.color2rgb = function (c) {
  return `rgb(${Math.floor(c[0])},${Math.floor(c[1])},${Math.floor(c[2])}`;
}
  

item.jigglePoints = function () {
  let {numRows,numCols,randomizer,isPointJiggle,randomGridsForBoundaries} = this;
  if (!isPointJiggle) {
    return;
  }
  let {jiggleX,jiggleY} = randomGridsForBoundaries;
  for (let i = 0;i<(numCols+1);i++) {
     for (let j = 0;j < (numRows+1);j++) {
        let pnt = this.pointAt(this.points,i,j);
        let jogX = this.valueAt(jiggleX,i,j);
        let jogY = this.valueAt(jiggleY,i,j);
        let rpnt = this.pointAt(this.rpoints,i,j); 
        rpnt.x = pnt.x + jogX;
        rpnt.y = pnt.y + jogY;
     }
  }
}
 
item.computeJiggleParams = function (jiggle) {
  let hj = 0.5*jiggle;
  let jiggleStep = 0.3 * hj;
  return {stept:jiggleStep,step:jiggleStep,min:-hj,max:hj};
}

item.setupPointJiggle = function () {     
  let {numRows,numCols,pointJiggle,jiggleParams} = this;
  if (pointJiggle || jiggleParams) {
    let jParams = jiggleParams?jiggleParams:this.computeJiggleParams(pointJiggle);
    this.setupRandomGridForBoundaries('jiggleX',jParams);
    this.setupRandomGridForBoundaries('jiggleY',jParams);
  }
}

item.backgroundPadding = 0;
item.generateGrid = function () {
  let {numRows,numCols,pointJiggle,jiggleParams,spatter,outerRadius} = this;
 this.isPointJiggle = pointJiggle || jiggleParams;
  this.setupPointJiggle();
  this.deltaX = this.width/numCols;
  this.deltaY = this.height/numRows;
  core.tlog('initialize');
  this.genPoints();
  core.tlog('genPoints');
  if (this.regionLineGenerator) {
    this.set('rlines',core.ArrayNode.mk());
    while (this.addRegions()) {
    }
  }
  if (this.includeLetters) {
    this.set('rlines',core.ArrayNode.mk());
    let windows = this.genAwindows(this.letterWidth-1,this.letterHeight-1);
    let numletters = 0;
    let nw = windows.length;
    for (let i=0;i<nw;i++) {
      let numStrokes = this.fractionInked * this.letterWidth * this.letterHeight;
      if ((Math.random() < 0.4) && (numletters>this.lettersPerWord)){
        numletters= 0;
      } else {
        if (i < nw) {
          let w = windows[i];
          let r = this.genAregion(w,numStrokes);
          this.drawAregion(r);
          numletters++;
        }
      }
    };
  }
  core.tlog('genHorizontalLines');
  if (this.shapeGenerator || this.shapeP  ) {
    this.addShapes();
  }
  if (this.boundaryLineGenerator) {
    this.addCellBoundaries();
  }
  draw.fitTheContents();
  if (this.lastGridStep) {
    this.lastGridStep(); // eg for filling in symmetries
  }
    core.tlog('randomizeLines');
  this.show();
  //console.log('lowX',this.lowX,'lowY',this.lowY,'highX',this.highX,'highY',this.highY);
}

item.regenerateShapes = function () {
  this.shapes.remove();
  this.addShapes();
}
item.interpolate = function (cDomain,domainL,domainH,rangeL,rangeH) {
  let fr = (cDomain-domainL)/(domainH-domainL);
  return rangeL + fr*(rangeH-rangeL);
}

item.updateGrid = function () {
  let {numRows,numCols,pointJiggle} = this;
  if (this.boundaryLineUpdater) {
    this.updateCellBoundaries();
  }
  if (this.shapeUpdater) {
    this.updateShapes();
  }
  this.show();
}   

item.setLineEnds = function (line,ilength,dir) {
  let deltaX = this.deltaX;
  let length = ilength * deltaX;
  let end1 = Point.mk(Math.cos(dir),Math.sin(dir)).times(length/2);
  let end0 = end1.minus();
  line.setEnds(end0,end1);
  line.update();
  line.show();
}

item.constructSides = function (rect) {
  let {corner,extent} = rect;
  let {x:cx,y:cy} = corner;
  let {x:xx,y:xy} = extent;
  let UL = Point.mk(cx,cy);
  let UR = Point.mk(cx+xx,cy);
  let LL = Point.mk(cx,cy+xy);
  let LR  = Point.mk(cx+xx,cy+xy);
  let rs = {};
  rs.top = geom.LineSegment.mk(UL,UR);
  rs.bottom = geom.LineSegment.mk(LL,LR);
  rs.left = geom.LineSegment.mk(UL,LL);
  rs.right = geom.LineSegment.mk(UR,LR);
  return rs;
}


item.intersectWithSides = function (lseg,rect,sides) {
  let {end0,end1} = lseg;
  let contains0 = rect.contains(end0);
  let contains1 = rect.contains(end1);
  let intersections = [];
  const pushIfNnul = function (x) {
    if (x) {
      intersections.push(x);
    }
  }
  pushIfNnul(sides.top.intersect(lseg));
  pushIfNnul(sides.bottom.intersect(lseg));
  pushIfNnul(sides.left.intersect(lseg));
  pushIfNnul(sides.right.intersect(lseg));
  if (intersections.length === 0) {
    if (contains0 && contains1) {
      return lseg;
    }  else {
      debugger; //keep
      return;
    }
  } else if (intersections.length === 1) {
    if (contains0) {
      return geom.LineSegment.mk(end0,intersections[0]);
    } else if (contains1) {
        return geom.LineSegment.mk(end1,intersections[0]);
    } else {
      return;
    }
  } else if (intersections.length === 2) {
    return geom.LineSegment.mk(intersections[0],intersections[1])
  } else {
    debugger; //keep should not happenp
    return;
  }
}

// for innergrids, as in generators/grid_grid_1.mjs

item.instantiateDescriptionInto = function (rs,eltDescription) {
  let {shapePs,positions} = eltDescription;
   let ln = shapePs.length;
   for (let i=0;i<ln;i++) {
     let shapeP = shapePs[i];
     if (shapeP) {
       let ps = positions[i];
       let shape = shapeP.instantiate();
       rs.set('r'+i,shape);
       shape.show();
       shape.update();
       shape.moveto(ps);
     }
   };
 }

item.genInnerGridPositions = function () {
  let {innerRows,innerCols,width,height,numRows,numCols} = this;
  let deltaX = width/numCols;
  let deltaY = height/numRows;
  let innerDimX = deltaX/innerCols;
  let innerDimY = deltaX/innerRows;
  let positions = [];
  for (let i=0;i<innerRows;i++) {
   let posx=innerDimX*(i+0.5) -0.5*deltaX;
   for (let j=0;j<innerCols;j++) {
     let posy=innerDimY*(j+0.5)-0.5*deltaY;
     positions.push(Point.mk(posx,posy));
    }
  }
  return positions;
}

item.randomCell = function (excl) {
  let {numRows,numCols} = this;
  if (this.randomColumn === undefined) {
  let col = excl + Math.floor(Math.random() * (numCols-2*excl));
  let row= excl + Math.floor(Math.random() * (numRows-2*excl));
  return {x:col,y:row};
  }
}
}
export {rs};

      

