// a quad tree node has the form {rectangle,UL:quadNode,UR:quadNode,LL:quadNode,QLR
const rs =function (rs) {

rs.extendQuadOneLevel = function (qd) {
   if (qd.UL) {
     return;
   }
   let where = qd.where;
   let root = qd.root;
   let rect = qd.rectangle;
   let {corner,extent} = rect;
   let {x:cx,y:cy} = corner;
   let hxt = extent.times(0.5);
   let {x:ex,y:ey} = hxt;
   const nextQuad = (nm,corner,extent) => {
     let rect = Rectangle.mk(corner,hxt.copy());
     qd[nm] = {rectangle:rect,where:[...where,nm],root};
   }
   
   nextQuad('UL',corner.copy());
   nextQuad('UR',Point.mk(cx+ex,cy));
   nextQuad('LL',Point.mk(cx,cy+ey));
   nextQuad('LR',Point.mk(cx+ex,cy+ey));
   return;
    qd.UL = {rectangle:Rectangle.mk(corner.copy(),hxt),where:[...where,'UL']};
   qd.UR = {rectangle:Rectangle.mk(Point.mk(cx+ex,cy),hxt.copy()),where:[...where,'UR']};
   qd.LL = {rectangle:Rectangle.mk(Point.mk(cx,cy+ey),hxt.copy()),where:[...where,'LL']};
   qd.LR = {rectangle:Rectangle.mk(Point.mk(cx+ex,cy+ey),hxt.copy()),where:[...where,'LR']};
 }
 
 
 
rs.randomSplit = function (qd,ichance) {
  let params = qd.root.params;
  let {chance,alwaysSplitBefore,levels} = params;
  if (!chance) {
    chance = ichance;
  }
  let d = qd.where.length;
  return (d<levels) && ((Math.random()<chance) || (d<alwaysSplitBefore));
}

rs.splitHere = function (qd) {
  return this.randomSplit(qd);
}
  
rs.extendQuadNLevels = function (qd,params) {
  debugger;
   let {shapes,numRows,randomGridsForShapes} = this;
   let {where} = qd;
   if (!shapes) {
     shapes = this.set('shapes',arrayShape.mk());
   }
   if (!where) {
     where = qd.where = [];
     qd.root = qd;
     qd.params = params;
   }
  // let params = qd.root.params;
 //  let {levels,chance,startSplit=3} = params;

 //  if (i===0){
  //   qd.where = [];
 //  }
    let rect = qd.rectangle;
    let pnt = rect.center();
    let rvs;
    if (numRows && randomGridsForShapes) {
      let cell = this.cellOf(pnt);
      rvs = this.randomValuesAtCell(randomGridsForShapes,cell.x,cell.y);
    }
   let split = this.splitHere(qd,rvs);
   if (!split) {
     return;
   }
   this.extendQuadOneLevel(qd);
 //  if ((i+1) >= levels) {
 //    return;
 //  }
   this.extendQuadNLevels(qd.UL);//,i+1);
   this.extendQuadNLevels(qd.UR);//,i+1);
   this.extendQuadNLevels(qd.LL);//,i+1);
   this.extendQuadNLevels(qd.LR);//,i+1);
 }
 /*
 rs.rectangleToRectangle  = function (r,depth) {
   let {shapes,levels}= this;
   if (!shapes) {
     shapes = this.set('shapes',arrayShape.mk());
   }
   let {extent} = r;
   let c = r.center();
   let shape = this.rectP.instantiate();g 
   const shade = ()=> Math.floor(255*Math.random());
   let fill = this.computeFill(depth);
   shape.fill = fill;
   let fc = 0.8;
   shape.width = fc*extent.x;
   shape.height = fc*extent.y;
   this.shapes.push(shape);
   shape.moveto(c);
 }
 
 rs.rectangleToShape  = function (r,polygonP,depth) {
   let {shapes,levels}= this;
   if (!shapes) {
     shapes = this.set('shapes',arrayShape.mk());
   }
   let lastLevel;// = depth===levels;
   let {extent,corner} = r;
   let c = r.center();
   let corners;
   let {x:ex,y:ey} = extent;
   let top = corner.plus(Point.mk(0.5*ex,0));;
   let left = corner.plus(Point.mk(0,ey));
   let right = corner.plus(extent);
   corners = [top,right,left,top];
   let shape = polygonP.instantiate(); 
   let fill = this.computeFill();
   shape.corners = corners;
   shape.fill = fill;
   if (lastLevel) {
     shape.stroke = 'black';
   }
   this.shapes.push(shape);
   shape.moveto(c);
   shape.update();
 }


 rs.rectangleToCircle  = function (r,depth) {
   let {shapes,levels}= this;
   if (!shapes) {
     shapes = this.set('shapes',arrayShape.mk());
   }
   let lastLevel;// = depth===levels;
   let c = r.center();
   let {extent,corner} = r;
   let {x:ex,y:ey} = extent;
   let shape = this.circleP.instantiate(); 
   shape.dimension = 0.7*ex;
   let fill = this.computeFill();
   shape.fill = fill;
   this.shapes.push(shape);
   shape.moveto(c);
   shape.update();
 }   
   
rs.rectangleToShape  = function (r,depth) {
  if (this.chooseCircle(r,depth)) {
   this.rectangleToCircle(r,depth);
  } else {
   this.rectangleToRectangle(r,depth);
  }
}

 rs.displayCell = function (qd,depth) {
   this.rectangleToCircle(qd.rectangle,depth);
 }
 */
 
 rs.displayQuad = function (qd,depth=0) {
   let {shapes} = this;
   if (qd.UL) {
     this.displayQuad(qd.UL,depth+1);
     this.displayQuad(qd.UR,depth+1);
     this.displayQuad(qd.LL,depth+1);
     this.displayQuad(qd.LR,depth+1);
     return;
   }
   this.displayCell(qd,depth);
   //this.rectangleToShape(qd.rectangle,depth);
}
}

export {rs};	
