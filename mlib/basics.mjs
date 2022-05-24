//active

var root;
import {rs as rectPP} from '/shape/rectangle.mjs';
//import {rs as rectPP} from '/shape/rectangle.js','/shape/textOneLine.js',function (rectPP,textPP) {
import {rs as textPP} from '/shape/textOneLine.mjs';
//core.require('/gen0/test.js',function (addRandomMethods) {
	//debugger;a
const rs = function (item) {
window.root = core.root;
root = 3;
item.setName = function (name,variant,jsonName) {
  let nameWithV = name+(variant?'_v_'+variant:'');
  let nameWithoutV= name;
	let theName = this.name = nameWithV+(this.signIt?'_s':'');
  this.variant = variant;
	core.vars.whereToSave = theName;
	//let theName = jsonName?jsonName:name+(variant?'_v_'+variant:'');
	let pathPart = jsonName?jsonName:nameWithV;
	this.path = `json/${pathPart}.json`;
}


item.signIt = 0;

item.addSignature = function() {
	let {width,height,sigScale,vSigScale,sigColor='white',sigX=0.45,sigY,sigRectX,sigRectY,backStripeWidth:bkw,backStripeHeight:bkh,backStripePadding:bkp} = this;
	debugger;
    
  this.textP = textPP.instantiate();
	if (!bkw) {
    if (!bkp) {
      console.log("Error: either backStripeWidth of backStripePadding need to be specified for a signature");
      debugger;
      return;
    }
		bkw = width + bkp;
		bkh = height + bkp;
	}
  let square = width === height;
  let vertical = bkh > 1.4* bkw;
  if (!sigY) {
    sigY = square?(vertical?0.27:0.45):.45;
  }
  if (!sigScale) {
    sigScale = (bkw === bkh)?bkw/700:bkw/1000;
  }
  if (!vSigScale) {
    vSigScale = bkh/1000;
  }
	let sigC = this.set('sigC',svg.Element.mk('<g/>'));
/*	if (sigRectX) {
	  let sigR = sigC.set('sigR', this.sigRectP.instantiate());
	  sigR.show();
		sigR.width = 0.05*width;
	  sigR.height = 0.05*width;
	}*/
	let sig = sigC.set('sig',this.textP.instantiate())
	sig.show();
	sig.text = 'C.G.';
	sigC.moveto(Point.mk(sigX*bkw,sigY*bkh));
	sig.stroke = sigColor;
	sig['font-family'] = 'Trattatello';
	sig['font'] = 'fantasy';
	//sig['font-size'] = "30"	;
	sig.setScale(vertical?vSigScale:sigScale)
}


item.numFrames = 0;
item.numRects =0;
item.addRectangle  = function (iparams) {
//	debugger;
  if (!iparams) {
    return;
  }
  let params = (typeof iparams === 'string')?{fill:iparams}:iparams;
  let {width,height,fill='transparent',stroke,stroke_width,position} = params;
  if (!width) {
    width = this.width;
   }
   if (!height) {
    height = this.height;
   }
   if (!width || !fill) {
    return;
   }
  let rect  = this.set('brect'+this.numRects,rectPP.instantiate());
  this.numRects = this.numRects + 1;
  rect.fill = fill;
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
//	debugger;
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

// add a stripe around the image, to control the size of the jpg when saved
item.addFramee = function (params) {
	debugger;
  let {width,height} = this;
  let fparams = params?params:this;
	let {frameStroke:frs,frameFill:frf,framePadding:frp,framePaddingX:frpx,framePaddingy:frpy, 
	frameWidth,frameHeight,frameStrokeWidth:fswd, frameVisible,framePos:pos,signIt} =  fparams;
  let frpd = frp!==undefined;
  if (!(frpd || frameWidth)) {
    return;
  }
  if (!frs) {
    frs = 'rgb(2,2,2)';
   // frs = 'white';
  }
  fswd = fswd?fswd:2;
  let frr = this.set('brect'+this.numFrames,rectPP.instantiate());
  this.numFrames = this.numFrames + 1;
  frr.fill = frf?frf:'transparent';
	frr.stroke = frs;
  frr['stroke-width'] = fswd;
	if (frameWidth) {
		frr.width = frameWidth;
		frr.height = frameHeight;
	} else {
		let frPx = frpx?frpx:(frpd?frp:0.1*width);
		let frPy = frpy?frpy:(frpd?frp:0.1*height);
		frr.width = width + frPx;
		frr.height = height + frPy;
	}
	if (pos) {
    console.log('Stripe Pos',pos.x,pos.y);
		frr.moveto(pos);
	}
  frr.update();
	frr.show();
}


item.addBackground = function () {
	let {backgroundColor:bkc,backgroundPadding:bkp=0} =  this;
	//let {backgroundColor:bkc,width,height,backgroundPadding:bkp=0} =  this;
 // debugger;
	if (!bkc) {
		return;
	}
  this.addFrame({framePadding:bkp,frameFill:bkc});
  return;
	//core.assignPrototypes(this,'backgroundRectP',rectPP);
  this.backgroundRectP = rectPP.instantiate();

	this.backgroundRectP['stroke-width'] = 0;
	this.backgroundRectP.fill = bkc;
	//let {backgroundRectP,backgroundWidth,backgroundHeight,backgroundPadding,backgroundColor,width,height} = this;
  let bkr = this.set('backRect',this.backgroundRectP.instantiate());
  bkr.width = width+bkp;
	bkr.height = height+bkp;
  //bkr.width = backgroundWidth?backgroundWidth:width + backgroundPadding;
//	bkr.height = backgroundHeight?backgroundHeight:height + backgroundPadding;
	bkr.show();
	
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
	//let theLineP = lineP?lineP:this.lineP;
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

//item.installLine = function (lines,a0,a1,a2)  {
item.addLine = function (params)  {
  let {lines,line,lineP,end0,end1,segment} =params;
	if (!lines) {
		lines = this.lines =this.set('lines',core.ArrayNode.mk());
	}
  let oline=line?line:(end0?this.genLine(LineSegment.mk(end0,end1),lineP):this.genLine(segment,lineP));
//  let line = a2?this.genLine(LineSegment.mk(a0,a1),a2):(a1?this.genLine(a0,a1):a0);
  oline.show();
  lines.push(oline);
  oline.update();
  return oline;
}

item.initBasis = function () {
	if (this.initProtos) {
	  this.initProtos();
	}
	this.addBackground();
	this.addFrame();
//  this.set('shapes',core.ArrayNode.mk());

}

// a utility
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
//cells and coordinates, based on width,height,numRows, numCols

item.point2cell = function (p) {
    let {width,height,numRows,numCols} = this;
    let {x,y} = p;
    let hw = 0.5*width;
    let hh = 0.5*height;
    let cx = Math.floor((x -hw)/numCols);
    let cy = Math.floor((y -hh)/numRows);
    return {x:cx,y:cy};
}



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
	//if (cvl[lst] === undefined) {
	  cvl[lst] = value;
	//}
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
//    this.initializeGrid();
    if (cb) {
      cb();
    }
  });
}

item.saveTheState = function (cb) {
  let {path} = this;
  debugger;
  let state = this.computeState?this.computeState():null;
  if (state) {
    let jsn = JSON.stringify(state);
    core.saveJson(path,jsn,function (err,rs) {
      if (cb) {
        cb();
      } else {
        debugger;
      }
    });
  }
}

item.horizontalize = function (p,noFrame) {
  if (p.width) {
    this.height = p.width;
    this.width = p.height;
  }
  this.backStripeWidth = p.backStripeHeight;
  this.backStripeHeight = p.backStripeWidth;
  if (noFrame) {
    this.backStripeVisible =0;
  }
  debugger;
}
item.pointsTo3dAndBack = function (pnts) {
  //debugger;
	let rs = [];
	pnts.forEach((p) => {
		let p3d = this.genPoint3d(p);
		//let p3d = this.toPoint3d(p);
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
	/* let UL = Point.mk(-hw,hh)
  let UR = Point.mk(hw,hh)
  let LL = Point.mk(-hw,-hh)
  let LR  = Point.mk(hw,-hh)*/
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
 
