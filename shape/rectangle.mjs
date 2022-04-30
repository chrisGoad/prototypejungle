//This code implements the rectangle shape
let item = svg.Element.mk('<rect/>');
item.shape_name = 'rectangle';



/* adjustable parameters */
item.width = 50;
item.height = 35;
item.fill = 'transparent';
item.stroke = 'black';
item['stroke-width'] = 1;
/*end adjustable parameters*/

item.resizable = true;
//A spot is plain shape, that can be turned into a container 
item.role = 'spot';

item.update =  function () {
  this.setDomAttribute('x',-0.5*this.width);
  this.setDomAttribute('y',-0.5*this.height);
}

export {item as rs};
