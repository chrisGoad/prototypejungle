// documented in https://prototypejungle.net/doc/basics.html

import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as shadedRectPP} from '/shape/shadedRectangle.mjs';
import {rs as textPP} from '/shape/textOneLine.mjs';

const rs = function (item) {
window.root = core.root;
item.stateOpsDisabled = 1; // for exported version
item.setName = function (name,variant,jsonName) {
  let nameWithV = name+(variant?'_v_'+variant:'');
  let nameWithoutV= name;
	let theName = this.name = nameWithV+(this.signIt?'_s':'');
  this.variant = variant;
	core.vars.whereToSave = theName;
	let pathPart = jsonName?jsonName:nameWithV;
	this.path = `json/${pathPart}.json`;
}


item.numFrames = 0;
item.numRects =0;
item.addRectangle  = function (iparams) {
  if (!iparams) {
    return;
  }
  let params = (typeof iparams === 'string')?{fill:iparams}:iparams;
  let {width,height,fill='transparent',leftFill,rightFill,stroke,stroke_width,position} = params;
  if (!width) {
    width = this.width;
   }
   if (!height) {
    height = this.height;
   }
   if (!width || ((!fill)  && (!leftFill))) {
    return;
   }
  let rect  = this.set('brect'+this.numRects,leftFill?shadedRectPP.instantiate():rectPP.instantiate());
  this.numRects = this.numRects + 1;
  if (fill) {
    rect.fill = fill;
  }
   if (leftFill) {
    rect.leftFill = leftFill;
    rect.rightFill = rightFill;
  } else {
    rect.fill = fill;
  }
  if (stroke) {
    rect.stroke = stroke;
  }
  if (stroke_width) {
    rect['stroke-width'] = stroke_width;
  } 
  rect.width = width;
  rect.height = height;
	if (position) {
    rect.moveto(position);
  }
  rect.update();
	rect.show();
  return rect;
}

// add a stripe around the image, to control the size of the jpg when saved
item.addFrame = function (params) {
  let {width,height} = this;
  let fparams = params?params:this;
  let {frameStroke:frs,frameFill:frf,framePadding:frp,
  frameWidth,frameHeight,frameStrokeWidth:fswd,framePos:pos,signIt} =  fparams;
  let frpd = frp!==undefined;
  if (!(frpd || frameWidth)) {
    return;
  }
  if (!frs) {
    frs = 'rgb(2,2,2)';
  }
  fswd = fswd?fswd:2;
  frf = frf?frf:'transparent';
  if (frameWidth) {
    width = frameWidth;
    height = frameHeight;
  } else {
    width = width + frp;
    height = height + frp;
  }
  let rect =  this.addRectangle({width,height,fill:frf,stroke:frs,strokeWidth:fswd,position:pos});
  return rect;
}


item.installLine = function (line) {
  this.shapes.push(line);
  line.show();
  line.update();
  this.numDropped++;
  return line;
}



item.cellOf  = function (p) {
  let {x,y} = p;
  let {width,height,numRows,numCols} = this;
  let hw = width/2;
  let hh = height/2;
  let ix = Math.floor(((x+hw)/width) * numCols);
  let iy = Math.floor(((y+hh)/height) * numRows);
  return {x:ix,y:iy};
}

item.genCircle = function (crc,circleP,scale=1) {
   let {center,radius} = crc;
   let rs = circleP.instantiate();
   rs.radius = scale*radius;
   rs.moveto(center);
   return rs;
 }

item.genLine = function (sg,lineP,ext=0) {
  let {end0,end1} = sg;
  if (!lineP) {
    debugger;
  }
  if (ext) {
    let vec = end1.difference(end0);
    let nvec = vec.normalize();
    end1 = end1.plus(nvec.times(ext));
  }
  let theLineP = lineP;
  let line = theLineP.instantiate();
  if (!line.setEnds) {
    debugger;
  }
  if (this.genPoint3d) {
    let e03d = this.via3d(end0);
    let e13d = this.via3d(end1);
    line.setEnds(e03d,e13d);
  } else {
    line.setEnds(end0,end1);
  }
  return line;
}

item.geom2shape = function (g,lineP,circleP,scale=1) {
  if (Circle.isPrototypeOf(g)) {
    return this.genCircle(g,circleP,scale);
  }
   if (LineSegment.isPrototypeOf(g)) {
    return this.genLine(g,lineP);
  }
}

item.geoms2shapes = function (gs,lineP,circleP,scale=1) {
  return gs.map((g) => this.geom2shape(g,lineP,circleP,scale));
}
   
item.addLine = function (params)  {
  let {lines,line,lineP,end0,end1,segment} =params;
	if (!lines) {
		lines = this.lines =this.set('lines',core.ArrayNode.mk());
	}
  let oline=line?line:(end0?this.genLine(LineSegment.mk(end0,end1),lineP):this.genLine(segment,lineP));
  oline.show();
  lines.push(oline);
  oline.update();
  return oline;
}

const numPowers = function(n,p) {
  if (n === 0) {
    return 0;
  }
  if (n === p) { 
    return 1;
  }
  if (n%p === 0) {
    return 1 + numPowers(n/p,p);
  }
  return 0;
}
item.numPowers = function (n,p) {
  return numPowers(n,p);
}

// for the facility for saving state as json
item.assignValueToPath = function (path,value) {
  let spath = path.split('/');
  let ln = spath.length;
  let cvl = this;
  for (let i=0;i<ln-1;i++) {
    let pel = spath[i];
    let nvl = cvl[pel];
    if (!nvl) {
      nvl = {};
      cvl[pel] = nvl;
    }
    cvl = nvl;
  }
  let lst = spath[ln-1];
  cvl[lst] = value;
}
  
item.assignValues = function (vls) {
  vls.forEach( (vl) => {
    let [path,value] = vl;
    this.assignValueToPath(path,value);
  });
}
    
item.getTheState = function (cb) {
  let {path} = this;
  debugger;
  core.httpGet(path, (error,json) => {
    debugger;
    let state = JSON.parse(json);
    this.assignValues(state);
    if (cb) {
      cb();
    }
  });
}

item.saveTheState = function (cb) {
  let {path,stateOpsDisabled} = this;
  const next =
    () => {
      if (cb) {
        cb();
      } 
   };
    
  if (stateOpsDisabled) {
    next();
    return;
  }
  let state = this.computeState?this.computeState():null;
  if (state) {
    let jsn = JSON.stringify(state);
    core.saveJson(path,jsn,
      function (err,rs) {
        next();
      })
  }
}

item.horizontalize = function (p,noFrame) {
  if (p.width) {
    this.height = p.width;
    this.width = p.height;
  }
  this.frameWidth = p.frameHeight;
  this.frameHeight = p.frameWidth;
}


item.pointsTo3dAndBack = function (pnts) {
  let rs = [];
  pnts.forEach((p) => {
    let p3d = this.genPoint3d(p);
    if (p3d && (p3d.category !== 'notOnSurface')) {
      let ppnt = this.camera.project(p3d);
      rs.push(ppnt);
    } 
  });
  return rs;
}
item.toRGB = (r,g,b) => `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;

item.toGray = (v) => {
  let vi = Math.floor(v);
  return `rgb(${vi},${v},${vi})`;
}
item.canvasToRectangle = function () {
 let {width:wd,height:ht} = this;
 let corner = Point.mk(-0.5*wd,-0.5*ht);
 let extent = Point.mk(wd,ht);
 return Rectangle.mk(corner,extent);
}

item.rectSides = function (rect) {
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
  return [LineSegment.mk(UL,UR),LineSegment.mk(UR,LR),LineSegment.mk(LR,LL),LineSegment.mk(LL,UL)];
}

item.circleToCircleShape = function (nm,c,circleP) {
  let {center,radius} = c;
  let crc = circleP.instantiate().show();
  crc.dimension = 2*radius;
  this.set(nm,crc);
  crc.moveto(center);
  return crc;
}
 
core.root.backgroundColor = 'black';
item.setBackgroundColor = (clr) => core.root.backgroundColor = clr; 
}
export {rs};
 
