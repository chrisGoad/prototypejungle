// Copyright 2019 Chris Goad
// License: MIT

// minimal utilities needed for a PrototypeJungle web page (used in the minimal and firebase_only modules)


// p might be a string or array of strings; if the latter, returns  true if it ends in any
const endsIn = function (string,p) {
  if (typeof p === 'string') {
    let ln = string.length;
    let  pln = p.length;
    let es;
    if (pln > ln) {
      return false;
    }
    es = string.substr(ln-pln);
    return es === p;
  } else {
    return p.some(function (x) {
      return endsIn(string,x);
    });
  }
  
}

const beginsWith = function (string,p) {
  let ln = string.length;
  let pln = p.length;
  let es;
  if (pln > ln) {
    return false;
  }
  es = string.substr(0,pln);
  return es === p;
}


const beforeLastChar = function (string,chr,strict) {
  let idx = string.lastIndexOf(chr);
  if (idx < 0) {
    return strict?undefined:string;
  }
  return string.substr(0,idx);
}

const pathExceptLast = function (string,chr) {
  return beforeLastChar(string,chr?chr:'/');
}


const afterLastChar = function (string,chr,strict) {
  let idx = string.lastIndexOf(chr);
  if (idx < 0) {
    return strict?undefined:string;
  }
  return string.substr(idx+1);
}


const pathLast = function (string) {
  return afterLastChar(string,'/');
}


const ready = function (fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded',fn);
  }
}


const httpGet = function (url,cb) { // there is a fancier version in core/install.js
/* from youmightnotneedjquery.com */
 // let performGet = function (url) {
    let request = new XMLHttpRequest();
    request.open('GET',url,true);// meaning async
    request.onload = function() {
      if (cb) {
        if (request.status >= 200 && request.status < 400) {
        // Success!
          cb(undefined,request.responseText);
        } else {
          cb('http GET error for url='+url);
        }
        // We reached our target server, but it returned an error
      }
    }  
    request.onerror = function() {
        cb('http GET error for url='+url);
    };
    request.send();
  
  //vars.mapUrl(iurl,performGet)
}

const saveJson = function (path,str,cb) {
	debugger;
	httpPost(path,str,cb);
 //fb.saveString(path,str,fb.jsonMetadata,undefined,cb);
}



  
//   from http://paulgueller.com/2011/04/26/parse-the-querystring-with-jquery/
const parseQuerystring = function() {
  let nvpair = {};
  let qs = window.location.search.replace('?','');
  let pairs = qs.split('&');
  pairs.forEach(function(v) {
    let pair = v.split('=');
    if (pair.length>1) {
      nvpair[pair[0]] = pair[1];
    }
  });
  return nvpair;
}

const transferProperties = function(dst,src,props) {
  if (src) {
    props.forEach((prop) => {
      let pv = src[prop];
      if (pv !== undefined) {
         dst[prop] = pv;
      }
    });
  }
}


const  debugMode = function (vl) {
  if (vl) {
    catchUpdateErrors = false;
  } else {
    catchUpdateErrors = true;
  }
}

let loadedUrls = [];

const loadjs = function (iurl,requester) {
	  //debugger;
    log('install','loadjs',iurl,' from ',requester);
    loadedUrls.push(iurl);
    vars.mapUrl(iurl,function (url) {
        var fileref=document.createElement('script');
        fileref.setAttribute("type","application/javascript");
        fileref.setAttribute("src", url);
         (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(fileref);
    },requester);
}

let afterLoadTop;   

const httpPost = function (url,data,cb) {
	let request = new XMLHttpRequest();
	request.open('POST',url, true);// meaning async
	//request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-Type", "text/plain");
	request.onreadystatechange = function() { // Call a function when the state changes.
		 if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			// Request finished. Do processing here.
			//debugger;
			if (cb) {
				cb('ok');
			}
		 }
	};
	request.send(data);	
}

const loadTopDefs = function (cb) {
  debugger;
  afterLoadTop = cb;
  // binds globals to the modules
  loadjs('/topdefs.js');
}

const mapUrl = function (url,cb) {cb(url)};

vars.mapUrl = mapUrl;
vars.inverseMapUrl = function (url) {return url;}


export {loadedUrls,loadjs,httpPost,loadTopDefs,debugMode,httpGet,saveJson,beginsWith,endsIn,afterLastChar,beforeLastChar,parseQuerystring,pathExceptLast,pathLast,transferProperties,afterLoadTop};
