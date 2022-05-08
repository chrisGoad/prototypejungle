// a quad tree node has the form {rectangle,UL:quadNode,UR:quadNode,LL:quadNode,QLR
const rs =function (rs) {

//topLevel = {levels:4,chance:0.75};
rs.extendQuadOneLevel = function (qd) {
 //  debugger;
   if (qd.UL) {
     return;
   }
   let rect = qd.rectangle;
   let {corner,extent} = rect;
   let {x:cx,y:cy} = corner;
   let hxt = extent.times(0.5);
   let {x:ex,y:ey} = hxt;
   qd.UL = {rectangle:Rectangle.mk(corner.copy(),hxt)};
   qd.UR = {rectangle:Rectangle.mk(Point.mk(cx+ex,cy),hxt.copy())};
   qd.LL = {rectangle:Rectangle.mk(Point.mk(cx,cy+ey),hxt.copy())};
   qd.LR = {rectangle:Rectangle.mk(Point.mk(cx+ex,cy+ey),hxt.copy())};
 }
 
 
rs.extendQuadNLevels = function (qd,params,i=0) {
   let {levels,chance} = params;
   if ((Math.random()>chance)&&(i>=3)) {
     return;
   }
   this.extendQuadOneLevel(qd);
   if ((i+1) >= levels) {
     return;
   }
   this.extendQuadNLevels(qd.UL,params,i+1);
   this.extendQuadNLevels(qd.UR,params,i+1);
   this.extendQuadNLevels(qd.LL,params,i+1);
   this.extendQuadNLevels(qd.LR,params,i+1);
 }
 
 rs.rectangleToShape  = function (r,rectP) {
   let shapes = this.shapes;
   if (!shapes) {
     shapes = this.set('shapes',arrayShape.mk());
   }
   let {extent} = r;
   let c = r.center();
   let shape = rectP.instantiate();g 
   const shade = ()=> Math.floor(255*Math.random());
   let v = shade();
   //let clr = `rgb(${shade()},${shade()},${shade()})`;
 //  let clr = `rgb(${v},${v},${v})`;
   let clr = `rgb(${v},0,${v})`;
  // let clr = `rgb(0,0,${v})`;
   shape.fill = clr;
   let fc = 0.8;
   shape.width = fc*extent.x;
   shape.height = fc*extent.y;
   this.shapes.push(shape);
   shape.moveto(c);
 }
   
   
 rs.displayQuad = function (qd,rectP) {
   let {shapes} = this;
   if (qd.UL) {
     this.displayQuad(qd.UL,rectP);
     this.displayQuad(qd.UR,rectP);
     this.displayQuad(qd.LL,rectP);
     this.displayQuad(qd.LR,rectP);
     return;
   }
   this.rectangleToShape(qd.rectangle,rectP);
}
}

export {rs};	
