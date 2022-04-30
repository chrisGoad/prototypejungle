
let rs = dom.SvgElement.mk('<g/>');

rs.width = 40;
rs.height = 10;

rs.text = 'Text';       
rs["font-size"] = "12";
rs["font-style"] = "normal";
rs["font-family"] = "arial";
rs["font-weight"] = "normal";
rs.stroke = "black"; // turned into fill in the actual text. 
//rs.lineSep = 2;

rs.role = 'vertex';
rs.resizable = true;
rs.text = 'test';

let textProperties = 
         ["font-size",
         "font-style",
         "font-family",
         "font-weight"];

rs.update = function () {
	 let singleLine = this.set('singleLine',dom.SvgElement.mk('<text stroke-width="0"  text-anchor="middle"/>'));
	 core.setProperties(singleLine,this,textProperties);
    singleLine.fill = this.stroke;
	  singleLine.show();
    singleLine.setText(this.text);
}

export {rs};


