
//core.require('/shape/circleWithGrid.js','/shape/rectangle.js','/shape/line.js','/random/addLinesShapes0.js',//'/random/addSpacedPoints3.js',
core.require('/shape/circleWithGrid.js','/shape/rectangle.js','/shape/line.js','/gen0/Basics.js','/mlib/lines.js',//'/random/addSpacedPoints3.js',
  function (elementPP1,elementPP2,elementPP3,item,addMethods) {
debugger;
//let item = containerShape.mk();

addMethods(item);
item.setName('lines0_20');

let ht = 400;
let topParams = {width:1.5*ht,height:ht,backFill:'rgb(200,2,2)', backgroundPadding:0.1*ht};

Object.assign(item,topParams);

item.initializeProtos= function () {
  this.elementP1',elementPP1);
    this.elementP1.fill = 'rgb(140,140,140)';
    this.elementP1.fill = 'red';
    this.elementP1.delta =20;
    this.elementP1.lineP['stroke-width'] = 4;
    this.elementP1.circleP.fill = 'black';
    this.elementP1.lineP.stroke = 'red';
    this.elementP1.lineP.stroke = 'white';
   this.elementP2',elementPP2);
  this.elementP2.fill = 'red';
  this.elementP3',elementPP3);
  this.elementP3.stroke = 'white';  
  //this.elementP3.stroke = 'black';  
 // this.elementP3.stroke = 'magenta';  
  this.elementP3['stroke-width'] = 0.5;
  this.lineP = this.elementP3;
}

  

/*
item.genRandomPoint = function () {
  let {width,height} = this;
  let rx = Math.floor((Math.random()-0.5) * width);
  let ry= Math.floor((Math.random()-0.5) * height);
  return Point.mk(rx,ry);
}



item.genRandomUnitVector= function () {
  let dir = Math.PI*Math.random();
  let vec = Point.mk(Math.cos(dir),Math.sin(dir));
  return vec;
}
*/

item.initialize = function () {
  debugger;
  this.initializeProtos();
  //setBackgroundColor( = 'blue';
 // setBackgroundColor( = 'rgb(10,10,125)';
  //
  //this.width = 600;
 // this.width = 1200;
  //this.height = 400;
  this.addRectangle(this.backFill);
  this.numPoints = 300;//0;
  this.numPoints = 100;
  this.minRadius = 2;
  this.maxRadius = 6;
  this.maxRadius = 26;
  this.maxTries = 20000;
  this.shortenBy = 0;
  this.numLines = 1000;
  this.shapeExpansionFactor = 1;
  let points = this.set("points",arrayShape.mk());
  let radii = this.set("radii",arrayShape.mk());
  this.points.push(Point.mk(0,0));
  this.radii.push(120);
  //this.generatePoints();
  
  console.log('numPoints',this.points.length);
  let scaleFactor = 1;
  const setDimension1 = function (grid,shape,dim) {
    debugger;
    let scaleFactor = 1;
    let y = shape.getTranslation().y;
    let ht = 200;
    let ry = Math.abs(y)	/ht;
    shape.dimension = scaleFactor*dim;//ry*dim;
  }
   const setDimension2 = function (grid,shape,dim) {
    shape.width = scaleFactor*dim;
    shape.height = scaleFactor*dim;
  }
  const setDimension3 = function (grid,shape,dim) {
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
   let {elementP1,elementP2,elementP3} = this;
 //this.generateShapes([elementP1,elementP2,elementP3],[setDimension1,setDimension2,setDimension3],[.1,.1]);
 //this.generateShapes([elementP3],[setDimension3]);
 //this.generateShapes([elementP1,elementP3],[setDimension1,setDimension3],[0.1]	);
this.preliminaries();
this.generateShapes([elementP1,elementP3],[setDimension1,setDimension3],[1]	);
 //this.generateShapes([elementP1,elementP2],[setDimension1,setDimension2],[0.5]	);
//this.preliminaries();
 //this.genSides();
 debugger;
 //for (let i = -20;i<20;i++) {
 for (let i = 0;i<this.numLines;i++) {
   let pnt = Point.mk(i*10,0);
   this.displaySegments(this.intersectionsWithLine(this.genRandomPoint(),this.genRandomUnitVector()));
 }
 /*for (let i = -20;i<20;i++) {
   let pnt = Point.mk(i*10,0);
   this.displaySegments(this.intersectionsWithLine(pnt,Point.mk(1,-1)));
 }*/
 //this.displaySegments(ints);
// this.generateShapes([elementP1],[setDimension1]);
  // this.generateShapes([elementP1,elementP2],[setDimension1,setDimension2],[1]);

}	
return item;
});
      

