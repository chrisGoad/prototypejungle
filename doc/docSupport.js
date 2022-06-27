debugger;
const afterLastChar = function (string,chr,strict) {
  let idx = string.lastIndexOf(chr);
  if (idx < 0) {
    return strict?undefined:string;
  }
  return string.substr(idx+1);
}
const beforeLastChar = function (string,chr,strict) {
  let idx = string.lastIndexOf(chr);
  if (idx < 0) {
    return strict?undefined:string;
  }
  return string.substr(0,idx);
}
const extension = function (string) {
  return afterLastChar(string,'.');
}

const getPage = function () {
	let c_url = window.location.href;
  let c_file = afterLastChar(c_url,'/');
  let c_name = beforeLastChar(c_file,'.');
  let c_page = thePages.indexOf(c_name);
  return c_page;
}

let cPage;
let thePages = ['disclaimer','installation','conventions','generators','method_modules','basics','grid','boundedRandomGrids','powerGrid','drop','dropForest','web','lines','assembly','prototypetree','geometry','shapes'];
const onPrev = function () {
  debugger;
//	let cPage = getPage();
	let dest = thePages[cPage-1];
	window.location.href = dest+'.html';
}

const onNext = function () {
  debugger;
 // let cPage = getPage();
	let dest = thePages[cPage+1];
	window.location.href = dest+'.html';
}

document.addEventListener('DOMContentLoaded', () => {
  debugger;
	let prevSpan = document.getElementById('prevSpan');
	let nextSpan = document.getElementById('nextSpan');
  cPage = getPage();
	prevSpan.addEventListener('click',onPrev);
	nextSpan.addEventListener('click',onNext);
  if (cPage === 0) {
    prevSpan.style.display = "none";
  }
  if (cPage === (thePages.length - 1)) {
	  nextSpan.style.display = "none";
  } 
});	
