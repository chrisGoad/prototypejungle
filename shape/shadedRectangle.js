

// This is the simplest shape with a custom control, or "handle".
// Click on the rectangle and drag the handle to see it in action.

core.require(function () {

let item = svg.Element.mk('<g/>');

/* adjustable parameters */
item.width = 50;
item.height = 35;
item.cornerRadiusFraction = 0;
item.stroke = 'black';
item['stroke-width'] = 0;
item.leftFill = 'black';
item.rightFill = 'white';
/*end  adjustable parameters */


item.outerFill = 'rgb(100,100,240)';
item.fill = 'transparent';
item.resizable = true;
item.role = 'vertex';

let  gradient = svg.Element.mk('<linearGradient/>');
let stop1,stop2,stop3;
gradient.gradientTransform = "rotate(90)";
gradient.set('stop0',svg.Element.mk('<stop offset="0%" stop-opacity="1" />'));
gradient.set('stop1',svg.Element.mk('<stop offset="100%" stop-opacity="1" />'));

let defs = svg.Element.mk('<defs/>');
item.set('defs',defs);
item.defs.set('gradient',gradient);//

item.set("__contents",svg.Element.mk('<rect/>'));

let count = 0;

item.update =  function () {
  let rect = this.__contents;
  let gradient = this.defs.gradient;
  let id = 'g'+(count++);
  gradient.id = id;
  var wd = this.width;
  var ht = this.height;
  rect.width = wd;
  rect.height = ht;
  var radius = this.cornerRadiusFraction * Math.min(wd,ht);
  rect.setDomAttribute('x',-0.5*wd);
  rect.setDomAttribute('y',-0.5*ht);
  rect.setDomAttribute('rx',radius);
  rect.setDomAttribute('ry',radius);
  gradient.stop0['stop-color'] =this.leftFill;
  gradient.stop1['stop-color'] = this.rightFill;
  rect.fill = 'url(#'+id+')'

}
return item;
});


