// documented in https://prototypejungle.net/doc/dropForest.html 

const rs = function (item) {

let defaults = {maxDrops:Infinity,dropTries:5,maxLoops:Infinity};

Object.assign(item,defaults);

item.generateFan = function (p) {
	let {width,height} = this;
  let {sepNext=0,splitChance,splitAmount,  
	     segLength:len,directionChange:dc=0,randomDirectionChange:rdc=0,lineExt=0} = this.forestDropParams;
  debugger;
  let angle;
  //p.x = 0;
  //p.y = 0;
  let p0 = Point.mk(0,0);
	let rn = Math.random();
  if (typeof p.direction === 'number') {
   angle = p.direction +  dc + ((rn<0.5)?rdc:-rdc);
  } else{
    angle = Math.floor(Math.random()*4)*0.25*Math.PI;
  }
  let hsa = 0.5 * splitAmount;
  let a0 = angle+splitAmount;
  let a1 = angle-splitAmount;
  if (Math.random() < splitChance ) {
    let seg0 = this.genForestSegment(p0,len,a0,sepNext);
    let seg1 = this.genForestSegment(p0,len,a1,sepNext);
     p.isEnd = 1;
    return [seg0,seg1];
  } else {
    let seg = this.genForestSegment(p0,len,angle,sepNext);
    p.isEnd = 1;
    return [seg];
  }
}


 // the following methods generate dropStructs, which are used as the seeds of the drop operation. 
item.ringSeeds = function (iparams) {
  let {center=Point.mk(0,0),numSeeds,ringRadius:radius,segLength:len,divergence=0,data} = iparams; 
  let segs = [];
  let cangle = 0.5* Math.PI;
  let delta = (Math.PI*2)/numSeeds;
  for (let j=0;j<numSeeds;j++) {
    let ip = Point.mk(Math.cos(cangle),Math.sin(cangle)).times(radius);
    let p = ip.plus(center);
    let dir = cangle+divergence;
    let seg = this.genOneSegment(p,dir,'white');
    let end = seg.end;
    if (data) {
      end.data = data;
    }
    end.spoke = j;
    end.seed = end;
    segs.push(seg); 
    cangle += delta;
  }
  return segs;
}

item.sideSeeds = function (params) {
  let {width,height} = this;
  let {numSeeds,data,sepNext,segLength:len,whichSide} = params; 
  let segs = [];
  let delta  = height/(numSeeds+1);
  let hw = width/2;
  const mkSeeds =  (side) => {
   let cy = delta-hw;
   let right = side === 'right';
   for (let j=0;j<numSeeds;j++) {
      let ip = Point.mk(right?hw:-hw,cy);
      let seg =  this.genForestSegment(ip,len,right?Math.PI:0,sepNext);
      let end = seg.end;
      if (data) {
        send.data = data;
      }
      end.seed = end;
      segs.push(seg); 
      cy += delta;
    }
  }
  if (whichSide === 'both') {
    mkSeeds('left');
    mkSeeds('right');
  } else {
   mkSeeds(whichSide);
  }
 // let lines = segs.map((sg) => this.genLine(sg,lineP,lineExt)); 
  return segs;
}

item.leftSideSeeds = function (params) {
  params.right = 0;
  return this.sideSeeds(params);
}

item.rightSideSeeds = function (params) {
  params.right = 1;
  return this.sideSeeds(params);
}

item.randomSeeds = function (iparams) { 
  let {sepNext=0,numSeeds,lineP,seedDirections,segLength:len,lineExt=0} = iparams;
  let segs = [];
  let ld;
  if (seedDirections) {
    ld = seedDirections.length;
  }
  for (let j=0;j<numSeeds;j++) {
    let ip = this.genRandomPoint();
    let angle;
    if (ld) {
      let ri = Math.floor(Math.random()*ld);
      angle = seedDirections[ri];
    } else {
      angle = 2*Math.random()*Math.PI;
    }
    let seg =  this.genForestSegment(ip,len,angle,sepNext);
    segs.push(seg); 
  }
  let lines = segs.map((sg) => sg.toShape(lineP,lineExt)); 
  //let lines = segs.map((sg) => this.genLine(sg,lineP,lineExt)); 
  return {geometries:segs,shapes:lines};
}

item.gridSeeds = function (iparams) {
   /* let props = ['width','height','lineP','sepNext','fanAngles','numSeedRows',  
       'numSeedCols','gridPadding','lineExt'];
    let params = {};
    core.transferProperties(params,this,props);
   core.transferProperties(params,iparams,props);*/
  let {width,height,lineP,sepNext=0,fanAngles,numSeedRows:numRows,  
       numSeedCols:numCols,gridPadding:padding=0,lineExt=0} = iparams;
  let segs = [];
  let lines = [];
  let iwidth = width - padding;
  let iheight = height - padding;
  let hwd = iwidth/2;
  let hht = iheight/2;
  let angle0 = 0.5*Math.PI;
  let angle1 = -0.5*Math.PI;
  let len = 5;
  let deltaX = this.deltaX = iwidth/numCols;
  let deltaY = this.deltaY = iheight/numRows;
  let ix = (-hwd) + 0.5*deltaX;
  let yv = (-hht) + 0.5*deltaY;
  for (let j=0;j<numRows;j++) {
    let xv = ix;
    for (let i=0;i<numCols;i++) {
      let ip = Point.mk(xv,yv);
      if (this.genGridSegments) {
        let cell = {x:i,y:j};
        let SL = this.genGridSegments(cell,ip);
        if (SL) {
          segs.push(...SL[0]);
          lines.push(...SL[1]);
        }
      } else {
        fanAngles.forEach( (angle) => {
          let seg = this.genForestSegment(ip,len,angle,sepNext);
          segs.push(seg);
          lines.push(seg.toShape(lineP,lineExt));
        });
      }
      xv += deltaX;

    }   
    yv += deltaY;
  }
  return {geometries:segs,shapes:lines};
}
/*
item.extendSegment = function (seg,ln) {
  let {end0,end1} = seg;
  let cnt= end0.plus(end1).times(0.5);
  let vec = end1.difference(end0);
  let len = vec.length();
  let nlen = ln+len;
  let hnvec = vec.times(nlen/(2*len));
  let e0 = cnt.difference(hnvec);
  let e1 = cnt.plus(hnvec);
  return LineSegment.mk(e0,e1);
}
*/
item.genRandomPoint = function (rect) {
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

// When in fromEnds mode, the segment has an "end" which is sepNext beyond end1, this end is where the next segment can be droppe
// normally sepNext is an invisible distance which prevents the detection of an intersection with the segment which is being continued.

item.genForestSegment = function (p,ln,angle,sepNext=0) {
  //debugger;
  let vec = Point.mk(Math.cos(angle),Math.sin(angle));
  let e0,e1,end,rs;
  e0 = p;
  p.isEnd = 1;
  end  = p.plus(vec.times(ln+sepNext));
  e1  =  p.plus(vec.times(ln));
  rs = LineSegment.mk(e0,e1);
  let g = p.generation;
  if (g === undefined) {
    g = 0;
    p.generation = 0;
  }
  rs.end = end;
  if (p.seed) {
    end.seed = p.seed;
  }
  end.generation = g+1;
  end.direction = angle;    
  rs.fromEnd = p;
  return rs;
}



item.genOneSegment = function (p,direction) {
  let {sepNext,segLength:len,lineExt=0} = this.forestDropParams;
	let seg = this.genForestSegment(p,len,direction,sepNext);
  return seg;
}

item.insideCanvas = function (p) {
  let {width,height} = this;
  if ((!width)  || (!height)) {
    return true;
  }
  let hw = 0.5*width;  
  let hh = 0.5*height;  
  let {x,y} = p;
  return (-hw < x) && (x < hw) && (-hh < y) && (y < hh);
}

item.segmentInCanvas = function (seg) {
  let rect = this.canvasToRectangle();
  return rect.contains(seg);
}
/*
  let {width,height} = this;
  let {doNotCross,doNotExit} = this.forestDropParams;
  let {end0,end1} = seg;
  if ((!this.insideCanvas(end0)) || (!this.insideCanvas(end1))) {
    return true;
  }
  if (exclusionZones) {
    let eln = exclusionZones.length;
    for (let i=0;i<eln;i++) {
      let zone = exclusionZones[i];
      if (zone.contains(end0) || zone.contains(end1)) {
        return true;
      }
    }
  }
  if (doNotCross) {
    let eln = doNotCross.length;
    for (let i=0;i<eln;i++) {
      let zone = doNotCross[i];
      if (zone.contains(end0) !== zone.contains(end1)) {
        return true;
      }
    }
  }
  if (doNotExit) {
    let eln = doNotExit.length;
    for (let i=0;i<eln;i++) {
      let zone = doNotExit[i];
      if ((!zone.contains(end0)) ||  (!zone.contains(end1))) {
        return true;
      }
    }
  }
  let ln = shapes.length;
  for (let i=0;i<ln;i++) {  
    let ip = seg.intersects(shapes[i]);
    if (ip) {
      return true;
    }
  }
}
*/

item.intersectsSomethingggg = function (g) {
  let {shapes,width,height,ignoreBefore:ibf} = this;
  let ln = shapes.length;
  let st = (ibf)?ibf:0;
  for (let i=st;i<ln;i++) {  
    let seg = shapes[i];
    if (g.intersects(seg)) {
      return true;
    }
  }
}

item.activeEnds = function () {
  let ends = this.ends;
  let rs = [];
  let cnt = 0;
  ends.forEach((end) => {
    cnt++
    if (!(end.inactive)) {
      rs.push(end);
    }
  });
  return rs;
}
let loopCnt = 0;
let totalTries = 0;
item.addSegmentAtThisEnd = function (end) {
  let {shapes,ends,numRows,randomGridsForShapes,drops} = this;
  let {maxDrops=Infinity,segLength,dropTries,maxTotalTries=Infinity} = this.forestDropParams;
  if (!this.generateForestDrop) {
    return;
  }
  let tries = 0;
  let cell,rvs;
  if (numRows && randomGridsForShapes) {
    cell = this.cellOf(end);
    rvs = this.randomValuesAtCell(randomGridsForShapes,cell.x,cell.y);
  }
  while (totalTries < maxTotalTries) {
   totalTries++; 
    loopCnt++;
    console.log('loops',loopCnt);	
    let dropStruct = this.generateForestDrop(end,rvs);
    let ifnd = 0;
    let sln = 0
    if (dropStruct && (dropStruct.geometries.length>0)) {
        //if (LineSegment.isPrototypeOf(g))

      let segs = dropStruct.geometries;
      sln = segs.length;
      for (let i=0;i<sln;i++) {
        let seg = segs[i];
        debugger;
        geom.moveBy(seg,end);
        let nend = seg.end.plus(end);
        seg.end.copyto(nend);
       
      if (!this.segmentInCanvas(seg) || geometriesIntersect([seg],drops)) {
          ifnd = true;
          break;
        }
      }
    } else {
      ifnd = 1;
    }
    if (ifnd) {
      tries++;
      if (tries === dropTries) {
        console.log('inactivated - could not find continuation');
        end.inactive = 1;
        return 0;
      }
    } else {
      let shapes = dropStruct.shapes;
      shapes.forEach( (s) => s.moveto(end));
      this.installDropStruct(dropStruct);
      return 1;  
    } 
  }
}

item.randomArrayElement = function (a) {
  let ln = a.length;
  let rni = Math.floor(ln*Math.random());
  return a[rni]
}

item.lastArrayElement = function (a) {
  let  ln = a.length;
  return a[ln-1]
}

item.randomDirection = function (n) {
  if (n) {
    return 2*Math.PI*(Math.floor(n*Math.random())/n);
  } else {
    return 2*Math.PI*Math.random();
  }
}

item.addSegmentAtSomeEnd = function () {
  let {extendWhich,maxTotalTries=Infinity} = this.forestDropParams;
  while (totalTries<maxTotalTries) {
    let ae = this.activeEnds();
    let end;
    let ln = ae.length;
    if (ln > 0) {
      if (extendWhich === 'last') {
        end = this.lastArrayElement(ae);
      } else if (extendWhich === 'random') {
        end =  this.randomArrayElement(ae);
      } else {
        end = ae[0];
      }
      let ars = this.addSegmentAtThisEnd(end);
      if (ars) {
        return ars;
      }
    } else {
      return "noEndsLeft";
    }
  }
}

item.addSegmentsAtEnds = function () {
  let maxEndTries = 100;
  let tries = 0; 
  let {maxDrops=Infinity,maxTotalTries=Infinity,numDropped} = this.forestDropParams;
  while ((this.numDropped  < maxDrops) && (totalTries < maxTotalTries)) {
    let ars = this.addSegmentAtSomeEnd();
    if (ars === 'noEndsLeft') {
      return ars;
    }
    if (!ars) {
     return 'triesExhausted';
    }
  }
  return ['loopsExceeded',this.numDropped];
}
       
item.addRandomSegmenttt = function () {
  let {numRows,randomGridsForShapes} = this;
  let rvs;
  let p = this.genRandomPoint(); 
  if (numRows && randomGridsForShapes) {
    let cell = this.cellOf(p);
    rvs = this.randomValuesAtCell(randomGridsForShapes,cell.x,cell.y);
  }
  let dropStruct = this.generateDrop(p,rvs);
  let ifnd = 0;
  let sln=0;
  if (dropStruct) {
    let [segs] = dropStruct;
    let rect;
    sln = segs.length;
    for (let i=0;i<sln;i++) {
      let seg = segs[i];
      if (this.intersectsSomething(seg)) {
        return undefined;
      }
    }
    this.installDropStruct(dropStruct);
    return true;

  } else {
    return undefined;
  }
}
    
item.addNrandomSegments = function (n) {
  let {shapes,ends} = this;
  let {maxDrops=Infinity,dropTries,maxLoops=Infinity,segLength,fromEnds} = this.forestDropParams;
  if (!this.generateDrop) {
    return;
  }
  let tries = 0;
  let numAdded = 0;
  while (numAdded < n) {
    if (1 || fromEnds) {
      let ae = this.addSegmentsAtEnds();
      if (ae[0] === 'loopsExceeded') {
         return numAdded;
      } else {
        numAdded++
      }
      continue; 
    }
  }
  return numAdded;
} 

rs.generateDrop = function (p) {
  return this.generateFan(Object.assign({startingPoint:p},this.forestDropParams));
}

item.addRandomSegments = function () {
  debugger;
  let {shapes,ends} = this;
  let {maxDrops=Infinity,maxTotalTries=Infinity,dropTries,maxLoops=Infinity,segLength,fromEnds} = this.forestDropParams;
  if (!this.generateForestDrop) {
    return;
  }
  this.numDropped = 0;
  let tries = 0;
  totalTries = 0;
  let endsVsNew = 1;
  let loops = 0;
  while (loops < maxLoops) {
    loops++;
    if (1 || fromEnds) {
      if (Math.random() < endsVsNew) {
        let ae = this.addSegmentsAtEnds();
        if (ae[0] === 'loopsExceeded') {
           return;
        }
      }
      return; 
    }
 //   let segsAdded = this.addRandomSegment();
  }
}

item.installShape = function (shape) {
 // debugger;fro
  this.shapes.push(shape);
  shape.show();
  shape.update();
  this.numDropped++;
  return shape;
}

item.installDropStruct = function (dropStruct) {
  debugger;
  let {drops,ends} = this;
  let {geometries:segs,shapes} = dropStruct;
  let ln = drops.length;
  segs.forEach( (seg) => {
    seg.number = ln;
    let {end0,end1,end} = seg;
    end0.end0of = ln;
    end1.end1of = ln;
    if (end) {
      end.isEndOf = ln;
    }
    drops.push(seg);
    if (end) {
      ends.push(end);
      end.isEnd = 1;
    }
    let fre = seg.fromEnd;
    if (fre) {
      fre.inactive = 1;
    }
    ln++;
  });
  shapes.forEach( (shape) => this.installShape(shape));
}

item.concatEachArray = function (ays) {
  let c0 = [];
  let c1 = [];
  ays.forEach( (a) => {
   let [a0,a1]= a;
   c0.push(...a0);
   c1.push(...a1);
  });   
   return [c0,c1];
}

item.generateForestDrops = function (iparams) {
  this.forestDropParams =iparams;
  if (!this.drops) {
    this.drops = [];
  }
  this.numDropped = 0;
  this.ends = [];
  if (!this.shapes) {
     this.set('shapes',core.ArrayNode.mk());
  }
  if (this.initialForestDrop) {
    let isegs = this.initialForestDrop();
    this.installDropStruct(isegs);
  }
  this.addRandomSegments();
}

item.inAzone = function (zones,p) {
  if (!zones) {
    return 0;
  }
  let fnd = false;
  let eln = zones.length;
  for (let i=0;i<eln;i++) {
    let zone = zones[i];
    if (zone.contains(p)) {
      return 1;
    }
  }
  return 0;
}
}
export {rs};


      
