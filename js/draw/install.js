
let loadingItem = undefined;
let mainUrl;
let oldway = false;
const installMainItem = function (source,settings)  {
  if (settings) {
    settings = settings;
  }
  if (source) {
    core.setRoot(dom.SvgElement.mk('<g/>'));
    root = core.root;
    let ext = core.afterLastChar(source,'.',true);
    if (ext === 'history') {
      core.installHistory(source,afterMainInstall);
    } else {
      if (oldway) {
         core.install(source,afterMainInstall); 
      } else {
   //     debugger;
        import(source).then((module) => afterMainInstallM(module));
      }
    }
  } else  {
    finishMainInstall();
  }
}
let main,installError;
const afterMainInstall = function (e,rs) {
  if (e) {
    installError = e;
    finishMainInstall();
  } else if (rs) {
    delete rs.__sourceUrl;
    main = rs;
  } 
  finishMainInstall();
}
const afterMainInstallM = function (module) {
  //debugger;
  main = module.rs;
 // debugger;
  finishMainInstall();
}

const setBackgroundColor = function (item) {
      if (!item.backgroundColor) {
        item.backgroundColor="black";
      }
   if (!item.__nonRevertable) {
     core.root.set('__nonRevertable',core.lift({backgroundColor:1}));
   }
}

let enableTheGrid = true;
const mergeIn = function (dst,src) {
  core.forEachTreeProperty(src,(child) => {
    let nm = child.__name;
    let anm = core.autoname(dst,nm);
    dst.set(anm,child);
  }); 
}

const performInit = function () {
	
  let rmain = core.root.main;
  if (rmain) {
    if (rmain.initializePrototype) {
      rmain.initializePrototype();
    }
    if (rmain.initialize) {
      rmain.initialize();
    }
    core.propagateDimension(rmain);
  }
 // dom.fullUpdate(true);
  if (core.root.draw) {
    //core.root.draw(dom.svgMain.__element); // update might need things to be in svg
  }
	const last = () => {
		dom.fullUpdate();
		fitTheContents();
    //if (rmain && rmain.animate) {
    //   rmain.animate();
		//}
  }
  if (!core.throwOnError) {
		last();
  } else {
    try {
		  last();
    } catch (e) {
      handleError(e);
    }
  }  
}

const runAnimation = function (save) {
	debugger;
	let main = core.root.main;
	main.saveVideo = save === 'yes';
	if (main.animate) {
		main.animate(0);
	}
}



const resumeAnimation = function (save) {
	debugger;
	let main = core.root.main;
	main.saveVideo = save === 'yes';
	if (main.animate) {
		main.animate(1);
	}
}

const saveAnimation = () => runAnimation('yes');

const pauseAnimation = function () {
	let main = core.root.main;
	if (main.pauseAnimation) {
		main.pauseAnimation();
	}
}


const stepAnimation = function () {
	let main = core.root.main;
	if (main.oneStep) {
		main.oneStep(true);
	}
}

let audioCtx;

const turnOnAudio = function () {
  debugger;
 // audioCtx = new AudioContext();
 // audioCtx.resume();
   let rmain = core.root.main;
  if (rmain) {
    if (rmain.initializeSound) {
      rmain.initializeSound();
    }
  }
}
const stepNoSaveAnimation = function () {
	let main = core.root.main;
	if (main.oneStep) {
		main.oneStep(false);
	}
}


const repeatFrame = function () {
	let main = core.root.main;
	if (main.repeatFrame) {
		main.repeatFrame();
	}
}
		
const svgInstall = function () {
	//debugger;
  let fromItemFile = mainUrl && core.endsIn(mainUrl,'.item');
  if (main && fromItemFile) {
    let svProtos = core.root.prototypes; // loading main may have involved installing prototypes
    core.setRoot(main);
    if (svProtos && main.prototypes) {
      mergeIn(main.prototypes,svProtos);
    }
  } else if (!core.root) {
    core.setRoot(dom.SvgElement.mk('<g/>'));
  }
  
  setBackgroundColor(core.root);
  dom.svgMain.addBackground(core.root.backgroundColor);
  dom.svgMain.fitFactor = fitFactor;
  //ui.initControlProto();
  dom.installRoot();
  if (main && !fromItemFile) {
      core.root.set('main',main);
  }
	//performInit();
  /*let rmain = core.root.main;
  if (rmain) {
    if (rmain.initializePrototype) {
      rmain.initializePrototype();
    }
    if (rmain.initialize) {
      rmain.initialize();
    }
    core.propagateDimension(rmain);
  }
  dom.fullUpdate();
  if (core.root.draw) {
    core.root.draw(dom.svgMain.__element); // update might need things to be in svg
  }
  if (!core.throwOnError) {
		dom.fullUpdate();
  } else {
    try {
		  dom.fullUpdate();
    } catch (e) {
      handleError(e);
    }
  }*/
  
}

