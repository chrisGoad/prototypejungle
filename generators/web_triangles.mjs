//active
//.require('/shape/line.js','/shape/rectangle.js','/shape/circle.js','/shape/polygon.js','/gen0/Basics.js','/mlib/pgen.js','/mlib/web.js',
//function (linePP,rectPP,circlePP,polygonPP,Basics,addPointGenMethods,addWebMethods) {


import {rs as linePP} from '/shape/line.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';
//import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addPointGenMethods} from '/mlib/pointGen.mjs';	
import {rs as addWebMethods} from '/mlib/web.mjs';	

let rs = basicP.instantiate();
addPointGenMethods(rs);

let stripes = rs.set('stripes',containerShape.mk());

rs.setName('web_triangles');

let sep = 100;
let nr = 20;
let wd = nr * sep;

const mkWebParams = (min,max) => {
	return {minConnectorLength:min*sep,maxConnectorLength:max*sep,webTries:50};
}

let  webParams = [mkWebParams(3,4),mkWebParams(1,2),mkWebParams(3,4),mkWebParams(1,2),mkWebParams(1,2),mkWebParams(3,4)];
								
let  topParams = {width:wd,height:wd,frameWidth:3.2*wd,frameHeight:3.2*wd,frameVisible:0};

let  gridParams = {numRows:nr,rowSep:sep};
let toRadians = Math.PI/180;

Object.assign(rs,topParams);
Object.assign(rs,gridParams);
	
let numWalks = 6;
let polygons = rs.set('polygons',arrayShape.mk());

let webs = rs.set('webs',arrayShape.mk());
for (let i=0;i<numWalks;i++) {
	let w = basicP.instantiate();
	addWebMethods(w);
	Object.assign(w,webParams[i]);
	webs.push(w);
}
let grayblue = 'rgb(50,50,100)';

//let triangleColors = ['red','green','red','green','green','red'];
let iclr = 'black';
let oclr = 'red';
let triangleColors = [oclr,iclr,oclr,iclr,iclr,oclr];

rs.initProtos = function () {	
  let lineP = this.lineP = linePP.instantiate();
	this.lineP.stroke = 'blue';
	this.lineP.stroke = 'white';
	this.lineP['stroke-width'] = 0.1*sep;
	let polygonP = this.set('polygonP',polygonPP.instantiate()).hide();
	polygonP['stroke-width'] =0;
}  
let disp = wd;

rs.initialize = function () {
  
	this.initProtos();
	this.addFrame();
	let {circleP,rectP,polygonP} = this;
	let rws = [];
	for (let i=0;i<numWalks;i++) {
		rws.push(this.pascalPoints(gridParams));
	}
	let hwd = 0.5* wd;
	let hsep = 0.5*sep;
	let qsep = 0.25*sep;
	const mkTriangle = (clr,upsidedown) => {
		let pg = polygonP.instantiate().show();
		polygons.push(pg);
		let topc,botx,boty;
		if (upsidedown) {
			topc = hwd+qsep;
			botx = hwd - hsep;
			boty = sep - hwd;
		} else {
			topc = -hwd-qsep;
			botx = hsep - hwd
			boty = hwd - sep;
		}
		let p0 = Point.mk(botx,boty);
		let p1 = Point.mk(-botx,boty);
		let p2 = Point.mk(0,topc);
		pg.corners = [p0,p2,p1,p0];
		pg.fill = clr;
		return pg;
	}
	const mkTriWeb = (i,clr,ps) => {
		let w = webs[i];
		let tr = mkTriangle(triangleColors[i]);
		w.generateWeb(rws[i],this.lineP);
		w.moveto(ps);
		tr.moveto(ps);
	}
	for (let i=0;i<3;i++) {
		let ps = Point.mk((i-1)*(wd),disp);
		mkTriWeb(i,triangleColors[i],ps);
	}
	mkTriWeb(3,triangleColors[3],Point.mk(-0.5*wd,disp-wd));
	mkTriWeb(4,triangleColors[4],Point.mk(0.5*wd,disp-wd));
	let lgap = mkTriangle(grayblue,1);
	lgap.moveto(Point.mk(-hwd-hsep,disp-sep));
	let rgap = mkTriangle(grayblue,1);
	rgap.moveto(Point.mk(hwd+hsep,disp-sep));
  let tgap = mkTriangle(grayblue,1);
	tgap.moveto(Point.mk(0,disp-wd-2*sep));
	mkTriWeb(5,triangleColors[5],Point.mk(0,disp-2*wd));
}
export {rs};





