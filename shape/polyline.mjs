//polyline


let rs =  svg.Element.mk('<polyline/>');
rs.shape_name = 'polyline';

rs.stroke = "black";
rs['stroke-width'] = 1;
rs.role = 'spot';
rs.points = [];

rs.update = function () {
	let {wayPoints} = this;
  wayPoints.forEach((p) => {
    if (isNaN(p.x) || isNaN(p.y)) {
       debugger;
    }
  });
	let ln = wayPoints.length;
	if (!ln) {
		return;
	}
  let p2str = function (point,after) {
    return point.x+','+point.y+after;
  };
	let path = '';
	for (let i=0;i<ln;i++) {
		let point = wayPoints[i];
		let pstr = p2str(point,i===(ln-1)?'':' ');
		path += pstr;
	}
  this.points = path;
}

export {rs};