let enableButtons; //defined differently for different pages
let fitFactor = 0.8;
const findInstance = function (url) {
  let proto = core.installedItems[url]; 
  if (!proto) {
    return undefined;
  }
  let rs =  core.findDescendant(core.root,function (node) {
    return proto.isPrototypeOf(node);
  });
  if (rs) {
    return rs;
  }
}

const displayError = function (msg) {
  svgMessageDiv.$show();
  svgMessageDiv.$html('<div style="padding:150px;background-color:white;text-align:center">'+msg+'</div>');
  //svgDivReady = false;
}

core.setDisplayError(displayError);

const saveTheImage = function (forMpix) {
	debugger;
	//saveTheThumb();
//	return
  
  jpgSizeFactor = forMpix?jpgMpixFactor:jpgMainFactor;
	let wts = core.vars.whereToSave;// + '.jpg';
  if (!wts) {
		alert('no destination given for image');
		return;
  }
  //dialog('Variant',setTheVariant);

	let dst = forMpix?`images_hi_res/${wts}.jpg`:`images/${wts}.jpg`;
	convertToJpeg(dst,function () {
		alert((forMpix?'saved the image in high res at ':'saved the image at ')+dst);
		if (!forMpix) {
			saveTheThumb();	
		}
	});	
	
}


const saveTheThumb = function () {
	debugger;
	jpgSizeFactor = jpgThumbFactor;
	let wts = core.vars.whereToSave;// + '.jpg';
	if (wts) {
		let dst = `www/thumbs/${wts}.jpg`;
	  convertToJpeg(dst,function () {
		  alert('saved the thumb at '+dst);
	  });	
	} else {
		alert('no destination given for image');
	}
}

const padWithZeros = function (padTo,n) {
	let s = ''+n;
	let ln = s.length;
	if (ln < padTo) {
		let nm = padTo-ln;
		for (let i=0;i<nm;i++) {
			s = '0'+s;
		}
	}
	return s;
}

const saveFrame = function (n) {
	debugger;
	let pdn = padWithZeros(3,n);
	let wts = core.vars.whereToSave;
	if (wts) {
	  let dst = `animations/${wts}_f${pdn}.jpg`;
	  convertToJpeg(dst,function () {
		  console.log('saved the frame at '+dst);
	  });	
	} else {
		alert('no destination given for image');
	}
}

const fitTheContents = function () {
	dom.svgMain.fitContents();
}

const finishMainInstall = function () {
 // debugger;
 /* if (main) {
    if (main.loadAudioAssets) {
      main.loadAudioAssets();
    }
  } */
  let e = installError;
  let emsg;
  
  if (e) {
    emsg = '<p style="font-weight:bold">'+e+'</p>';
    core.displayError(emsg);
    
  }
  if (svgDiv && !e) {
    svgMessageDiv.$hide();
    svgInstall();
  }
  layout();
  if (vars.fitMode) {
    dom.svgMain.fitContents();
  }
  //if (ui.vars.whichPage !== 'text_editor' && !core.root.transform) {
  if ( !core.root.transform) {
     core.root.set('transform',dom.vars.defaultTransform);
  }
  let next2 = function () {
    //enableButtons();
    dom.svgMain.fitContents();
   /* $(window).resize(function() {
      layout();
      if (ui.vars.fitMode) {
        dom.svgMain.fitContents();
      }
    });*/
  }
  let afterLoad = function (x,y,z) {
    let itm = insertItem(Point.mk(0,0),1);
    if (itm.afterLoad) {
      itm.afterLoad();
    }
    next2();
  }
  if (loadUrl) {
   loadProtoFromPath(loadUrl,'m',null,afterLoad);
   return;
  }

  if (0) { //(ui.vars.whichPage === 'code_editor') || (ui.vars.whichPage === 'text_editor')) {
    viewSource();
    next2();
    return;
  } else if (1) { //ui.vars.whichPage === 'structure_editor') {
     // tree.showItemAndChain(core.root,tree.vars.expandMode,true);  //cgstub7/20 true -> noSelect
      //setCustomActionPanelContents();
  }
  next2();
//  enableButtons();
// debugger;
 //performInit();
 //fitTheContents();
	//setTimeout(fitTheContents,1000);	
	performInit();
	//setTimeout(performInit,1000);	
 // saveState('initial');

}

const displayMessageInSvg = function (msg) {
  core.root.hide();
  svgMessageDiv.$show();
  svgMessageDiv.$html(msg);
}

 const clearError = function () {
   core.root.show();
   svgMessageDiv.$hide();
 }

const handleError = function (e) {
	debugger; //keep
  if (core.throwOnError) {
    displayMessageInSvg(e);
  } else {
    core.error(e.message);
  }
}

export {saveTheImage,saveFrame,fitTheContents,audioCtx};
