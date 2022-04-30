
//core.require('/shape/polygon.js','/gen0/Basics.js','/mlib/grid.js','/mlib/topRandomMethods.js',
//function (polygonPP,rs,addGridMethods,addRandomMethods) {
//import {rs as rectPP} from '/shape/rectangle.mjs';
import {rs as generatorP} from '/generators/grid_grid_1.mjs';
//mport {rs as addGridMethods} from '/mlib/grid.mjs';
//import {rs as addIntermdiateMethods} from '/ilib/grid.mjs';
//import {rs as addRandomMethods} from '/mlib/topRandomMethods.mjs';

let rs = generatorP.instantiate();
//addGridMethods(rs);
//addRandomMethods(rs);
//addRandomMethods(rs);
//addIntermediateMethods(rs);
  
rs.setName('grid_grid_1_i_1');
let wd = 400;
let nr = 20;
let topParams = {width:wd,height:wd,numRows:nr,numCols:nr,pointJiggle:10,innerRows:5};

Object.assign(rs,topParams);
	

rs.initProtos = function () {
  this.rectP1 = rectPP.instantiate();
  this.rectP1['stroke-width'] = 0;
  this.rectP1.fill = 'white';
  this.rectP1.fill = 'rgba(255,255,255,0.5)';
  this.rectP2 = rectPP.instantiate();
  this.rectP2['stroke-width'] = 0;
  this.rectP2.fill = 'white';
  this.rectP2.fill = 'rgba(0,0,255,0.5)';
}  
	

/*
const instantiateDescriptionInto = function (rs,eltDescription) {
  let {shapePs,positions} = eltDescription;
   let ln = shapePs.length;
   for (let i=0;i<ln;i++) {
     let shapeP = shapePs[i];
     let ps = positions[i];
     let shape = shapeP.instantiate();
    
     rs.set('r'+i,shape);
      shape.show();
     shape.update();
     shape.moveto(ps);
   };
 }


rs.genEltDescription = function () {
   let {innerRows,deltaX,rectP1,rectP2} = this;
   let innerShapePs = [];// core.ArrayNode.mk();
   let positions = [];// core.ArrayNode.mk();
   let innerDim = deltaX/innerRows;
   let rectP = (Math.random() < 0.5)?rectP1:rectP2;
     
   for (let i=0;i<innerRows;i++) {
     let posx=innerDim*(i+0.5) -0.5*deltaX;
     for (let j=0;j<innerRows;j++) {
         if (Math.random() < 0.7) {
           let posy=innerDim*(j+0.5)-0.5*deltaX;
         //  let rect = rectP.instantiate();
          // rs.set(`r_${i}_{j}`,rect);
           innerShapePs.push(rectP);
          // rect.width = 0.5*innerDim;
          // rect.height = 0.5*innerDim;
           positions.push(Point.mk(posx,posy));
         }
     }
   }
   return {shapePs:innerShapePs,positions:positions}
 }
   

rs.shapeGenerator = function (rvs,cell) {
	let {eltDescription1,eltDescription2,shapes} = this;
  debugger;
  let shape = svg.Element.mk('<g/>');
  if (Math.random() < 0.5) {
     instantiateDescriptionInto(shape,eltDescription1);
  } else {
     instantiateDescriptionInto(shape,eltDescription2);
  }
  shapes.push(shape);
	shape.show()
  return shape;
}

rs.initialize = function () {
  debugger;
  this.initProtos();
  core.root.backgroundColor = 'black';
  let {numRows,width,innerRows} = this;
  this.deltaX = width/numRows;
  this.rectP1.width = 1.9*(this.deltaX/innerRows);
  this.rectP1.height = 1.9*(this.deltaX/innerRows); 
  this.rectP2.width = 1.9*(this.deltaX/innerRows);
  this.rectP2.height = 1.9*(this.deltaX/innerRows);
  let eltDescription1 = this.genEltDescription();
  this.eltDescription1 = eltDescription1;  
  let eltDescription2 = this.genEltDescription();
  this.eltDescription2 = eltDescription2;
  this.initializeGrid();
}*/	
export {rs};

 