
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

let topParams = {width:ht,height:ht,framePadding:0.1*ht};

let dropParams = {dropTries:10,radius:30};

let webParams = {webTries:1000,minConnectorLength:300,maxConnectorLength:600}

let sphereParams ={sphereCenter:Point3d.mk(0,0,-0.4*wd), sphereDiameter:0.5*wd, focalPoint:Point3d.mk(0,0,wd), focalLength:10, cameraScaling:1000}

Object.assign(rs,topParams);

Object.assign(rs,sphereParams);

rs.initProtos = function () {
  let lineP = this.lineP = linePP.instantiate();
  this.lineP.stroke = 'yellow';
  this.lineP['stroke-width'] = 15;
  let circleP = this.circleP = circlePP.instantiate();

}  
 
rs.initialize = function () {
  this.initProtos();
  let {focalPoint,focalLength,cameraScaling,lineP} = this;
  let pnts = this.generateCircleDrop(dropParams).points;
  this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,'z');
  let points = this.pointsTo3dAndBack(pnts);
  this.generateWeb(Object.assign({points},webParams));
  this.addFrame();
}

export {rs};


