// a quad tree node has the form {rectangle,UL:quadNode,UR:quadNode,LL:quadNode,QLR
const rs =function (rs) {

//topLevel = {levels:4,chance:0.75};
rs.extendQuadOneLevel = function (qd) {
 //  debugger;
   if (!qd) {
     return;
   }
   if (qd.top) {
     return;
   }
   let upsideDown = qd.upsideDown;
   let rect = qd.rectangle;
   let {corner,extent} = rect;
   let {x:cx,y:cy} = corner;
   let hxt = extent.times(0.5);
   let {x:ex,y:ey} = hxt;
   if (upsideDown) {
     let centerCorner = corner.plus(Point.mk(0.5*ex,0));
     let bottomCorner = corner.plus(Point.mk(0.5*ex,ey));
     let leftCorner = corner;
     let rightCorner = corner.plus(Point.mk(ex,0));
     qd.bottom = {rectangle:Rectangle.mk(bottomCorner.copy(),hxt.copy()),upsideDown:1};
     qd.left = {rectangle:Rectangle.mk(leftCorner.copy(),hxt.copy()),upsideDown:1};
     qd.right = {rectangle:Rectangle.mk(rightCorner.copy(),hxt.copy()),upsideDown:1};
     qd.center = {rectangle:Rectangle.mk(centerCorner.copy(),hxt.copy()),upsideDown:0};
   } else {
     let topCorner = corner.plus(Point.mk(0.5*ex,0));
     let leftCorner = corner.plus(Point.mk(0,ey));
     let rightCorner = corner.plus(hxt);
     let centerCorner = corner.plus(Point.mk(0.5*ex,ey));
     qd.top = {rectangle:Rectangle.mk(topCorner.copy(),hxt.copy()),upsideDown:0};
     qd.left = {rectangle:Rectangle.mk(leftCorner.copy(),hxt.copy()),upsideDown:0};
     qd.right = {rectangle:Rectangle.mk(rightCorner.copy(),hxt.copy()),upsideDown:0};
     qd.center = {rectangle:Rectangle.mk(centerCorner.copy(),hxt.copy()),upsideDown:1};
   }
 }
   
 
 
rs.extendQuadNLevels = function (qd,params,i=0) {
  // debugger;
  if (!qd) {
    return;
   }
   let {levels,chance} = params;
   if ((Math.random()>chance)&&(i>=3)) {
     return;
   }
   this.extendQuadOneLevel(qd);
   if ((i+1) >= levels) {
     return;
   }
   this.extendQuadNLevels(qd.top,params,i+1);
   this.extendQuadNLevels(qd.bottom,params,i+1);
   this.extendQuadNLevels(qd.center,params,i+1);
   this.extendQuadNLevels(qd.left,params,i+1);
   this.extendQuadNLevels(qd.right,params,i+1);
 }
 
 rs.rectangleToShape  = function (r,polygonP,upsideDown,depth) {
   let {shapes,levels}= this;
   if (!shapes) {
     shapes = this.set('shapes',arrayShape.mk());
   }
   /*if (shapes.length >= 7000) {
     return;
   }*/
   let lastLevel;// = depth===levels;
   let {extent,corner} = r;
   let corners;
   let {x:ex,y:ey} = extent;
   if (upsideDown) {
     let bottom = corner.plus(Point.mk(0.5*ex,ey));;
     let left = corner;
     let right = corner.plus(Point.mk(ex,0));
     corners = [left,right,bottom,left];
   } else {
     let top = corner.plus(Point.mk(0.5*ex,0));;
     let left = corner.plus(Point.mk(0,ey));
     let right = corner.plus(extent);
     corners = [top,right,left,top];
   }
   let shape = polygonP.instantiate(); 
   shape.corners = corners;
   
   const shade = ()=> Math.floor(255*Math.random());
   let v = shade();
  //let clr = lastLevel?'blue':`rgb(0,0,${v})`;
  let clr = lastLevel?'white':`rgb(${v},${v},${v})`;
   //let clr = 'blue';
   shape.fill = clr;
   if (lastLevel) {
     shape.stroke = 'black';
   }
   //let fc = 0.8;
   //shape.width = fc*extent.x;
   //shape.height = fc*extent.y;
   this.shapes.push(shape);
   //shape.moveto(c);
   shape.update();
 }
   
   
 rs.displayQuad = function (qd,polygonP,depth=0) {
   let {shapes} = this;
   if (!qd) {
     return;
   }
   let {upsideDown} = qd;
   if (qd.left) {
     this.displayQuad(qd.top,polygonP,upsideDown,depth+1);
     this.displayQuad(qd.bottom,polygonP,upsideDown,depth+1);
     this.displayQuad(qd.left,polygonP,upsideDown,depth+1);
     this.displayQuad(qd.right,polygonP,upsideDown,depth+1);
     this.displayQuad(qd.center,polygonP,!upsideDown,depth+1);
     return;
   }
   this.rectangleToShape(qd.rectangle,polygonP,depth);
}
}

export {rs};	
