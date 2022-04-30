
//core.require('/shape/circle.js','/shape/rectangle.js','/line/line.js','/random/addLinesShapes0.js',//'/random/addSpacedPoints3.js',
//core.require('/shape/circle.js','/shape/rectangle.js','/line/line.js','/gen0/Basics.js','/mlib/lines.js',//'/random/addSpacedPoints3.js',
  //function (elementPP1,elementPP2,elementPP3,item,addMethods) {




import {rs as linePP} from '/line/line.mjs';
import {rs as basicP} from '/generators/basics.mjs';
import {rs as addLinesMethods} from '/mlib/lines.mjs';	

let rs = basicP.instantiate();
addLinesMethods(rs);

rs.setName('lines_particles');

rs.initializeProtos= function () {
    this.lineP = linePP.instantiate();
 /*   this.elementP1.fill = 'rgb(140,140,140)';
    this.elementP1.fill = 'transparent';
    this.elementP1.stroke = 'transparent';

   core.assignPrototypes(this,'elementP2',elementPP2);
  this.elementP2.fill = 'red';
  core.assignPrototypes(this,'elementP3',elementPP3);
  this.elementP3.stroke = 'rgb(220,220,220)';  
  this.elementP3.stroke = 'black';  
  //this.elementP3.stroke = 'black';  
 // this.elementP3.stroke = 'magen';  
  this.elementP3['stroke-width'] = 0.5;
  core.assignPrototypes(this,'lineP2',elementPP3);
  this.lineP2.stroke = 'white';  
  this.lineP2.stroke = 'rgb(200,200,200)';  
  this.lineP2.stroke = 'red';  
  //this.elementP3.stroke = 'black';  
 // this.elementP3.stroke = 'magenta';  
  this.lineP2['stroke-width'] =.5;
  this.lineP = this.elementP3;
  */
}

  


rs.initialize = function () {
  debugger;
  this.initializeProtos();
  core.root.backgroundColor = 'blue';
  core.root.backgroundColor = 'rgb(10,10,125)';
  core.root.backgroundColor = 'blue';
  //core.root.backgroundColor = 'white';
  this.width = 600;
  this.height = 400;
  this.numPoints = 600;
  this.numLines = 1000;
  this.angleMin = -10;
  this.angleMin = -90;
  this.angleMax = 10;
  this.angleMax = 90;
 // this.numPoints = 100;
  this.minRadius = 2;
  this.minRadius = 40;
  this.maxRadius = 6;
  this.maxRadius = 60;
  this.maxTries = 20000;
  this.margin = 10;
  this.shortenBy = -20;
  //this.generatePoints();
  
  //console.log('numPoints',this.points.length);
  let scaleFactor = 1;
  const setDimension1 = function (shape,dim) {
    let y = shape.getTranslation().y;
    let ht = 200;
    let ry = Math.abs(y)	/ht;
    shape.dimension = scaleFactor*dim;//ry*dim;
  }
   const setDimension2 = function (shape,dim) {
    shape.width = scaleFactor*dim;
    shape.height = scaleFactor*dim;
  }
  const setDimension3 = function (shape,dim) {
    //let dir = 0;// Math.random() * 2 * Math.PI;
    let y = shape.getTranslation().y;
    let ht = 200;
    let ry = Math.abs(y)	/ht;
    let dir = (Math.random() -0.5) * ry * Math.PI;
    let lineLength = dim * 1.0;//lineLengthRatio;
    let vec = Point.mk(Math.cos(dir),Math.sin(dir)).times(lineLength/2);
    let end0 = vec.minus();
    let end1 = vec;
    shape.setEnds(end0,end1);
  }
   let {lineP,elementP2,elementP3} = this;

this.generateShapes([lineP,elementP3],[setDimension1,setDimension3],[1]	);
this.generateShapes([lineP],[setDimension1],[1]	);
 this.preliminaries();

 //this.generateShapes([lineP,elementP2],[setDimension1,setDimension2],[0.5]	);
 //this.genSides();
 debugger;
 //for (let i = -20;i<20;i++) {
 let numLines = this.numLines;
 for (let i = 0;i<numLines;i++) {
   let pnt = Point.mk(i*10,0);
   let ints = this.intersectionsWithLine(this.genRandomPoint(),this.genRandomUnitVector(),true)
   this.displaySegments(ints[0]);
   this.displaySegments(ints[1],true);
   
 }
 /*for (let i = -20;i<20;i++) {
   let pnt = Point.mk(i*10,0);
   this.displaySegments(this.intersectionsWithLine(pnt,Point.mk(1,-1)));
 }*/
 //this.displaySegments(ints);
// this.generateShapes([lineP],[setDimension1]);
  // this.generateShapes([lineP,elementP2],[setDimension1,setDimension2],[1]);

}	
export {rs};

      

