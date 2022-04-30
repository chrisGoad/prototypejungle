
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

rs.setName('web_aphelion');
let ht= 2000;
ht = 6000;
let wd = ht;

let topParams = {width:ht,height:ht,maxDrops:60000,dropTries:50,webTries:1000,framePadding:0.1*ht,minConnectorLength:300,maxConnectorLength:600,shortenBy:20}

Object.assign(rs,topParams);

Object.assign(rs,{sphereCenter:Point3d.mk(0,0,-0.3*wd),sphereDiameter:0.5*wd,focalPoint:Point3d.mk(0,0,wd),focalLength:10,cameraScaling:1000});
rs.sphereCenter = Point3d.mk(0,0,-0.4*ht)

rs.initProtos = function () {
  debugger;
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'yellow';
  this.lineP['stroke-width'] = 8;
  let circleP = this.circleP = circlePP.instantiate();

}  
 
rs.initialize = function () {
  this.initProtos();
  let {focalPoint,focalLength,cameraScaling,lineP} = this;
  this.zone = geom.Circle.mk(Point.mk(0,0),0.5*this.width);
  var pnts = this.generateDrop(30).points;
  this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,'z');
  let points = this.pointsTo3dAndBack(pnts);
  this.generateWeb({points});
  this.addFrame();
}


export {rs};


