//line

core.require('/connector/connector0.js','/line/line.js',function (connectorP,linePP) {

let rs = connectorP.instantiate();

/* adjustable parameters */
rs.stroke = 'black';
rs['stroke-width'] =2
/* end adjustable parameters */

rs.initializePrototype = function () {
  core.assignPrototype(this,'lineP',linePP);
}

ui.hide(rs,['shaft','shaftProperties']);
return rs;
});
