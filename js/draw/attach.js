// attaching text

ui.nearestText = function (node) {
  let found = undefined;
  pj.forEachDescendant(pj.root,function (d) {
    if (found) {
      return;
    }
    if (d.__sourceUrl === '/text/textPlain.js') {
      found 
    }
  }