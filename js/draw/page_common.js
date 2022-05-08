/* global mpg:true */
// things used by each of the editors (editor,code_editor,catalog_editor)
 
let disableGray = "#aaaaaa";

const enableButton1 =function (bt,vl,disableColor) {
  if (bt) {
    bt.disabled = !vl;
    bt.$css({color:vl?"black":(disableColor?disableColor:disableGray)});
    
  }
}

const boxButton = function (bt,vl) {
   bt.$css({border:vl?"red solid":"none"});
}

const enableButton = function (bt) {
    enableButton1(bt,true);
}

const disableButton = function (bt) {
  enableButton1(bt,false);
}


const disableButtonRed = function (bt) {
  enableButton1(bt,false,"red");
}

const setClickFunction = function (bt,fn) {
  if (bt) {
    bt.$click(function () {
      if (!bt.disabled) {
        fn();
      }
    });
  }
}
 
const enableTreeClimbButtons = function() {
  let isc = tree.selectionHasChild();
  let isp = tree.selectionHasParent();
  upBut.$show();
  topBut.$show();
  downBut.$show();
  enableButton1(upBut,isp);
  enableButton1(downBut,isc);
}


const activateTreeClimbButtons = function () {
setClickFunction(topBut,function () {
  let top = tree.getParent(1);
  if (top) {
    top.__select('svg');
  }
  enableTreeClimbButtons();
});

setClickFunction(upBut,function () {
  let pr = tree.getParent();
  if (pr) {
    pr.__select('svg');
  }
  enableTreeClimbButtons();
});


setClickFunction(downBut,function () {
  tree.showChild();
  enableTreeClimbButtons();
});
}
const fileIsOwned = function (url) {
   if (!url) {
    return false;
  }
  //let userName= fb.currentUserName();
  if (!userName) {
    return false;
  }
  let owner = fb.uidOfUrl(url);
  return (userName===  owner);// || ((uid === 'twitter:14822695') && (owner === 'sys'));
}
// if the current item has been loaded from an item file (in which case ui.itemSource will be defined),
// this checks whether it is owned by the current user, and, if so, returns its path
const ownedFilePath = function (url) {
  if (!fileIsOwned(url)) {
    return undefined;
  }
  return fb.pathOfUrl(url);
}


let afterYes;
let yesNoText;
let infoText;

const setupInfo = function () {
  infoText  = html.Element.mk('<div/>');
  mpg.info_lightbox.setContent(infoText);  
}

const popInfo = function (text) {
  infoText.$html(text);
  mpg.info_lightbox.pop();
}
  
const setupYesNo = function (itext) {
  let yesBut,noBut;
  let text = itext?itext:'';
    let yesNoButtons = html.Element.mk('<div/>').__addChildren([
       yesNoText = html.Element.mk('<div style="margin-bottom:20px;font-size:10pt">'+text+'</div>'),
       yesBut =  html.Element.mk('<div class="button">Yes</div>'),
       noBut =  html.Element.mk('<div class="button">No</div>')
      ]);
    mpg.confirm_lightbox.setContent(yesNoButtons);
    yesBut.$click(function () {
     afterYes();
     mpg.confirm_lightbox.dismiss();
    });
    noBut.$click(function () {
      mpg.confirm_lightbox.dismiss();
    });
}

const setYesNoText = function (text) {
  yesNoText.$html(text);
}

const confirm = function (text,yesF) {
  yesNoText.$html(text);
  afterYes = yesF;
  mpg.confirm_lightbox.pop();
}
let afterOk,dialogText;

const setupDialog = function (itext) {
  let okBut,cancelBut,inputEl;
  let text = itext?itext:'';
  let dialogElement = html.Element.mk('<div/>').__addChildren([
       dialogText = html.Element.mk('<div style="margin-bottom:20px;font-size:10pt">'+text+'</div>'),
       inputEl = html.Element.mk(
              '<input type="input" style="display:block;width:90%;font:8pt arial;margin-left:5px"></input>'),           
       okBut =  html.Element.mk('<div style="margin-top:20px;margin-left:20px;" class="button">Ok</div>'),
       cancelBut =  html.Element.mk('<div class="button">Cancel</div>')
      ]);
    mpg.dialog_lightbox.setContent(dialogElement);
    okBut.$click(function () {
     afterOk(inputEl.$prop('value'));
     mpg.dialog_lightbox.dismiss();
    });
    cancelBut.$click(function () {
      mpg.dialog_lightbox.dismiss();
    });
}



const dialog = function (text,okF) {
  dialogText.$html(text);
  afterOk = okF;
  mpg.dialog_lightbox.pop();
}

const uiAlert = function (msg) {
  mpg.alert_lightbox.pop();
  mpg.alert_lightbox.setHtml(msg);
}

//ui.vars.uiAlert = uiAlert;


window.addEventListener("beforeunload",function (event) {
  let msg = "There are unsaved changes. Are you sure you want to leave this page?";
  if (fileModified && fb.currentUser) {
    event.returnValue = msg;
    return msg;
  }
});


const openStructureEditor = function () {
  let url = 'draw.html';
  if (source && core.endsIn(source,'.js')) {
    url += '?source='+source;
  }
  fb.sendToShell(url);
  //top.location.href = shellDomain+url;
}



const checkSaveError = function (err,sz) {
  let msg;
  if (err) {
    if (err === 'maxSizeExceeded') {
      msg = 'File size '+sz+' exceeded limit: '+(core.vars.maxSaveLength);//+(fb.maxSaveLength);
    } else if (err === "maxAllocationExceeded") {
      msg = "This save would exceed your allocation of 5 Meg diagram storage";
    } else {
      msg = 'the save failed, for some reason';
    }
    ui.displayTemporaryError(messageElement,msg,15000);
  }
  return err;
}

//let fitContentsForJpg = false;

const saveImageMaybe = function (url,needsSave,cb) {
  let path = core.afterChar(url,')');
  let isSvg = core.endsIn(path,'.svg');
  let afterSave = function (err,sz) {
     if (ui.vars.jumpToImage === false) {
        alert('done');
        return; 
     }
     if (jpegMovieMode) {
       return;
     }
     if (checkSaveError(err,sz)) {
        return;
     }
     if (cb) {
      cb();
      return;
     }
     let loc = 'image.html?source='+url
     if (dom.vars.imageFound) {
       loc += '&image=1&aspect='+core.nDigits(dom.vars.svgAspectRatio,3);
     }
     fileModified = false;

     fb.sendToShell(loc);
  }
  if (needsSave) {
    if (isSvg) {
      ui.saveSvg(path,afterSave);
    } else {
      if (!core.vars.photoMode) {
        svg.fitContents();
      }
      convertToJpeg(path,afterSave);
    }
  } else {
    afterSave();
  }
}

export {confirm,popInfo};