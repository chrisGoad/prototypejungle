
import {rs as rectP} from '/shape/rectangle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addGridMethods} from '/mlib/grid.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';

let rs = basicsP.instantiate();
addGridMethods(rs);
addRandomMethods(rs);
addRandomMethods(rs);
rs.setName('grid_grid_2');

let innerGridP = basicsP.instantiate();
addGridMethods(innerGridP);
innerGridP.genCount = 0;
innerGridP.innerWhich = [];
let wd = 400;
let nr = 20;
let inr = 3;
let fc = 0.95;;
 let ofc = 1;

let inrinrwd = (wd/(nr*inr));
let saveState = 1;
let topParams = {width:wd,height:1*wd,numRows:nr,numCols:nr,pointJiggle:0,innerRows:inr};
Object.assign(rs,topParams);

let rectP1 = rectP.instantiate();
rectP1.width = fc*inrinrwd;
rectP1.height = fc*inrinrwd;
rectP1.fill = 'rgb(250,250,250)';
rectP1['stroke-width'] =0;
let rectP2 = rectP.instantiate();
rectP2.width = fc*inrinrwd;
rectP2.height = fc*inrinrwd;
rectP2.fill = 'rgb(10,10,100)';
rectP2['stroke-width'] =0;
//rs.innerWhich = [];
innerGridP.shapeGenerator = function () {
  
  let {genCount,innerWhich} = this;
  let which;
  if (saveState) {
    which = Math.random() < 0.2;
    innerWhich.push(which?1:0);
    //this.within.innerWhich.push(which?1:0);
  }  else {
    //which = this.within.innerWhich[genCount];
    which = innerWhich[genCount];
    this.genCount = genCount+1;
  }
  let rect = which?rectP2:rectP1;
  return rect.instantiate().show();
}


rs.genEltDescription = function (n) {
  // let {innerRows,deltaX,rectP1,rectP2,innerPresent1,innerPresent2,saveState,whichElts,whichShape1,whichShape2} = this;
   let {innerRows,deltaX,rectP1,rectP2,eltDState1,eltDState2,saveState} = this;
   let eltDState = n===1?eltDState1:eltDState2;
   let innerShapePs = [];// arrayShape.mk();
   let positions = this.genInnerGridPositions();
   let innerPresent = saveState?[]:eltDState[1];
   let whichShape;   
   if (saveState) {
     whichShape =  Math.random() < 0.5?1:2;
   } else {
     whichShape = eltDState[0];
   }
   let rectP = (whichShape === 1)?rectP1:rectP2;
   for (let i=0;i<innerRows;i++) {
     for (let j=0;j<innerRows;j++) {
         let present = saveState?(Math.random() < 0.7):innerPresent[i*innerRows + j];
         let ip =present?rectP:null;
         innerPresent.push(present?1:0);
         innerShapePs.push(ip);;
     }
   }
   return {shapePs:innerShapePs,positions:positions,eltDState:[whichShape,innerPresent]}
 }
rs.genInnerGrid = function (iw) {
   let {innerRows,numRows,numCols,width,rectP1,rectP2} = this;
   let rs = innerGridP.instantiate();
   if (saveState) {
     rs.innerWhich = [];
   } else {
     rs.innerWhich = iw;
   }
   rs.within = this;
   let innerWidth = ofc*width/numRows;
   rs.width = innerWidth;
   rs.height = innerWidth;
   rs.numRows = innerRows;
   rs.numCols = innerRows;
   rs.generateGrid();
   return rs;
 }


rs.decider = function (rvs,cell) {
  let {numRows} = this;
  let hnr =numRows/2;
  let {x,y} = cell;
  let fr = Math.abs(x-hnr)/hnr;
  return Math.random() < fr;
  return Math.random() < 0.5;
}


rs.shapeGenerator = function (rvs,cell) {
	let {innerGrid1,innerGrid2,whichInners,genCount} = this;
  let which;
  debugger;
  if (saveState) {
    which  = this.decider(rvs,cell);
    whichInners.push(which?1:0);
  } else {
    which = whichInners[genCount];
    this.genCount = genCount+1;
  }
  return which?innerGrid1.instantiate():innerGrid2.instantiate();
}


rs.computeState  = function () {
debugger;
   return [["whichInners",this.whichInners],["innerWhich1",this.innerGrid1.innerWhich],["innerWhich2",this.innerGrid2.innerWhich]];
}



rs.initialize = function () {
  debugger;
  if (this.initializeInstance) {
    this.initializeInstance();
  }
  /*if (saveState) {
   this.innerWhich = [];
  } else {
    this.innerWhich = this.innerWhich1;
  }*/
 
  if (saveState) {
    this.innerWhich = [];
    rs.whichInners = [];
    this.innerGrid1 = rs.genInnerGrid();
    this.innerGrid2 = rs.genInnerGrid();
    this.generateGrid();
    this.saveTheState();
  } else {
    this.getTheState(() => {
      debugger;
      this.innerGrid1 = rs.genInnerGrid(this.innerWhich1);
      this.innerGrid2 = rs.genInnerGrid(this.innerWhich2);
      this.genCount = 0;
      this.generateGrid();
    });
  }
}

export {rs};

 