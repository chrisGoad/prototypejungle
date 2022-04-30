
const rs = function (rs) {

/* theory of operation. 
The DROP algoritm drops line segments or circles at random positions on the canvas. If a given segment or circle lands on top of another, it is thrown away. The parameter maxTries sets how many unsuccessful drops are tolerated before the algorithm is terminated.  This is the simple drop mode. 
In fromEnds mode, segments are dropped in such a way as to continue an already existing tree. In this mode, illustrated by the dandelion, the current state consists of a tree of segments. Each segment in the tree is either interior, meaning that its end1 has been continued by one or more segments, or terminal, meaning that there is no continuing segment emerging from its end1. The end1 of such a segment is held in the array this.ends. 
*/
//core.require(function () {
//addBasicMethods(rs);
//addRandomMethods(rs);
let defaults = {dropTries:5,maxLoops:Infinity};//,maxTriesPerEnd:20};
//defaults = {maxDrops:1000,maxTries:5,maxLoops:1000};

Object.assign(rs,defaults);
/*adjustable parameters  */
//let topParams = 	{width:100,height:100,maxDrops:10,maxTries:5,maxLoops:100000,lineLength:10,backgroundColor:undefined,minSeparation:5,endLoops:20000,fromEnds:1,	onlyFromSeeds:0}

//Object.assign(rs,topParams);

/* end */

/*for shapes */


      
rs.collides0 = function (point1,radius1,point2,radius2) {
  let {minSeparation=0} = this;
  let p1x = point1.x;
  let p1y = point1.y;
  let p2x = point2.x;
  let p2y = point2.y;
  let minDist =  radius1 + radius2 + minSeparation;
  if (Math.abs(p2x - p1x) >=  minDist) {return false;}
  if (Math.abs(p2y - p1y) >= minDist) {return false;}
  let d = point1.distance(point2);
  return minDist >= d;
}



rs.collides = function (point,radius,points,radii) {
 // initializer(this);
  let n = points.length;
  for (let i=0;i<n;i++) {
    if (this.collides0(point,radius,points[i],radii[i])) {
      return true;
    }
  }
  return false
}




rs.genRandomPoint = function (rect) {
	//debugger;
  if (rect) {
    let {corner,extent} = rect;
    let lx = corner.x;
    let ly = corner.y;
    let x = Math.random() * extent.x + lx;
    let y = Math.random() * extent.y + ly;
    return Point.mk(x,y);
  }
  let {width,height} = this;
  let rx = (Math.random()-0.5) * width;
   let ry= (Math.random()-0.5) * height;
  return Point.mk(rx,ry);
}




 
rs.via3d = function (p) {
	if (this.genPoint3d) {
		let p3d = this.genPoint3d(p);
		let rs = this.camera.project(p3d);
		return rs;
	}
  return p;
}
	






rs.generateDrop = function (radius) {
	let {maxLoops,dropTries} = this;
  debugger;
//	let points = this.set('points',core.ArrayNode.mk()); 
//	let radii = this.set('radii',core.ArrayNode.mk());
	let cnt =0;
  let tries = 0;
  let points = [];
  let radii = [];
	while (cnt < maxLoops) {
		let pnt = this.genRandomPoint();
    if (this.radiusGenerator) {
      radius = this.radiusGenerator(pnt);
    }
		let cl = this.collides(pnt,radius,points,radii);
		if (cl) {
			tries++;
			if (tries >= dropTries) {
				break;
			}

    } else {
			points.push(pnt);
			radii.push(radius);
			tries = 0;
    }
	}
  return {radii,points};
}
}


export {rs};			
		
  	
      
