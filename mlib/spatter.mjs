
//active
//core.require('/shape/rectangle.js',function (rectPP) {
//core.require('/shape/rectangle.js','/gen0/basics.js','/gen0/boundeddRandomGrids.js','/gen0/animation.js',function (rectPP,addBasicMethods,addboundeddRandomGrids,addAnimationMethods) {
//core.require('/shape/rectangle.js','/gen0/dim2dWalker.js','/gen0/animation.js',function (rectPP,addRandomMethods,addAnimationMethods) {
//core.require('/gen0/test.js',function (addRandomMethods) {
	//debugger;
let rs = function (item) {
  
item.numRows= 31;
item.numRows = 11;
item.numCols = 11;
item.width = 100;
item.height = 100;
//item.deltaX = 5;
//item.deltaY = 2;
//item.bowRadius = 0;
//item.bowYcenter = 50;
/*item.includeWindow= false;
item.theWindow = core.ObjectNode.mk();
item.theWindow.minx = 3;
item.theWindow.maxx = 6;
item.theWindow.miny = 3;
item.theWindow.maxy = 6;
*/
//item.visChance = 1; // for the boundary
//item.includeWindow =false;
//item.includeShapes = false;
//item.includeCellBoundaries = true;
//item.boundaryLineFraction = 1;
//item.fadeIn = false;
item.ywander = 0;
item.pathLength = 10;
item.requireFullPathLength = true;
item.occupiedCount = 0;
item.pointJiggle = 0;
item.chanceAshapeIsVisible = 1;
//item.chanceShape2IsVisible = 0.5;
item.randomizeWhichColors = 'both';
item.lineShapeLength = 0;
item.bendCircleRadius = 0;
item.bendCircleY = 150;

item.shapeGenerationFunction = undefined;
item.includeLetters = 0;
item.letterWidth = 4;
item.letterHeight = 4;
item.fractionInked = 0.4;
/* three prototypes are expected to be available: blineP (for boundary lines), rlineP (for region lines), and shapeP (unless a shape generation function is specified */

/*
item.initBackgroundProtos = function () {
	core.assignPrototypes(this,'backgroundRectP',rectPP);
	this.backgroundRectP['stroke-width'] = 0;
}
	*/

item.genRandomPoint = function (rect) {
    let {corner,extent} = rect;
    let {numRows,numCols} = this;
    let {x:cx,y:cy} = corner;
    let {x:xx,y:xy} = extent;
    let rx = Math.random();
    let ry = Math.random();
    let x  = cx +   rx*xx;
    let y  = cy +   ry*xy;
    let cellX = Math.floor(rx*numCols);
    let cellY = Math.floor(ry*numRows);
    return [Point.mk(cellX,cellY),Point.mk(x,y)];
}

item.addAtPoint = function (cell,pnt,idx) {
  let {shapes,randomizer,sizes,spatterGenerator,randomGridsForShapes} = this;
  //let rvs = this.randomValuesAtCell(randomGridsForShapes,cell.x,cell.y);
  let rvs = (this.randomValuesAtCell)?this.randomValuesAtCell(randomGridsForShapes,cell.x,cell.y):{};
  //let shape = this.spatterGenerator(rvs,cell,pnt);
  let shape = this.shapeGenerator(rvs,cell,pnt,idx);
	let srect;
	if (shape) {
		if (this.spatterRect) {
		  //srect = this.spatterRect(cell,pnt);
			let {end0,end1} = shape;
			let nend0 = end0.plus(pnt);
			let nend1 = end1.plus(pnt);
			shape.setEnds(nend0,nend1);
	  } else if (!this.generatorsDoMoves) {
		  shape.moveto(pnt);
			shape.cell = cell
		}
		shape.show();
    shapes.push(shape);
		return shape;
	}
}

item.genRect = function () {
	let {width,height} = this;
	let corner = Point.mk(-0.5*width,-0.5*height);
  let extent = Point.mk(width,height);
  let rect = geom.Rectangle.mk(corner,extent);
	return rect;
}
	
item.genSpatterPoints = function () {
	let {numDrops} = this;
  let rect = this.genRect();
	if (this.spatterPoints) {
		return;
	}
	let pnts = this.spatterPoints = [];
	for (let i=0;i<numDrops;i++) {
		pnts.push(this.genRandomPoint(rect));
	}
}
	
item.addAtRandomPoint = function (rect) {
  let {shapes,randomizer,sizes,spatterGenerator,randomGridsForShapes} = this;
  let rnd = this.genRandomPoint(rect);
  let cell = rnd[0];
  let pnt = rnd[1];
	let shape = this.addAtPoint(cell,pnt);
	return shape;
}


item.addSpatter = function () { 
		let {numDrops,width,height,shapes} = this;
    if (!shapes) {
			this.set('shapes',core.ArrayNode.mk()); 
		}

		if (this.saveSpatterPoints) {
		  this.genSpatterPoints();
			for (let i=0;i<numDrops;i++) {
				let rpnt = this.spatterPoints[i];
				let [cell,pnt] = rpnt;
				this.addAtPoint(cell,pnt,i);
			}
		} else {
			let rect = this.genRect();
			let count = 0;
			while (count<numDrops) {
				 let shp = this.addAtRandomPoint(rect);
				 if (shp) {
					 if (this.shapeUpdater) {
						 this.updateAtRandomPoint(shp);
					 }
					 count++;
				 }
			}
		}
}
}

export {rs};

      

