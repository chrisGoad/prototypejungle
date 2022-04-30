
//core.require('/gen0/drop0.js',function () {

const rs = function (rs) {

//core.require(function () {
 //return function (rs) {
rs.computeWhichByCornerInterpolation = function (p) {
  let {width,height} = this;
  let frw = (p.x+0.5*width)/width; 
  let frh = (p.y+0.5 * height)/height;  
  let likelyhood0 = (1-frw)*(1-frh);
  let likelyhood1 = frw*(1-frh);
  let likelyhood2 = frw*frh;
  let likelyhood3 = (1-frw)*frh;
  let fd0 = likelyhood0;
  let fd1 = fd0 + likelyhood1;
  let fd2 = fd1 + likelyhood2;
  let total = fd2 + likelyhood3;
  let rn = Math.random();
  let which;
  if (rn < fd0/total) {
    which = 0;
  } else if (rn < fd1/total) {
    which = 1;
  } else if (rn < fd2/total) {
    which = 2;
  } else {
    which = 3;
  }
  return which;
}

rs.computeWhichByCenterInterpolation = function (p) {
  let {width,height} = this;
  let dw = (p.x)/width; 
  let dh = (p.y)/height;  
 // let d = Math.abs(dw) + Math.abs(dh);// boxcar dist from center
  let d = 2*Math.max(Math.abs(dw),Math.abs(dh));// boxcar dist from center
  let mrg = 0.3;
  if (d>(1-mrg)) {
    d=1;
  } else if (d<mrg) {
    d=0;
  }
  let d2 = d*d;
 // console.log('d ',d);

  let rn = Math.random();
  let which = (rn < d)?1:0; //1 outside, 0 center
  
  return which;
}

rs.computeColorByInterpolation = function (p,c0,c1,c2,c3) {
  let {width,height} = this;
  let frw = (p.x+0.5*width)/width; 
  let frh = (p.y+0.5 * height)/height; 
  let wt0 = 1 - Math.max(frw,frh);
  let wt1 = 1 - Math.max(1-frw,frh);
  let wt2 = 1 - Math.max(1-frw,1-frh);
  let wt3 = 1 - Math.max(frw,1-frh);
  let totalw = wt0+wt1+wt2+wt3;
  const weightedAvg = function (v0,v1,v2,v3) {
    return (wt0*v0+wt1*v1+wt2*v2+wt3*v3)/totalw;
  }
  let rgb0 = [250,0,0];
  let rgb2 = [0,0,250];
  let rgb1 = [250,250,250];
  let rgb3 = rgb1;
  let r = weightedAvg(c0[0],c1[0],c2[0],c3[0]);
  let g = weightedAvg(c0[1],c1[1],c2[1],c3[1]);
  let b = weightedAvg(c0[2],c1[2],c2[2],c3[2]);
  let clr = `rgb(${r},${g},${b})`;
  return clr;
}
}

export {rs};


