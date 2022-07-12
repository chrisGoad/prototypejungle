
import {rs as linePP} from '/shape/line.mjs';
import {rs as circlePP} from '/shape/circle.mjs';
import {rs as basicsP} from '/generators/basics.mjs';
import {rs as addDropMethods} from '/mlib/drop.mjs';
import {rs as addSegsetMethods} from '/mlib/segsets.mjs';
import {rs as addRandomMethods} from '/mlib/boundedRandomGrids.mjs';
import {rs as addWebMethods} from '/mlib/web.mjs';	

let rs = basicsP.instantiate();

addDropMethods(rs);
addRandomMethods(rs);
addSegsetMethods(rs);
addWebMethods(rs);
rs.setName('drop_on_top_2');
let wd = 160;
let nr = 100;
let topParams = {saveState:1,stateOpsDisabled:0,width:wd,height:wd,numRows:nr,numCols:nr,minSeparation:2,frameStrokee:'white',framePadding:20,circleScale:.5,//};
 //initialDropColor:'rgb(200,200,255)',finalDropColor:'rgb(0,0,100,255)'};
 initialDropColor:'rgb(255,255,255)',finalDropColor:'rgb(255,255,255)'};
//let dropParams = {dropTries:100,maxDrops:4000}
let dropParams = {dropTries:100,maxDrops:10000};
//dropParams = {dropTries:0,maxDrops:0}
let  webParams = {webTries:1000,minConnectorLength:0,maxConnectorLength:2*(wd/nr)};

Object.assign(rs,topParams);


rs.initProtos = function () {
  this.lineP = linePP.instantiate();
  this.lineP.stroke = 'white';
  this.lineP.stroke = 'transparent';
  this.lineP.stroke = 'rgb(200,200,200)';
  this.lineP['stroke-width'] = .3; 
  this.circleP = circlePP.instantiate();
  this.circleP.fill = 'white';
  this.circleP['stroke-width'] = 0;
}  



rs.initialDrop = function (side) {
  let {circleScale:cs} = this;
  let crca = [];
  let crcsa = [];
debugger;
  if (this.ipositions) {
    debugger;
    let {positions,ipositions,circleP,initialDropColor} = this;
    ipositions.forEach( (ip) => {
      let p = Point.mk(ip.x,ip.y);
      let crc = Circle.mk(p,1);
      let crcs = crc.toShape(circleP);
      crcs.fill = initialDropColor;
      crca.push(crc);
      crcsa.push(crcs);
    });
   return {geometries:crca,shapes:crcsa};
  } 
  this.ipositions = [];
   let {width,height,lineP,circleP,ipositions} = this;
   let hwd = wd/2;
   let disp =0;// side==='left'?-1.0*hwd:1.0*hwd;
 //  let segs = this.rectangleSegments(width,height); // rectangleSegments is defined in segsets.mjs
  //let lines = segs.map((sg) => this.genLine(sg,lineP));
  let segs = [];
  let lines = [];
  let nc = 20;
  let ss = 0.5;
  let iss = 0.5;
  let intv =  wd/nc;
  //let hwd = 0.5*wd;
  const addCircle = (c) => {
    let {x,y} = c;
  /*  if (x>=0) {
      return;
     }*/
    let ax=Math.abs(x)
    let ay=Math.abs(y)
    if ((ax < iss*hwd) && (ay < iss*hwd)) {
      return;
    }
    let p = c.plus(Point.mk(disp,0));
    ipositions.push(p);
    let crc = Circle.mk(p,1);
    let crcs = crc.toShape(circleP,cs);
    debugger;
    crcs.fill = this.initialDropColor;
    //crc.aboriginal = 1;
    crca.push(crc);
    crcsa.push(crcs);
  }
  for (let i = 0;i<nc;i++) {
    let x = -0.5*wd + i*intv; + disp;
    for (let j=0;j<nc;j++) {
      let y = -0.5*wd + j*intv;
      let c = Point.mk(x,y);
      addCircle(c);
    }
  }
  debugger;
  //return {geometries:crca,shapes:crcsa};
  return {geometries:crca,shapes:[]};
}
/*
rs.initialDrop = function () {
  this.initialDrop0('left');
 // this.initialDrop0('right');
  return {geometries:crca,shapes:crcsa};

}*/
rs.segParams = function (np) {
  let r = Math.random();
 // let np = 4;
  let angle = (np === -1)?Math.PI/2:Math.floor(r*np)* (Math.PI/np)
  let length = 2;// + Math.floor(r*np)*4;
  return {angle,length};
} 	

  
rs.generateDrop= function (p) {
  let {height:ht,radius,positions,saveState,finalDropColor,circleScale:cs} = this;
 /* if (p.x>=0) {
    return;
  }*/
  if (saveState) {
  //  positions.push(p);
  }
 /* let hht = 0.5*ht;
  //let fr = (p.y + hht)/ht;
  let d = p.length();*/
  let crc = Circle.mk(1);
  let crcs = crc.toShape(this.circleP,cs);
  	crcs . fill = finalDropColor;
  //return {geometries:[crc],shapes:[crcs]}
  return {geometries:[crc],shapes:[]}
}



rs.computeState  = function () {
   return [["ipositions",this.ipositions],["positions",this.positions]];
}

rs.initialize = function () {
  let {positions,ipositions}= this;
  this.initProtos();
  webParams.lineP = this.lineP;
  this.addFrame();
 //  this.addRectangle({width:0.5*wd,height:wd,position:Point.mk(-0.25*wd,0),stroke_width:0,fill:'rgb(0,0,100)'});
  // this.addRectangle({width:0.5*wd,height:wd,position:Point.mk(0.25*wd,0),stroke_width:0,fill:'rgb(100,0,0)'});
   this.addRectangle({width:wd,height:wd,position:Point.mk(0,0),stroke_width:0,fill:'rgb(0,0,100)'});
   this.addRectangle({width:0.666*wd,height:0.666*wd,position:Point.mk(0,0),stroke_width:0,fill:'rgb(40,40,140)'});
  // this.addRectangle({width:0.333*wd,height:0.333*wd,position:Point.mk(0,0),stroke_width:0,fill:'rgb(200,100,0)'});
   //this.addRectangle({width:0.333*wd,height:0.333*wd,position:Point.mk(0,0),stroke_width:0,fill:'rgb(80,80,180)'});
   this.addRectangle({width:0.333*wd,height:0.333*wd,position:Point.mk(0,0),stroke_width:0,fill:'rgb(0,0,180)'});
  //this.setupRandomGridForShapes('v',{step:10,min:160,max:255});
  //this.setupRandomGridForShapes('which',{step:0.3,min:0,max:1});
 if (this.saveState) {
    this.positions = [];
    this.generateDrops(dropParams);
    let points = this.ipositions.concat(this.positions);  
    this.generateWeb(Object.assign(webParams,{points}));

    debugger;
    this.saveTheState();
  } else {
    debugger;
    this.getTheState(() => {
      this.generateDrops(dropParams);
    });

  }
}

export {rs};


