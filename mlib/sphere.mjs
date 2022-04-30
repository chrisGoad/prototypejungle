const rs = function (rs) {

rs.genSegmentss = function (p) {
	//debugger;
	//console.log('px',p.x);
	rd = 20;
	//rd = 200;
	let gcrc = geom.Circle.mk(p,rd);
	let scrc = this.circleP.instantiate();
	scrc.dimension = 2*rd;
	//scrc.show();
	//scrc.fill = 'red';
	//scrc.moveto(p);
	return [gcrc,scrc];
}
 
 
//rs.toPoint3d = function (p) {
rs.genPoint3d = function (p) {
	let {sphereCenter,sphereDiameter} = this;
	if (!p.to3d) {
	  debugger;
	}
	let p3d = p.to3d();
	let d = p3d.distance(sphereCenter);
  if (d < sphereDiameter) {
		//debugger;
		let v = p3d.difference(sphereCenter).normalize();
	  let sp = v.times(sphereDiameter).plus(sphereCenter);
		return sp;
	}  else {
		p3d.category = 'notOnSurface';
    return p3d;
	}
	//return undefined;
	
}


return rs;

 }
 
 export {rs};

