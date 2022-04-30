

import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as polygonPP} from '/shape/polygon.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addSphereMethods} from '/mlib/sphere.mjs';
import {rs as addPowerGridMethods} from '/mlib/powerGrid.mjs';
let rs = basicsP.instantiate();

addGridMethods(rs);
addSphereMethods(rs);
addPowerGridMethods(rs);
	
rs.setName('grid_sphere');

let opa = 0.3;
let r = 255;
let b = 255;
rs.powerParams = {
  root:2,
  sizeMap:[.5,1,2,3,4,0,0],
  fillMap:[
    'rgba(0,255,0,1)',
    'rgba(255,0,0,0.4)',
    'rgba(255,255,255,0.4)',
    'rgba(0,255,255,0.4)',
    'rgba(0,0,255,0.8)',
    'rgba(0,0,0,1)',
    'rgba(255,255,0,1)'
  ]
};
    


let bkdim = 1200;

let topParams = {
  pointJiggle:0,  
  numRows : 96,
  numCols : 96,
  width:50,
  height:50,
  frameWidth:bkdim,
  frameHeight:bkdim,
  sphereCenter:Point3d.mk(0,0,-20),
  sphereDiameter:35,
  focalPoint:Point3d.mk(0,0,50),
  focalLength:10,
  cameraScaling:100
}
Object.assign(rs,topParams);

rs.initProtos = function () {
  let polygonP = this.set('polygonP',polygonPP.instantiate()).hide();
  polygonP['stroke-width'] = 0;
}


rs.shapeGenerator = function () {
  return this.polygonP.instantiate().show();
}

rs.initialize = function () {
 let {focalPoint,focalLength,cameraScaling} = this;
 this.initProtos();
 this.addFrame();
 this.camera = geom.Camera.mk(focalPoint,focalLength,cameraScaling,'z');
  this.generateGrid();
}

export {rs}



