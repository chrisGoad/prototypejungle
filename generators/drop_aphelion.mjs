OBSOLETE
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/dropCircles.mjs';
import {rs as addWebMethods} from '/mlib/web.mjs';
import {rs as addSphereMethods} from '/mlib/sphere.mjs';
let rs = basicP.instantiate();

addDropMethods(rs);
addWebMethods(rs);
addSphereMethods(rs);

rs.setName('drop_aphelion');
let ht= 2000;
ht = 6000;
let wd = ht;

let topParams = {width:ht,height:ht,maxDrops:60000,dropTries:50,webTries:1000,segLength:2,frameColor:'rgb(2,2,2)',framePadding:0.1*ht,minConnectorLength:300,maxConnectorLength:600,shortenBy:20}

Object.assign(rs,topParams);

Object.assign(rs,{sphereCenter:Point3d.mk(0,0,-0.3*wd),sphereDiameter:0.5*wd,focalPoint:Point3d.mk(0,0,wd),focalLength:10,cameraScaling:1000});
rs.sphereCenter = Point3d.mk(0,0,-0.4*ht)

rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate());
  this.lineP.stroke = 'yellow';
  this.lineP['stroke-width'] = 8;
}  
 
rs.initialize = function () {
  debugger;
  this.initProtos();
  let {focalPoint,focalLength,cameraScaling,lineP} = this;
  this.zone = geom.Circle.mk(Point.mk(0,0),0.5*this.width);
  var pnts = this.doDrops(30);
  this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,'z');
  let pnts3d = this.pointsTo3dAndBack(pnts);
  this.generateWeb(pnts3d,lineP);
  this.addFrame();
}


export {rs};


