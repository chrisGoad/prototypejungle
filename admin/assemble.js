/*

A very tiny and simple webpack-ish tool.
Concats files, and babels and minimizes them.
Usage:

cd c:\protopedia
node admin/assemble.js <module>

*/
let what = process.argv[2];
let noMinify = 1;// Boolean(process.argv[3]);
console.log(noMinify);
let versions = require("./versions.js");

 
let fs = require('fs');
let zlib = require('zlib');


let fileLists = {};
let publicModules = [];

let prepend = function (what,arr) {
  return arr.map(function (el) { return what+"/"+el;});
}


fileLists.core = prepend('core',["root","tree","exception","update","instantiate","serialize","deserialize","pageutils",
                  "install","xpath","log","replace","spread","diff","history"]);//,"geom","geometric_object","replace"]); 

fileLists.core = prepend('core',["root","tree","exception","update","instantiate","pageutils",
                  "xpath","log","replace","spread","diff"]);//,"geom","geometric_object","replace"]); 
fileLists.geom = prepend("geom",["geom","three_d","geometric_object"]); //linted with eslint 11/22/17
fileLists.dom = prepend('dom',["environment","data","dom1","jxon","svg","html","domstringify","svg_serialize"]);
fileLists.dom = prepend('dom',["environment","data","dom1","jxon","svg","html"]);
fileLists.draw = prepend('draw',
                   ["environment","svgx","page_common","install","page",//"misc","page_top",
                    "init_page","to_image"]);//linted; code cleaned


function doGzip(file,cb) {
  console.log("gzipping ",file);
  let gzip = zlib.createGzip();
  let inp = fs.createReadStream(file);
  let out = fs.createWriteStream(file+'.gz');
  inp.pipe(gzip).pipe(out);
  out.on('close',cb);
}


let isPublic = false;
function fullName(f) {
  return `js/${f}.js`;
}

function getContents(fl) {
  let fln = fullName(fl);
  console.log("Reading from ",fln);
  let cn = ""+fs.readFileSync(fln)
  return cn;
}

function mextract(fls) {
  let rs = "";
  fls.forEach(function (fl) {
    rs += getContents(fl);
  });
  return rs;
}



function mkPath(which,version,mini) {
  if (1 ||mini) {
    return `js/${which}-${version}.js`;
  } else {
    return `staging/${which}-${version}.js`;
  }
}

async function mkModule(which,version,contents) {
  console.log('mkModule',which,version);
  
  let path = mkPath(which,version,0);
  let minpath = mkPath(which,version,1);
  let minified;
  console.log("Saving to path ",path);  
  
  
  //let cnn = fs.readFileSync(path);
  fs.writeFileSync(path,contents);
  if (noMinify) {
    minified = contents;
  } else {
    console.log('MINIFY');
     minified = await minify(path,{ecma:8}).code;
    /* minified = babel.transformFileSync(path, {
  minified: true,
  sourceType: "module",
  comments:false*/
 /// configFile: false
  //presets: [[minifyPreset]]
//}).code;// for some reason plain old babel.transformmm couldn't find .babelrc
 //  console.log(minified);
  }
  //return;
 // console.log('minified[',minified,']');
 // return;
  fs.writeFileSync(minpath,minified);
  doGzip(minpath,function () { // finally ,gzip it;
    console.log("gzipping done");
  });
}



function buildModule() {
  isPublic = publicModules.indexOf(what) >= 0;
  let fls = fileLists[what];
  if (!fls) {
    console.log('No such module: ',what);
  }
  let cn = mextract(fls);
  mkModule(what,versions[what],cn);
}

buildModule();     
   
   
/* maybe resurrect this some time 
function mk_combo() {
  let domPath = mkPath('dom',versions.pjdom);
 console.log('domPath',domPath);
  let dom = ''+fs.readFileSync(domPath);
  let ui = ''+fs.readFileSync(mkPath('ui',versions.pjui));
  let editor = ''+fs.readFileSync(mkPath('editor',versions.editor));
  let combo = dom.concat(ui,editor);
  mkModule('protochart',versions.combo,combo);
  console.log(combo);
  //code
}
*/
/*
cd c:\prototypejungle\public
 
 node admin/assemble core;
 node admin/assemble geom;
 node admin/assemble dom;
 node admin/assemble draw;
 



 
 node admin/assemble minimal 1;
 node admin/assemble core  1;
 node admin/assemble geom 1;
 node admin/assemble dom 1;
 node admin/assemble harness 1;
 node admin/assemble firebase 1;
 node admin/assemble firebase_only 1;
 node admin/assemble graph 1;
 node admin/assemble ui 1;
 node admin/assemble tree 1;
  node admin/assemble catalog 1;
 node admin/assemble editor 1;
 node admin/assemble code_editor 1;
node admin/assemble text_editor 1;
 node admin/assemble chooser 1;
 node admin/assemble lightbox 1;

node admin/assemble catalog_editor;

*/

