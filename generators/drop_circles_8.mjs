
import {rs} from '/generators/drop_circles_4.mjs';
rs.setName('drop_circles_4_1');


rs.generateDrop= function (p) {
  let {height:ht} = this;
  let rd;
  let rc0= Point.mk(-300,0);
  let rc1= Point.mk(300,0);
  let d = p.length();
  if (d>500) {
    return;
  }
 // if (d < 100) {
  //  rd =2;
  let fc = 0.01;
  let mn = 2;
  debugger;
  const radius_of = (rn) => (rn%2 === 0)?mn+(rn+2)*fc*((ht-200*rn)/2-p.x):mn+(rn+2)*fc*(p.x + (ht-200*rn)/2);
  let irn = Math.floor(d/100); // ring number with 0 as innermost
  let orn = 4 - irn;  // ring number with 0 as outermost
  rd = radius_of(orn);
  rd = Math.max(4,rd);
  return {radius:rd};
}


  

export {rs};


