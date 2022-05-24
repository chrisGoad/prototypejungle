


const test0 = function () {

let e00 = Point.mk(-1,-1);
let e01 = Point.mk(1,1);
let e10 = Point.mk(1,-1);
let e11 = Point.mk(-1,1);
let seg0 = LineSegment.mk(e00,e01);
let seg1 = LineSegment.mk(e10,e11);
debugger;
let i = seg0.intersects(seg1);
}

test0();