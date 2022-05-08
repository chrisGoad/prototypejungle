
let bkColor = "white";
let topbarDiv,cols,svgDiv,saveBut,saveMpixBut,ctopDiv,svgMessageDiv;

let mpg;
const buildPage = function () {
saveBut = document.getElementById('saveButton');
saveMpixBut = document.getElementById('saveMpixButton');
saveBut.addEventListener("click", () => saveTheImage(0));
saveMpixBut.addEventListener("click", () => saveTheImage(1));
mpg =  html.wrap("main",'div',{style:{position:"absolute","margin":"0px",padding:"0px",display:"none"}}).
__addChildren([
  topbarDiv = html.wrap('topbar','div',{style:{position:"absolute",height:"10px",left:"0px","background-color":bkColor,margin:"0px",padding:"0px"}}).
  __addChildren([
    ctopDiv = html.wrap('topbarInner','div',{style:{float:"right"}})
  ]),

  cols = html.Element.mk('<div id="columns" style="left:0px;position:relative"/>').
  __addChildren([
    svgDiv = html.Element.mk('<div id="svgDiv" draggable="true" style="position:absolute;height:400px;width:600px;background-color:white;border:solid thin black;display:inline-block"/>').
    __addChildren([
        svgMessageDiv = html.Element.mk('<div style="display:none;margin-left:auto;padding:40px;margin-right:auto;width:50%;margin-top:20px;border:solid thin black">AAAAUUUU</div>')
     ]),
])
]);
return mpg;
}

   // there is some mis-measurement the first time around, so this runs itself twice at fist
let firstLayout = true;
let svgwd,svght;
const layout = function(noDraw) { // in the initialization phase, it is not yet time to draw, and adjust the transform
  // aspect ratio of the UI
  let canvas = document.getElementById('imageCanvas');
  let pageHeight,pageWidth,lrs;
  let topHt,docwd,docTop,twtp;
  let bkg = "white";
  let ar = 0.3;
  let wpad = 5;
  let vpad = 5;//minimum sum of padding on top and bottom
	let awinwid = window.innerWidth;
	let awinht = window.innerHeight;
  let pwinwid = awinwid - (2 * wpad);
  let pwinht = awinht - (2 * vpad);
  if (pwinht < ar * pwinwid) { // the page is bounded by height 
    pageHeight = pwinht;
    pageWidth = pageHeight/ar;
    lrs = (awinwid - pageWidth)/2;  
  } else { // the page is bounded by width
    pageWidth = pwinwid;
    pageHeight = ar * pageWidth;
  }
  pageHeight = pwinht;
  pageWidth = pwinwid;
  svgwd = pageWidth  - 20;
  Object.assign(mpg.__element.style,{left:lrs+"px",width:pageWidth+"px",height:(pageHeight-0)+"px",display:"block"});
  topHt = -15 + topbarDiv.__element.offsetHeight;
  cols.$css({left:"5px",width:pageWidth+"px",top:topHt+"px"});
  ctopDiv.$css({"padding-top":"0px","padding-bottom":"20px","padding-right":"10px",left:svgwd+"px",top:"0px"});
  svght = pageHeight-70;
  svgDiv.$css({id:"svgdiv",left:"0px",width:svgwd +"px",height:svght + "px","background-color":bkg});
  canvas.style.width = svgwd;
  canvas.style.height = svght;
   dom.svgMain.resize(svgwd,svght); 
   dom.svgMain.positionButtons(svgwd);
   if (firstLayout) {
     firstLayout = false; 
     layout(noDraw);
   }
}

