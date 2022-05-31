// documented in https://prototypejungle.net/doc/boundedRandomGrids.html

const rs = function (item) {	

item.randomStep = function (x,y,step,min,max,i,j) {
  let oneWay = 0;
  let lb,ub,rs;
  let sumSteps,sumVals,tlb,tub;
  if (y !==  undefined) { // 2d case  
    sumSteps = 2*step;
    sumVals = x+y;
    ub = 0.5 * (sumVals+sumSteps);
    lb = 0.5 * (sumVals-sumSteps);    
  } else {
    if (1) {
      ub = x + step;
      lb = x - step;
    } 
  }
  if (min > ub) {  //just march towards this target
    rs = ub;
  } else if (max < lb) {
    rs = lb;
  } else {
    ub = Math.min(ub,max);
    lb = Math.max(lb,min);
    rs =  lb + Math.random() * (ub - lb);
  }
  return rs;
}

item.scalarRandomStep = function (c,step,min,max,i,j) {
  return this.randomStep(c,undefined,step,min,max,i,j);
}

item.dim2randomStep = function (x, y, step,min,max,i,j) { 
  return this.randomStep(x,y,step,min,max,i,j);
}

item.indexFor = function (numRows,i,j) {
  let idx = (this.backwards)?numRows*(numRows - i - 1) + j:i*numRows+j;
  return idx;
}

item.valueAt = function (grid,i,j) {
  let {params,values,numRows,numCols} = grid;
  let idx = this.indexFor(numRows,i,j);
  let rv =  grid.values[idx];//new 4/26/22
  return rv;
 
}
      
item.genRandomGrid = function (numCols,numRows,iparams) {
  let inr = numRows;
  let inc = numCols;
  let isfun = typeof iparams === 'function';
  let step,min,max;
  let stept = 0;
  let oneWay = 0;
  const computeParams = function(i,j) {
    let theParams = isfun?iparams(i,j):iparams;
    min = theParams.min;
    max = theParams.max;
    step = theParams.step;
  }
  computeParams(0,0);  
  let values = [];
  let rs = {values,numRows,numCols,iparams};
  let n = numCols * numRows;
  values.length = n;
  let i = 0;
  let j = 0;
  let pv;
  while (i < numCols) {
    let goingUp = i%2 === 0; //means  j is going up
    j = goingUp?0:numRows-1;
    let firstJ = true;
    while (goingUp?j < numRows: j>=0) {
      if (isfun) {
        computeParams(i,j);
      }
      let idx = this.indexFor(numRows,i,j);
      if ((i === 0) && (j === 0)) {
        let lb,ub,tlb,tub;
        lb = min;
        ub = max;
        let vl =  lb  +Math.random() * (ub - lb);
      //  console.log('i',i,'j',j,'min ',min,' max ',max,' tlb ',tlb,' tub ', tub,' lb ',lb,' ub ', ub,' vl ',vl);
        values[idx] = vl;
        j++;
        continue;
      }
      let c;
      if (i === 0) {
        c = this.scalarRandomStep(values[j-1],step,min,max,i,j);
      } else if (firstJ){
        let lftidx = this.indexFor(numRows,i-1,goingUp?0:numRows-1);
        c = this.scalarRandomStep(values[lftidx],step,min,max,i,j);       
      } else {
        let lftidx = this.indexFor(numRows,i-1,j)
        let upidx = this.indexFor(numRows,i,goingUp?j-1:j+1)
        c = this.dim2randomStep(values[lftidx],values[upidx],step,min,max,i,j);
      }
      values[idx] = c;
      j = goingUp?j+1:j-1;
      firstJ = false;
      }
    i++;
  }
  return rs;
}

item.initRandomizer = function () {
  let rm = this.randomizer;
  if (!rm) {
    rm = this.randomizer = {};
    if (!this.randomGridsForShapes) {
      this.randomGridsForShapes = {};
    }
    if (!this.randomGridsForBoundaries) {
      this.randomGridsForBoundaries = {};
    }
  }
  return rm;
}

item.setupRandomGrid = function (tp,nm,params) {
  let numRows = tp === 'randomGridsForBoundaries'?this.numRows+1:this.numRows;
  let numCols = tp === 'randomGridsForBoundaries'?this.numCols+1:this.numCols;
  let rm = this.initRandomizer();
  let rnds = this[tp];
  let rs  = this.genRandomGrid(numCols,numRows,params);
  rnds[nm]  = rs;
  return rs;
}

item.setupRandomGridForShapes = function (nm,params) {
  return this.setupRandomGrid('randomGridsForShapes',nm,params);
}

item.setupRandomGridForBoundaries = function (nm,params) {
  return this.setupRandomGrid('randomGridsForBoundaries',nm,params);
}            

item.setupColorGridsForShapes = function (params) {
  this.setupRandomGridForShapes('r',params);
  this.setupRandomGridForShapes('g',params);
  this.setupRandomGridForShapes('b',params);
}
 
item.randomValueAtCell = function (randomGrids,prop,i,j) {
  if (!randomGrids) {
    return;
  }
  let randomValues  = randomGrids[prop];
  if (!randomValues) {
    return;
  }
  let {randomizer} = this;  
  let rs = this.valueAt(randomValues,i,j);
  return rs;
}
    
item.randomValuesAtCell = function (randomGrids,i,j) {
  if (!randomGrids) {
    return;
  }
  let randomizer = this.initRandomizer();
  let rs = {}; 
  for (let prop in randomGrids) {
    let randomValues = randomGrids[prop];
    if ((prop !== 'interpolateTo') && (prop !== 'interpolateFrom') && (prop !== 'nowInterpolating')) {
      rs[prop] = this.valueAt(randomValues,i,j);
    }
  }
  return rs;
}

item.rvsAtCell = function (cell) {
  return this.randomValuesAtCell(this.randomGridsForShapes,cell.x,cell.y);
}   
}

export {rs};


