// Copyright 2019 Chris Goad
// License: MIT
/* The central structure is a tree, made of 2 kinds of internal nodes (pj.Object,pj.Array), 
 * and leaves which are of primitive type (numbers,boolean,null,strings), or are functions.
 * Internal nodes have __name and __parent  attributes.
 */
 
// Non-null non-array object. 
const ObjectNode = {}; 

// Sequential, zero-based array
const ArrayNode = [];

//export {ObjectNode,ArrayNode};
// codeRoot is the root of the PrototypeJungle realm, relative to which paths are computed
// root is the root of the current item (the item that becomes visible in the UI)


const codeRoot = Object.create(ObjectNode);
const vars = Object.create(ObjectNode);

let root;
const setRoot = function (rt) {
  root = rt;
}


codeRoot.Object = ObjectNode;
codeRoot.Array = ArrayNode;


// do the work normally performed by 'set'  by hand for these initial objects


ObjectNode.__parent = codeRoot;
ObjectNode.__name = 'Object';
ArrayNode.__parent = codeRoot;
ArrayNode.__name = 'Array';


// motivation: we need to define geometric methods for arrays too, and this provides access.

const defineArrayNodeMethod = function (name,method) {
  ArrayNode[name] = method;
}
  

export {setRoot,root,ObjectNode,ArrayNode,codeRoot,vars,defineArrayNodeMethod};// Copyright 2019 Chris Goad
// License: MIT

// tree operations

codeRoot.__builtIn = 1;

// constructors for nodes 

codeRoot.Object.mk = function (src) {
  let rs = Object.create(ObjectNode);
  if (src) {
    extend(rs,src);
  }
  return rs;
}

codeRoot.Array.mk = function (array) {
  let rs = Object.create(codeRoot.Array);
  if (array===undefined) {
    return rs;
  }
  let ln;
  let numerical = typeof array === 'number';
  if (numerical) {
    ln = array;
  } else {
    ln = array.length;
   }
  for (let i=0;i<ln;i++) {
    if (numerical) {
      rs.push(undefined);
    } else {
      let child = array[i];
      if (child && (typeof child === 'object')) {
        child.__parent = rs;
        child.__name = String(i);
      }
      rs.push(child);
    }
  }
  return rs;
}


//  make the same method fn work for Objects, Arrays
const nodeMethod = function (name,func) {
  codeRoot.Array[name] = codeRoot.Object[name] = func;
}



// only strings that pass this test may  be used as names of nodes
// numbers can be used as labels
export const checkName = function (string) {
  if ((string === undefined) || (!string.match)) { 
    error('Bad argument');
  }
  if (string==='') {
    return false;
  }
  if (string==='$') {
    return true;
  }
  return Boolean(string.match(/^(?:|_|[a-z]|[A-Z])(?:\w|-)*$/));
}
/* A path is a sequence of names indicating a traversal down a tree. It may be
 * represented as a '/' separated string, or as an array.
 * When string path starts with '/' (or an array with  empty string as 0th element)
 * this means start at pj, regardless of origin (ie the path is absolute rather than relative).
 */

const checkPath = function (string,allowFinalSlash) {
  let strSplit = string.split('/');
  let ln = strSplit.length;
  let  i = 0;
  if (ln===0) {
    return false;
  }
  if (allowFinalSlash && (strSplit[ln-1] === '')) {
    ln = ln - 1;
  }
  for (;i<ln;i++) {
    let pathElement = strSplit[i];
    if (((i>0) || (pathElement !== '')) && // '' is allowed as the first  element here, corresponding to a path starting with '/'
       !checkName(pathElement)) {
      return false;
    }
  }
  return true;
}


const evalPath = function (ipth,iorigin) {
  let pth,current,startIdx;
  let origin = iorigin?iorigin:root;
  if (!ipth) {
    return undefined;//origin; // it is convenient to allow this option
  }
  if (typeof ipth === 'string') {
    pth = ipth.split('/');
  } else {
    pth = ipth;
  }
  let ln = pth.length;
  if (ln===0) {
    return origin;
  }
  if (pth[0]==='') {
    current = codeRoot;
    startIdx = 1;
  } else {
    current = origin;
    startIdx = 0;
  }
  for (let idx=startIdx;idx<ln;idx++) {
    let prop = pth[idx];
    if (current && (typeof current === 'object')) {
      current = current[prop];
    } else {
      return undefined;
    }
  }
  return current;
}

// omits initial "/"s. Movethis?
const pathToString = function (p,isep) {
  let rs,ln,e;
  let sep = isep?isep:"/";
  ln = p.length;
  if (sep===".") {
    rs = p[0];
    for (let i=1;i<ln;i++) {
      e = p[i];
      if (typeof e==="number") {
        rs = rs+"["+e+"]";
      } else {
        rs = rs +"."+e;
      }
    }
  } else {
    rs = p.join(sep);
  }
  if (ln>0) {
    if (p[0]===sep) {
      return rs.substr(1);
    }
  }
  return rs;
}

/*
 * Return the path from root, or if root is undefined the path up to where parent is undefined. In the special case where
 * root === codeRoot, the path begins with '' (so that its string form will start with '/')
 */

const pathOf = function (node,root) {
  let rs = [];
  let current = node;
  while (true) {
    if (current === undefined) {
      //return undefined; // change cg 8/2/18 
      return root?undefined:rs;
    }
    if (current=== root)  {
      if (root === codeRoot) {
        rs.unshift('');
      }
      return rs;
    }
    let name = getval(current,'__name');
    // if we have reached an unnamed node, it should not have a parent either
    if (name!==undefined) {
      rs.unshift(name);
    }
    current = getval(current,'__parent');
  }
}

const stringPathOf = function (node,root,sep = '/') {
  let path = pathOf(node,root);
  return path!==undefined?path.join(sep):undefined;
}



nodeMethod('__pathOf',function (root) {return pathOf(this,root);});


const isObject = function (o) {
  return o && (typeof o === 'object');
}


const isAtomic = function (x) {
  return !isObject(x);
}
  

const isNode = function (x) { 
  return ObjectNode.isPrototypeOf(x) || ArrayNode.isPrototypeOf(x);
}


// creates Objects if missing so that path pth descending from this exists

const createPath = function (node,path) {
  let current = node;
  let child,next;
  path.forEach(function (prop) {
    // ignore '' ; this means that createPath can be used on codeRoot
    if (prop === '') {
      return;
    }
    if (!checkName(prop)) {
      error('Ill-formed __name "'+prop+'". Names may contain only letters, numerals, and underbars, and may not start with a numeral');
    }
    if (!current.__get) {
      error('Unexpected');
    }
    child = current.__get(prop);
    
    if (child === undefined) {
      next = codeRoot.Object.mk();
      current.set(prop,next);
      current = next;
    } else {
      if (!isNode(child)) {
        error('Conflict in createPath ',path.join('/'));
      }
      current = child;
    }
  });
  return current;
}
  

// gets own properties only
const getval = function (node,prop) {
  if (!node) {
    error('null v');
  }
  if (node.hasOwnProperty(prop)) {
    return node[prop];
  }
}


const separateFromParent = function (node) {
  let parent = getval(node,'__parent');
  if (parent) {
    let name = node.__name;
    if (Array.isArray(parent)) {
      parent[name] = undefined;
    } else {
      delete parent[name];
    }
  }
}

// assumes node[__name] is  child, or will be child. lifts if needed.
const adopt = function (node,name,ichild) {
  let child;
  if (!isObject(ichild)) {
    return;
  }
  if (isNode(ichild)) {
    child = ichild;
    separateFromParent(child);
  } else {
    child = lift(ichild);
  } 
  child.__name = name;
  child.__parent = node;
}

export let preSetChildHooks = [];
export let setChildHooks = [];

/* A property k of a node is watched if the field annotation "Watched" is set for that property. 
 * For watched fields, a change event is emitted of the form {id:change node:node property:__name}
 */

const setChild = function (node,name,child) {
  preSetChildHooks.forEach(function (fn) {fn(node,name);});
  adopt(node,name,child);
  node[name] = child;
  setChildHooks.forEach(function (fn) {
    fn(node,name,child);
  });
  
  let watched = node.__Watched;
  if (watched && watched[name]) {
  //if (node.__watched && node['__'+name+'_watched']) {
    let event = Event.mk('change',node);
    event.property=name;
    event.emit();
  }
}
/*
 * Fields (aka properties) can be annotated. More description needed here.
 */

ObjectNode.__getOwnFieldAnnotation = function (annotationName,prop) {
  let annotations = this.__get(annotationName);
  if (annotations === undefined) {
    return undefined;
  }
  return annotations[prop];
}



ObjectNode.__getFieldAnnotation = function (annotationName,prop) {
  let cp = this;
  while (true) {
    if (cp === ObjectNode) {
      return undefined;
    }
    let rs = cp.__getOwnFieldAnnotation(annotationName,prop);
    if (rs !== undefined) {
      return rs;
    }
    cp = Object.getPrototypeOf(cp);
  }
}
  

ObjectNode.__setFieldAnnotation = function (annotationName,prop,v) {
  let annotations = this.__get(annotationName);
  if (annotations === undefined) {
    annotations = this.set(annotationName,ObjectNode.mk());
  }
  if (Array.isArray(prop)) {
    prop.forEach(function (ik) {
      annotations[ik] = v;
    });
  } else {
    annotations[prop] = v;
    return v;
  }
}
 
const defineFieldAnnotation = function (functionName) {
  let annotationName = '__'+functionName;
  ObjectNode['__getOwn'+functionName] = function (k) {
    return this.__getOwnFieldAnnotation(annotationName,k);
  };
  ObjectNode['__get'+functionName] = function (k) {
    return this.__getFieldAnnotation(annotationName,k);
  };
  ObjectNode['__set'+functionName] = function (k,v) {
    return this.__setFieldAnnotation(annotationName,k,v);
  };
  ArrayNode['__get'+functionName] = function () {}
}
  
defineFieldAnnotation('Watched');

const watch = function (node,prop) {
  node.__setWatched(prop,1);
}

/* set has several variants
 * :
 *
 * x.set(name,v)  where name is a simple name (no /'s). This causes v to be the new child of x if v is a node, other wise just does x[name] = v
 *
 * x.set(path,v) where path looks like a/b/../name. This creates the path a/b/... if needed and sets the child name to v. Whatever part of the path
 * is already there is left alone.
 *
 * x.set(source)  extends x by source, in the sense of jQuery.extend in deep mode
 */

 
// returns val
ObjectNode.set = function (key,val) {
  let idx,path,name,parent;
  if (arguments.length === 1) {
    extend(this,key);
    return this;
  }
  if (typeof key ==='string') {
    idx = key.indexOf('/');
  } else { 
    idx = -1;
  }
  if (idx >= 0) {
    path = key.split('/');
    name = path.pop();
    parent = createPath(this,path);
  } else {
    parent = this;
    name = key;
  }
  if (!checkName(name)) {
    error('Ill-formed name "'+name+'". Names may contain only letters, numerals, and underbars, and may not start with a numeral');
  }
  setChild(parent,name,val);
  return val;
}

// this only works if key < length of the array

ArrayNode.set = function (key,val) {
  let ln = this.length;
  if (key >= ln) {
    error('Incorrect use of ArrayNode.set');
  }
  setChild(this,key,val);
  return val;
}

// adopts val below this if it is not already in a tree,ow just refers
const setIfExternal = function (parent,name,val) { 
  let tp = typeof val;
  if ((tp === 'object') && val && val.__get('__parent')) {
    parent[name] = val;
  } else {
    parent.set(name,val);
  }
  return val;
}

const setIfMissing = function (parent,prop,factory) {
  let rs = parent[prop];
  if (!rs) {
    rs = factory();
    parent.set(prop,rs);
  }
  return rs;
}

// Unless alwaysReplace is set, this similar to jquery.extend in deep mode: it merges source into dest. Note that it does not include properties from the prototypes.
// 
const extend = function (dest,source,merge) {
  let existingVal,newVal;
  if (!source) {
    return dest;
  }
  for (let prop in source) {
    if (source.hasOwnProperty(prop)) {
      newVal = lift(source[prop]);
      if (newVal === undefined) {
        continue;
      }
      if (merge) {
        existingVal = dest[prop];
        // merge if existingVal is a Object; replace otherwise
        if (existingVal && ObjectNode.isPrototypeOf(existingVal) && ObjectNode.isPrototypeOf(newVal)) {
          extend(existingVal,newVal);
        } else {
          dest.set(prop,newVal);
        }
      } else {
        dest.set(prop,newVal);
      }
    }
  }
  return dest;
}


const arrayToObject = function (aarray) {
  let rs = {};
  aarray.forEach(function (prop) {rs[prop] = 1;});
  return rs;
}

/*
let dd = {f:function (n){return n*3}};
let aa = {a:2,b:['a','b'],p:geom.Point.mk(3,4),f:function (n) {return n+n;}}
setProperties(dd,aa,['a','b','p','f']);
*/
// transfer properties from source. 
const setProperties = function (dest,source,props,fromOwn,dontCopy) {
  if (!source) {
    return;
  }
  if (!dest) {
    error('Bad arguments')
  }
  let destIsPJObject =  ObjectNode.isPrototypeOf(dest);
  if (props) {
    props.forEach(function (prop) {
      let sourceVal = fromOwn?getval(source,prop):source[prop];
      if (sourceVal !== undefined) {
        let srcIsTreeProp = false;
        let srcIsNode = isNode(sourceVal);
        if (srcIsNode) {
           srcIsTreeProp = treeProperty(source,prop,false,fromOwn);
        }
        let dontCopyVal = dontCopy || (!srcIsNode) || (!srcIsTreeProp);
        let sourceCopy = dontCopyVal?sourceVal:deepCopy(sourceVal);
        if (destIsPJObject && srcIsNode && srcIsTreeProp) {
          dest.set(prop,sourceCopy);
        } else {
          dest[prop] = sourceCopy;  
        }
      }
    });
  } 
  return dest;
}

const setPropertiesFromOwn = function (dest,source,props,dontCopy) {
  return setProperties(dest,source,props,true,dontCopy);
}

const setPropertiesIfMissing = function (dest,source,props,fromOwn) {
  if (!source) {
    return;
  }
  if (!dest) {
    error('Bad arguments')
  }
  if (props) {
    props.forEach(function (prop) {
      let sourceVal = fromOwn?getval(source,prop):source[prop];
      let destVal = fromOwn?getval(dest,prop):dest[prop];
      if ((sourceVal !== undefined) && (destVal === undefined) && !isObject(sourceVal)) {
        dest.set(prop,source[prop]);
      }
    });
  } 
  return dest;
}


ObjectNode.setIfMissing = function (settings) {
  let pnames = Object.getOwnPropertyNames(settings);
  pnames.forEach( (prop) => {
    let vl = this[prop];
    if (vl === undefined) {
      this[prop] = settings[prop];
    }
  });
}


// only for atomic values
const getProperties = function (source,props) {
  let rs = ObjectNode.mk();
  props.forEach(function (prop) {
    let sourceVal = source[prop];
    let type = typeof sourceVal;
    if ((sourceVal === null) || ((type !== 'undefined') && (type !== 'object'))) {
      rs[prop] = sourceVal;
    }
  });
  return rs;
}

// Some Array methods



ArrayNode.toArray = function () {
  let rs = [];
  this.forEach(function (e) {rs.push(e);});
  return rs;
}
const arrayPush = Array.prototype.push;
const arrayUnshift = Array.prototype.unshift;
const arraySplice = Array.prototype.splice;// only used in plain form

let addToArrayHooks = [];

let setNameInArray = function (array,child,n) { //called after the push
   if (isNode(child)) {
     child.__name = n;
     child.__parent = array;
  } else if (child && (typeof child==='object')) {
    error('Attempt to add non-node object to an Array');
  }
};

ArrayNode.push = function (element) {
  arrayPush.call(this,element);
  setNameInArray(this,element,this.length-1);
  addToArrayHooks.forEach((fn) => {fn(this,element);});
  return this.length;
}


ArrayNode.plainPush = function (element) {
  arrayPush.call(this,element);
}

ArrayNode.unshift = function (element) {
  arrayUnshift.call(this,element);
  setNameInArray(this,element,0);
  let ln = this.length;
  for (let i=1;i<ln;i++) {
    this[i].__name = i;
  }
  addToArrayHooks.forEach((fn) => {fn(this,element);});
  return this.length;
}

ArrayNode.plainUnshift = function (element) {
  arrayUnshift.call(this,element);
}



ArrayNode.plainSplice = function (start,deleteCount,element) {
  if (element !== undefined) {
    arraySplice.call(this,start,deleteCount,element);
  } else {
    arraySplice.call(this,start,deleteCount);
  }
}

ArrayNode.splice = function (start,deleteCount,element) {
  if (element !== undefined) {
    arraySplice.call(this,start,deleteCount,element);
    setNameInArray(this,element,start);
  } else {
    arraySplice.call(this,start,deleteCount);
  }
  let ln = this.length;
  for (let i=start;i<ln;i++) {
    this[i].__name = i;
  }
 if (element) {
    addToArrayHooks.forEach((fn) => {fn(this,element);});
 }
  return this.length;
}

  
ArrayNode.concat = function (elements) {
  let rs = ArrayNode.mk();
  this.forEach((element) => rs.push(element));
  elements.forEach((element) => rs.push(element));
  return rs;
}

ArrayNode.copy = function () {
  return this.concat([]);
}

ArrayNode.concatR = function (elements) {
  elements.forEach((element) => this.push(element))
  return this;
}

/* utilities for constructing Nodes from ordinary objects and arrays
 * recurses down to objects that are already nodes
 * o is an array or an object
 */

const toNode1 = function (parent,name,o) {
  let tp = typeof o;
  let  rs;
  if ((o === null) || (tp !== 'object')) {
    parent[name] =  o;
    return;
  }
  if (isNode(o)) {
    rs = o;
  } else {
    if (Array.isArray(o)) {
      rs = toArray(o,null);
    } else {
      rs = toObject(o,null);
    }
  }
  rs.__parent = parent;
  rs.__name = name;
  parent[name] = rs;
}

// transfer the contents of ordinary object o into idst (or make a new destination if idst is undefined)
const toObject= function (o,idest) {
  let dest,oVal;
  if (ObjectNode.isPrototypeOf(o)) {
    return o; // already a Object
  }
  if (idest) {
    dest = idest;
  } else {
    dest = ObjectNode.mk();
  }
  for (let prop in o) {
    if (o.hasOwnProperty(prop)) {
      oVal = o[prop];
      toNode1(dest,prop,oVal); 
    }
  }
  return dest;
}

const toArray = function (array,idest) {
  let dest;
  if (idest) {
    dest = idest;
  } else {
    dest = ArrayNode.mk();
  }
  array.forEach(function (element) {   
    dest.push(toNode(element));
  });
  return dest;
}

const toNode = function (o) {
  if (isNode(o)) {
    // idempotent
    return o;
  }
  if (Array.isArray(o)) {
    return toArray(o);
  } else if (o && (typeof o === 'object')) {
    return toObject(o);
  } else {
    return o;
  }
}

const lift = toNode;




// Some utilities for iterating functions over trees.

// internal __properties are excluded from the iterators and recursors 

let internalProps = {'__parent':1,'__protoChild':1,'__value__':1,'__hitColor':1,'__chain':1,'__copy':1,__name:1,widgetDiv:1,
  __protoLine:1,__inCopyTree:1,__headOfChain:1,__element:1,__domAttributes:1};

const internal = function (__name) {
   return internalProps[__name];
}


// a proper element of the tree: an own property with the right parent link. If includeLeaves, then atomic own properties are included too

const treeProperty = function (node,prop,includeLeaves,knownOwn) {
  let child;
  if ((!knownOwn && !node.hasOwnProperty(prop)) ||  internal(prop)) {
    return false;
  }
  child = node[prop];
  if (isNode(child)) {
    return child.__parent === node;
  } else {
    return includeLeaves?(typeof child !== 'object'):false;
  }
}


const externalProperty = function (node,prop) {
  let child = node[prop];
  return isObject(child) && getval(child,'__sourceUrl');
}

const treeProperties = function (node,includeLeaves) {
  let rs = [];
  let child,names,ln,i;
  if (ArrayNode.isPrototypeOf(node)) {
    ln = node.length;
    for (i = 0;i < ln;i++) {
      child = node[i];
      if (includeLeaves) {
        rs.push(i);
      } else if (isNode(child) && (child.__parent === node)) {
        rs.push(i);
      }
    }
    return rs;
  }
  names = Object.getOwnPropertyNames(node);
  names.forEach(function (name) {
    if (treeProperty(node,name,includeLeaves,true)) {
      rs.push(name);
    }
  });
  return rs;
}
  
// apply fn(node[prop],prop,node) to each non-internal own property p. 
const mapOwnProperties = function (node,fn) {
  let ownprops = Object.getOwnPropertyNames(node);
  ownprops.forEach(function (prop) {
     if (!internal(prop))  { 
      fn(node[prop],prop,node);
    }
  });
  return node;
}

const ownProperties = function (node) {
  let rs = [];
  mapOwnPropeties(node,function (child,prop) {
    rs.push(prop);
  });
  return rs; 
}

// apply fn(node[p],p,node) to each treeProperty p  of node. Used extensively for applying functions through a tree
const forEachTreeProperty = function (node,fn,includeLeaves,includeExternals) {
  let perChild = function (value,prop) {
    if ((includeExternals && externalProperty(node,prop)) || treeProperty(node,prop,includeLeaves,true))  { //true: already known to be an owned property
       fn(node[prop],prop,node);
    }
  }
  if (ArrayNode.isPrototypeOf(node)) {
    node.forEach(perChild);
  } else {
    let ownprops = Object.getOwnPropertyNames(node);
    ownprops.forEach((prop) => perChild(undefined,prop));
  }
  return this;
}

const forEachTreeOrExternalProperty = function (node,fn,includeLeaves) {
  forEachTreeProperty(node,fn,includeLeaves,true);
  return this;
}

const forSomeTreeProperty = function (node,fn,includeLeaves) {
  let found = undefined;
  let perChild = function (value,prop) {
     if (treeProperty(node,prop,includeLeaves,true))  { //true: already known to be an owned property
       let rs = fn(node[prop],prop,node);
       if (rs) {
         found = node[prop];
       }
    }
  }
  if (ArrayNode.isPrototypeOf(node)) {
    node.some(perChild);
  } else {
    let ownprops = Object.getOwnPropertyNames(node);
    ownprops.some(perChild.bind(undefined,undefined));
  }
  return found;
}

const forEachAtomicProperty = function (node,fn) {
  let perChild = function (notUsed,prop) {
    let value = node[prop];
    let tp = typeof value;
    if ((value === null) || ((tp !== 'object')  && (tp !== 'function'))) {
       fn(node[prop],prop,node);
    }
  }
  if (ArrayNode.isPrototypeOf(node)) {
    node.forEach(perChild);
  } else {
    let ownprops = Object.getOwnPropertyNames(node);
    ownprops.forEach(perChild.bind(undefined,undefined));
  }
  return this;
}

const forEachDescendant = function (fn,node=root) {
  fn(node);
  forEachTreeProperty(node,function (child) {
    forEachDescendant(fn,child);
  })
}


const crossTreeLinks = function (onode=root) {
  let accum = [];
  let recurse = function (node) {
    if (node.__name === 'prototypes') { // === stopAt) {
      return;
    }
    let nodePath = pathOf(node,root);
    let props = Object.getOwnPropertyNames(node);
    let prop;
    for (prop in node) {
      if (internal(prop))  {
        continue;
      }
      let child = node[prop];
      if (!isNode(child)) {
         continue;
      }
      if (treeProperty(node,prop,false,true)) {
        recurse(child);
      } else {
        let isOwn = node.hasOwnProperty(prop);
        // a cross tree link inherited from an external object counts as a cross tree link
        if (!isOwn) {
          let proto =  Object.getPrototypeOf(node);
          let isProtoOwn = proto.hasOwnProperty(prop);
          if (!(isProtoOwn && proto.__sourceUrl)) {
            continue;
          }
        }
        let childPath = pathOf(child,root);
        if (childPath) {
          let triple = [nodePath,prop,childPath];
          accum.push(triple);
        } else {
        //  debugger;//  child is not in the tree
        }
      }
    };
  }
  recurse(onode);
  return accum;
  }


const installLinks = function (links) {
  links.forEach(function (link) {
    // we want to preserve the links to prototypes
    if (link[2][0] === 'prototypes') {
      return;
    }
    let node = evalPath(link[0]);
    let prop = link[1];
    let child = evalPath(link[2]);
    if (node && child) {
      node[prop] = child;
    }
  });
}
  




const forSomeDescendant = function (node,fn) {
  if (fn(node)) {
    return node;
  }
  forSomeTreeProperty(node,function (child) {
    return forSomeDescendant(child,fn);
  })
}




const everyTreeProperty = function (node,fn,includeLeaves) { 
  let ownprops = Object.getOwnPropertyNames(node);
  return ownprops.every(function (prop) {
     if (treeProperty(node,prop,includeLeaves,true))  { //true: already known to be an owned property
       return fn(node[prop],prop,node);
    } else {
      return 1;
    }
  });
}


const someTreeProperty = function (node,fn,includeLeaves) { 
  let ownprops = Object.getOwnPropertyNames(node);
  return ownprops.some(function (prop) {
     if (treeProperty(node,prop,includeLeaves,true))  { //true: already known to be an owned property
       return fn(node[prop],prop,node);
    } else {
      return false;
    }
  });
}

 // if node itself has gthe propety, return true
const ancestorHasOwnProperty  = function (node,p) {
  let cv = node;
  while (cv) {
    if (cv.__get(p)) {
      return true;
    }
    cv = cv.__get('__parent');
  }
  return false;
}

ObjectNode.__inCore = function () {
  return ancestorHasOwnProperty(this,'__builtIn');
}

/* used eg for iterating through styles.
 * apply fn(node[p],p,node) to each atomic property of node, including properties defined in prototypes, but excluding
 * those defined in core modules.
 * sofar has the properties where fn has been called so far (absent except in the recursive call)
 */

const mapNonCoreLeaves = function (node,fn,allowFunctions,isoFar) {
  let soFar = isoFar?isoFar:{};
  if (!node) {
    error('Bad argument');
  }
  if (!node.__inCore || node.__inCore()) {
    return;
  }
  let op = Object.getOwnPropertyNames(node);
  op.forEach(function (prop) {
    let child,childType;
    if (soFar[prop]) {
      return;
    }
    if (!treeProperty(node,prop,true,true)) {
      return true;
    }
    soFar[prop] = 1;
    child = node[prop];
    childType = typeof child;
    if ((child && (childType === 'object' ))||((childType==='function')&&(!allowFunctions))) {
      return;
    }
    fn(child,prop,node);
  });
  let proto = Object.getPrototypeOf(node);
  if (proto) {
    mapNonCoreLeaves(proto,fn,allowFunctions,soFar);
  }
}
//reverts the atomic properties except those given
ObjectNode.__revertToPrototype = function (exceptTheseProperties) {
  let proto = Object.getPrototypeOf(this);
  let ownprops = Object.getOwnPropertyNames(this);
  let nonRevertable = this.__nonRevertable;
  ownprops.forEach((p) => {
    if (!exceptTheseProperties[p] && (!nonRevertable || !nonRevertable[p]) && (proto[p] !== undefined)) {
      let cv = this[p];
      if (typeof cv !== 'object') {
        delete this[p];
      }
    }
  });
}

ObjectNode.__differsFromPrototype =  function (exceptTheseProperties) {
  let proto = Object.getPrototypeOf(this);
  let ownprops = Object.getOwnPropertyNames(this);
  let ln = ownprops.length;
  let nonRevertable = this.__nonRevertable;
  let computedProperties = this.__computedProperties;
  for (let i=0;i<ln;i++) {
    let p = ownprops[i];
    let computed = computedProperties && computedProperties[p];
    if (!computed && !exceptTheseProperties[p] && (!nonRevertable || !nonRevertable[p])) {
      let pv = proto[p];
      let cv = this[p];
      if ((typeof cv !== 'object') && (cv !== pv)) {
        return true;
      }
    }
  }
  return false;
}


const deepApplyFun = function (node,fn) {
  fn(node);
  forEachTreeProperty(node,function (c) {
    deepApplyFun(c,fn);
  });
}
  


const deepDeleteProps = function (node,props) {
  deepApplyFun(node,function (ch) {
    props.forEach(function (p) {
      delete ch[p];
    });
  });
}



const deepDeleteProp = function (inode,prop) {
  deepApplyFun(inode,function (node) {
    delete node[prop]
  });
}

let findResult = [];
const findDescendant = function (node,fn) {
  const recurser = function (inode) {
    if (fn(inode)) {
      findResult[0] = inode;
      throw findResult;
    } else {
      forEachTreeProperty(inode,function (child) {
        recurser(child);
      });
    }
  }
  try {
    recurser(node);
  } catch(e) {
    if (e === findResult) {
      return e[0];
    } 
  }
}

const descendantWithProperty = function (node,prop) {
  return findDescendant(node,function (x) {
    return x[prop] !== undefined;
  });
}

const findAncestor = function (node,fn,excludeArrays) {
  let excluded;
  if (node===undefined) {
    return undefined;
  }
  excluded = excludeArrays && ArrayNode.isPrototypeOf(node);
  if ((!excluded) && fn(node)) {
    return node;
  }
  let parent = node.__get('__parent');
  return findAncestor(parent,fn,excludeArrays);
}



const findTopAncestor = function (inode,fn,excludeArrays) {
  let rs = undefined;
  const candidate = function (node) {
    let excluded = excludeArrays && ArrayNode.isPrototypeOf(node);
    return (!excluded) && fn(node);
  }
  let node = inode;
  while (node !== undefined) {
    if (candidate(node)) {
      rs = node;
      //return rs;
    }
    node = node.__get('__parent');
  }
  return rs;
}

const isDescendantOf = function (inode,ancestor,notTopCall) {
  let node = inode;
  if (node === undefined) {
    return undefined;
  }
  if ((node === ancestor) && notTopCall)  {
    return true;
  }
  return isDescendantOf(node.__get('__parent'),ancestor,true);
}

const ancestorThatInheritsFrom = function (node,proto) {
  return findAncestor(node,function (x) {
    return proto.isPrototypeOf(x)
  });
}

const ancestorWithProperty = function (node,prop) {
  return findAncestor(node,function (x) {
      return x[prop] !== undefined;
  },1);
}


const ancestorWithOwnProperty = function (node,prop) {
  return findAncestor(node,function (x) {
      return getval(x,prop) !== undefined;
  },1);
}


const ancestorWithPrototype = function (node,proto) {
  return findAncestor(node,function (x) {
      return proto.isPrototypeOf(x);
  },1);
}


const ancestorWithSourceUrl = function (node,source) {
  return findAncestor(node,function (x) {
      return x.__sourceUrl === source;
  },1);
}

const ancestorWithMethod = function (node,prop) {
  return findAncestor(node,function (x) {
    return typeof x[prop] === 'function';
  },1);
}


const ancestorWithName = function (node,name) {
  return findAncestor(node,function (x) {
    return x.__name === name;
  });
}




const ancestorWithoutProperty = function (node,prop) {
  return findAncestor(node,function (x) {
      return x[prop] === undefined;
  },1);
}



const ancestorWithPropertyTrue = function (node,prop) {
  return findAncestor(node,function (x) {
      return x[prop];
  },1);
}


const ancestorWithPropertyValue = function (node,prop,value) {
  return findAncestor(node,function (x) {
      return x[prop] === value;
  },1);
}

const ancestorWithPropertyFalse = function (node,prop) {
  return findAncestor(node,function (x) {
      return !x[prop];
  },1);
}

const containingData = function (node) {
   return findAncestor(node,function (x) {
     return (x.data) || (x.__internalData);
   });
}

const childName = function (parent,child) {
  let rs;
  forEachTreeProperty(parent,function (ch,nm) {
    if (ch === child) {
       rs = nm;
    }
  });
  return rs;
}
export let removeHooks = [];

// dontRemoveFromArray is used when all of the elements of an array are removed (eg  in removeChildren)
nodeMethod('remove',function (dontRemoveFromArray) {
  let parent = this.__parent;
  let isArray = ArrayNode.isPrototypeOf(parent);
  let __name = this.__name;
  removeHooks.forEach((fn) => {
      fn(this);
  });
  if (isArray) {
    if (!dontRemoveFromArray) {
      let idx = parent.indexOf(this);
      let ln = parent.length;
      for (let i=idx+1;i<ln;i++) {
        let child = parent[i];
        child.__name = i-1;
      }
      parent.splice(idx,1);
    }
  } else {
    let anm = __name;
    if (parent[anm] !== this)  { // check for ghost bug
      error('ghost bug back');
    }
    delete parent[anm];
  }
  return this;  
});

const fixTree = function (nd) {  // workaround for ghost bug. Not in use at the moment
  return;
  forEachDescendant((node) => {
    if (node !== nd) {
      let pr = node.__parent;
      let nm = node.__name;
      if (node !== pr[nm]) {
        debugger; //keep
        node.remove();
      }
    }
  },nd);
}

export let reparentHooks = [];

nodeMethod('__reparent',function (newParent,newName) {
  reparentHooks.forEach((fn) => {
      fn(this,newParent,newName);
  });
  adopt(newParent,newName,this);
  newParent[newName] = this;
  return this;  
});


const removeChildren =  function (node) {
  forEachTreeProperty(node,function (child) {
    child.remove(true);
  });
  if (ArrayNode.isPrototypeOf(node)) {
    node.length = 0;
  }
}





 



// without inheritance from prototype;  x.__get(prop) will return a value only if prop is a direct property of this
nodeMethod('__get',function (prop) { 
  if (this.hasOwnProperty(prop)) {
    return this[prop];
  }
  return undefined;
});

nodeMethod('parent',function () {
  return this.__get('__parent');
});

nodeMethod('__nthParent',function (n) {
  let cv = this;
  let i;
  for (i=0;i<n;i++) {
    cv = cv.__parent;
    if (!cv) {
      return undefined;
    }
  }
  return cv;
});

const climbCount = function (itm,ancestor) {
  let rs = 0;
  let citm = itm;
  while (true) {
    if (citm === ancestor) {
      return rs;
    } else if (!citm) {
      return undefined;
    } else {
      citm = citm.__get('__parent');
      rs++;
    }
  }
}


ObjectNode.name = function () {
  return this.__get('__name');
}


// in strict mode, the next 4 functions return undefined if c does not appear in s, ow the whole string
const afterChar = function (string,chr,strict) {
  let idx = string.indexOf(chr);
  if (idx < 0) {
    return strict?undefined:string;
  }
  return string.substr(idx+1);
}




const beforeChar = function (string,chr,strict) {
  let idx = string.indexOf(chr);
  if (idx < 0) {
    return strict?undefined:string;
  }
  return string.substr(0,idx);
}

  
const stripInitialSlash = function (string) {
  if (string==='') {
    return string;
  }
  if (string[0]==='/') {
    return string.substr(1);
  }
  return string;
}


const addInitialSlash = function (string) {
  if (string==='') {
    return string;
  }
  if (string[0]==='/') {
    return string;
  }
  return '/'+string;
}

const pathReplaceLast = function (string,rep,sep) {
  let sp = sep?sep:'/';
  let idx = string.lastIndexOf(sp);
  let  dr = string.substring(0,idx+1);
  return dr + rep;
}
  
 
const setIfNumeric = function (node,prp,v) {
  let n = parseFloat(v);
  if (!isNaN(n)) {
    this[prp] = v;
  }
}

/* an atomic property which does not inherit currently, but could,
 * in that there is a property down the chain with the same typeof
 */

const inheritableAtomicProperty = function (node,prop) {
  if (prop === 'backgroundColor') {
    return false;
  }
  if (!node.hasOwnProperty(prop)) {
    return false;
  }
  let proto = Object.getPrototypeOf(node);
  return (typeof node[prop] === typeof proto[prop]);
}
  
/* inheritors(root,proto,filter) computes all of the descendants of root
 * which inherit from proto (including proto itself) and for which the filter (if any) is true.
 */

 
nodeMethod('__root',function () {
  let pr  = this.__get('__parent');
  return pr?pr.__root():this;
});



const inheritors = function (proto,filter) {
  let rs = [];
  if (!isPrototype(proto)) {
    rs.push(proto);
    return rs;
  }
  let root = proto.__root();
  let recurser = function (node,iproto) {
    if ((iproto === node) || proto.isPrototypeOf(node)) {
      if (filter) {
        if (filter(node)) {
          rs.push(node);
        }
      } else {
        rs.push(node);
      }
    }
    forEachTreeProperty(node,function (child) {
      recurser(child,iproto);
    });
  }
  recurser(root,proto);
  return rs;
}


const forInheritors = function (proto,fn,filter) {
  let root = proto.__root();
  const recurser = function (node,iproto) {
    if ((iproto === node) || proto.isPrototypeOf(node)) {
      if ((filter && filter(node)) || !filter) {
        fn(node)
      }
    }
    forEachTreeProperty(node,function (child) {
      recurser(child,iproto);
    });
  }
  recurser(root,proto);
}


const forSomeInheritors = function (proto,fn) { 
  let rs = 0;
  let root = proto.__root();
  const recurser = function (node,iproto) {
    
    if ((iproto === node) || iproto.isPrototypeOf(node)) {
      if (fn(node)) {
        rs = 1;
      } else {
        forEachTreeProperty(node,function (child) {
          recurser(child,iproto);
        });
      }
    }
    return rs;
  }
  recurser(root,proto);
  return rs;
}
 
const garbageCollectPrototypes = function () {
  let protos = root.prototypes;
  if (!protos) {
    return;
  }
  let props = [];
  forEachTreeProperty(protos,(proto,prop) => {
    let inh = inheritors(proto);
    if (inh.length < 2) {
      props.push(prop);
    }
  });
  return props;
}
      

// the first protopy in node's chain with property prop 
const prototypeWithProperty = function (node,prop) {
  if (node[prop] === undefined) {
    return undefined;
  }
  let rs = node;
  while (true) {
    if (rs.__get(prop)) {
      return rs;
    }
    rs = Object.getPrototypeOf(rs);
    if (!rs) {
      return undefined;
    }
  }
}

// the first prototype in node's chain with property prop whose value is val
const prototypeWithPropertyValue = function (node,prop,val) {
  if (node[prop] === undefined) {
    return undefined;
  }
  let rs = node;
  while (true) {
    let cval = getval(rs,prop);
    if (cval === val) {
      return rs;
    }
    rs = Object.getPrototypeOf(rs);
    if (!rs) {
      return undefined;
    }
  }
}
// one of prototypes in the chain has this source

const hasSource = function (node,url) {
  return Boolean(prototypeWithPropertyValue(node,'__sourceUrl',url));
}
  
  
  
  
// maps properties to sets (as Arrays) of  values.
let MultiMap = ObjectNode.mk();

MultiMap.mk = function () {
  return Object.create(MultiMap);
}

MultiMap.setValue = function(property,value) {
  let cv = this[property];
  if (!cv) {
    cv = ArrayNode.mk();
    this.set(property,cv);
  }
  cv.push(value);
}

// array should contain strings or numbers
const removeDuplicates = function(array) {
  let rs;
  if (ArrayNode.isPrototypeOf(array)) {
    rs = ArrayNode.mk();
  } else {
    rs = [];
  }
  let d = {};
  array.forEach(function (v) {
    if (d[v] === undefined) {
      rs.push(v);
      d[v] = 1; 
    }
  });
  return rs;
}

const removeFromArray = function (array,value) {
  let index = array.indexOf(value);
  if (index > -1) {
    array.splice(index,1);
  }
  return array;
}

const addToArrayIfAbsent = function (array,value) {
  let index = array.indexOf(value);
  if (index === -1) {
    array.push(value);
  }
  return array;
}
          
      
  

/* a utility for autonaming. Given seed nm, this finds a __name that does not conflict
 * with children of avoid, and has the form nmN, N integer. nm is assumed not to already have an integer at the end
 * Special case. nm might be a number (as it will be when derived from the name of an array element). In this case, nm is replaced
 * by "N" and the usual procedure is followed
 */

 
 const removeTrailingDigits = function (nm) {
    let ln = nm.length;
    for (let i = ln-1;i>=0;i--) {
       let c = nm.charCodeAt(i);
       if ((c <48) || (c > 57)) {
          return nm.substring(0,i+1);
       }
    }
    return 'n';
 }
 
 const autoname = function (avoid,inm) {
    let maxnum = -1;
    let anm;
    let nm = (typeof inm === 'number')?'n':inm;
    nm = removeTrailingDigits(nm);
    if (!avoid[nm]) {
      return nm;
    }
    let nmlength = nm.length;
    for (anm in avoid) {
      if (anm === nm) {
        continue;
      }
      let idx = anm.indexOf(nm);
      if (idx === 0) {
        let rst = anm.substr(nmlength);
        if (!isNaN(rst)) {
          maxnum = Math.max(maxnum,parseInt(rst));
        }
      }
    }
  let num = (maxnum === -1)?1:maxnum+1;
  return nm + num;
}

  
const fromSource = function (x,src) {
    if (x && (typeof x==='object')) {
      if ((x.__sourceUrl) && (x.__sourceUrl === src)) {
        return true;
      } else {
        let pr = Object.getPrototypeOf(x);
        return fromSource(pr,src);
      } 
    } else {
      return false;
    }
  }

  
nodeMethod("__inWs",function () {
  if (this === root) {
    return true;
  }
  let pr = this.__get('__parent');
  if (!pr) {
    return false;
  }
  return pr.__inWs();
});

//last in the  work space which satisfies fn
ObjectNode.__lastInWs = function (returnIndex,fn) {
  let current = this;
  let n = 0;
  let last = current;
  if (last.__inWs() && (!fn || fn(last))) {
    current = Object.getPrototypeOf(last);
    while (current.__inWs() && (!fn || fn(current))) {
      n++;
      last = current;
      current = Object.getPrototypeOf(last);
    }
    return returnIndex?n:last;
  }
  return returnIndex?-1:undefined;
}

nodeMethod('__size',function () {
  let n=0;
  if (ObjectNode.isPrototypeOf(this)) {
    forEachTreeProperty(this,function () {
      n++;
    },1);
    return n;
  } else {
    return this.length;
  }
});



ObjectNode.__namedType = function () { // shows up in the inspector
  this.__isType = 1;
  return this;
}

const countDescendants = function (node,fn) {
  let rs = 0;
  forEachDescendant(function (d) {
    rs +=  fn?(fn(d)?1:0):1;
  },node);
  return rs;
}

const numericalSuf = function (string) {
  let i,c,ln;
  let n = Number(string);
  if (!isNaN(n)) {
    return n;
  }
  ln = string.length;
  for (i=ln-1;i>=0;i--) {
    c = string[i];
    if (isNaN(Number(c))) { //that is, if c is a digit
      return Number(string.substring(i+1));
    }
  }
  return Number(string);
}

const numZeros = function (n) { // how many zeros after decimal point for numbers less than 1 and  > 0
  return (n < 0.00000001) || (n>=1)?0:numZeros(10*n)+1;
}

// c = max after decimal place, if abs(1) ow num digits after the zeros
const nDigits = function (n,d) {
  let ns,dp,ln,bd,ad,boost,boosted,rs;
  if (typeof n !=="number") {
    return n;
  }
  let nzeros = numZeros(Math.abs(n));
  if (nzeros > 0) {
    boost = Math.pow(10,nzeros); // to boost abs(n) above 1
    boosted = n*boost;
  } else {
    boosted = n;
  }
  let pow = Math.pow(10,d);
  let unit = 1/pow;
  let rounded = Math.round(boosted/unit)/pow;
  ns = String(rounded);
  if (nzeros > 0) {
    let fd,rd,minus;
    if (n < 0) {
      fd = ns[1];
      rd = ns.substring(3);
      minus = '-';
    } else {
      fd = ns[0];
      rd = ns.substring(2);
      minus = '';
    }
    rs = minus+"."+('0'.repeat(nzeros-1))+fd+rd; 
    /*let rs2 = rounded/boost;
    let diff = Math.abs(Number(rs)-n);
    if (diff > 0.00001) {
      console.log('diff',diff);
      debugger; //keep
    }*/
   return Number(rs);
  }
  dp = ns.indexOf(".");
  if (dp < 0) {
    rs = ns;
  } else {
    ln = ns.length;
    if ((ln - dp -1)<=d) {
      rs = ns;
    } else {
      bd = ns.substring(0,dp);
      ad = ns.substring(dp+1,dp+d+1)
      rs = bd + "." + ad;
    }
  }
  return Number(rs);
}

ArrayNode.__copy = function (copyElement) {
  let rs = ArrayNode.mk();
  let ln = this.length;
  let i,ce;
  for (i=0;i<ln;i++) {
    ce = this[i];
    if (copyElement) {
      rs.push(copyElement(ce));
    } else {
      rs.push(ce);
    }
  }
  return rs;  
}
// deep for the tree, but not for the prototype chains; copies own properties and not prototypes
// not completely general - cross tree links are skipped
const deepCopy = function (x) {
  if ((x === null) || (typeof x !== 'object')) {
    return x;
  }
  let proto = Object.getPrototypeOf(x);
  let rs = Object.create(proto);
  const perChild = function (child,hasParent) {
    let cp = deepCopy(child);
    if (hasParent) {
      cp.__parent = rs;
    }
    return cp;
  }
  if (Array.isArray(x)) {
    x.forEach(function (child) {
      let childHasParent = child && (typeof child === 'object') && child.__parent;
      rs.push(perChild(child,childHasParent));
    });
    return rs;
  }
  if (typeof x === 'object') {
     let ownprops = Object.getOwnPropertyNames(x);
     ownprops.forEach(function (prop) {
       if (prop === '__parent') {
        return;
       }
       let child = x[prop];
       let childHasParent = child && (typeof child === 'object') && child.__parent;
       if (childHasParent) {
         if (child.__parent !== x) {
           return;  // skip cross-tree link
         }
       }
       rs[prop] = perChild(child,childHasParent);
     });
     return rs;
  }
}

const objectifyArray = function (a) {
  let rs  = ObjectNode.mk();
  a.forEach(function (element) {
    rs[element] = 1;
  });
  return rs;
}

ObjectNode.setComputedProperties = function (a) {
  this.set('__computedProperties',objectifyArray(a));
}

ObjectNode.add = function (child,ikey) {
  let key = ikey?ikey:'X';
  let nm = autoname(this,key);
  this.set(nm,child);
  return child;
}
  
// an item is a  node suitable for use in  the main tree (if used with the svg dom, an svg group element)
let newItem = function () {
  return objectNode.mk();
}


const setItemConstructor = function (f) {
  newItem = f;
}

vars.installPrototypeDisabled = false;


// in the standard setup, the protypes are kept together under root.prototypes
// accepts either  of the forms installPrototype(proto) or installPrototype(id,proto)

  
 // the prototypes are kept together under root.prototypes
 
const installPrototype = function (iid,iprotoProto) {
 let id,protoProto;
 // allow just one argument, the protoProto
 if (iprotoProto) {
   protoProto = iprotoProto;
   id = iid
 } else {
  protoProto = iid;
  id = 'x';
 }
  let protos = root.prototypes;
  if (!protos) {
    protos = root.set('prototypes',newItem());
    protos.visibility = "hidden";
  }
  let external = protoProto.__get('__sourceUrl');
 // if (external) {
 // let rs = protoProto.instantiate();
  let rs = external?protoProto.instantiate():protoProto;// assemblies will not be external
  rs.visibility = 'hidden'; // a forward reference of sorts
  let anm = autoname(protos,id);
  protos.set(anm,rs);
  if (rs.initializePrototype) {
    rs.initializePrototype();
  }
  return rs;
 // } else {
 //   error('unexpected in installPrototype');
  //}
}

/* assignPrototypes(dest,nm,proto) is equivalent to 
  let dproto = Object.getPrototypeOf(dest);
  dproto[nm] = installPrototype(nm,proto);
  
  A series of pairs is supported assignPrototype(dest,nm1,proto1,nm2,protot2 ...)
  used for the common pattern of assigning a replaceable prototype as a parameter in a a components
*/


const assignPrototypes = function (dest,...assignments) {
  let dproto = dest;//Object.getPrototypeOf(dest);
  let ln = assignments.length;
  if (ln%2 === 1) {
    error('expected assignPrototypes(dest,nm1,proto1,nm2,proto2...)');
  }
  let hln = ln/2;
  for (let i=0;i<hln;i++) {
    let nm = assignments[i*2];
    let proto = assignments[i*2+1];
    //if (!dproto[nm]) {
      dproto[nm] = installPrototype(nm,proto);
    //}
  }
}  


const assignPrototype = function (dest,nm,proto) {
  assignPrototypes(dest,nm,proto);
}
  
   
const replacePrototype = function (where,id,replacementProto) {
  let replaced = where[id];
  let nm = replaced.__name;
  let protos = root.prototypes;
  let anm = autoname(protos,nm);
  let external = replacementProto.__get('__sourceUrl');
 let rs = external?replacementProto.instantiate():replacementProto;
  rs.visibility = "hidden"; // a forward reference of sorts
  protos.set(anm,rs);
  where[id] = rs;
  return rs;
}



const isPrototype = function (node) {
  let rs = findAncestor(node, (anc) => (anc.__name === 'prototypes'));
  return rs;
}



// just a short synonym to save typing when debugging
const pOf = function(x) {
  return Object.getPrototypeOf(x);
}

// value should be primitive (string,value,boole)
ObjectNode.setActiveProperty = function (prop,value) {
  if (this.hasOwnProperty(prop)) {
    this[prop] = value;
  } else {
    let proto = Object.getPrototypeOf(this);
    proto[prop] = value;
  }
}



const externalToTree = function (node) {
  return Boolean((node!==root) && ((!getval(node,'__parent')) || ancestorWithOwnProperty(node,'__builtIn') || ancestorWithOwnProperty(node,'__sourceUrl')));
}
const crossLinks = function (node) {
  let rs = [];
  let props = Object.getOwnPropertyNames(node);
  props.forEach((p) => {
    if (p === '__parent') {
      return;
    }
    let child = node[p];
    if (child && (typeof child === 'object') && (!externalToTree(child))) {
      if (child.__name !== p) {
        rs.push(p);
      }
    }
  });
  return rs;
}
 
 const allCrossLinks = function (node) {    
  let rs = [];
  const R = (nd) => {
    if (externalToTree(nd)) {
      return;
    }
    let links = crossLinks(nd);
    if (links.length > 0) {
      links.forEach((p) => rs.push([nd.__name,p]));
    }
    let proto = Object.getPrototypeOf(nd);
    R(proto);
    forEachTreeProperty(nd,R);
  }
  R(node);
  return rs;
}
    
    
const referencedPrototypes = function () {
  //debugger;
  let rs = [];
  let protos = root.prototypes;
  const recurse = (nd) => {
    if (nd === protos) {
      return;
    }
    if (ancestorHasOwnProperty(nd,'__builtIn') || ancestorHasOwnProperty(nd,'__sourceUrl')) {
      return;
    }
    let proto = Object.getPrototypeOf(nd);
    if (getval(proto,'__parent') === protos) {
      let nm = proto.__name;
      if (rs.indexOf(nm) === -1) {
        rs.push(nm) ;
      }
    }
    recurse(proto);
    forEachTreeProperty(nd,recurse);
  }
  recurse(root);
  return rs;
}

const removeUnusedPrototypes = function () {
  if (!root.prototypes) {
    return;
  }
  let refs = referencedPrototypes();
  let unreffed = [];
  forEachTreeProperty(root.prototypes,(proto) => {
    if (refs.indexOf(proto.__name) === -1) {
      unreffed.push(proto);
    }
  });
  unreffed.forEach((proto) => proto.remove());
}
    
 


    


export {defineFieldAnnotation,nodeMethod,extend,setProperties,getval,internal,crossTreeLinks,garbageCollectPrototypes,
        mapNonCoreLeaves,treeProperty,mapOwnProperties,lift,forEachTreeProperty,stripInitialSlash,descendantWithProperty,
        isNode,ancestorHasOwnProperty,isAtomic,treeProperties,autoname,removeChildren,beforeChar,afterChar,
        isDescendantOf,findAncestor,ancestorWithProperty,ancestorWithPropertyFalse,ancestorWithPropertyTrue,ancestorWithPropertyValue,
        nDigits,evalPath,inheritors,forInheritors,pathToString,climbCount,pOf,setPropertiesIfMissing,pathOf,
        isObject,hasSource,findDescendant,stringPathOf,isPrototype,containingData,referencedPrototypes,removeUnusedPrototypes,
        newItem,setItemConstructor,installPrototype,replacePrototype,addToArrayHooks,
        deepCopy,allCrossLinks,assignPrototypes,assignPrototype
        };
// Copyright 2019 Chris Goad
// License: MIT

/* a trivial exception setup.  System is meant to indicate which general system generated the error
 * (eg instantiate, install, externalize, or  what not.
 */

let Exception = {};

let throwOnError = false;
let debuggerOnError = true;

Exception.mk = function (message,system,value) {
  let rs = Object.create(Exception);
  rs.message = message;
  rs.system = system;
  rs.value = value;
  return rs;
}

// A default handler
Exception.handler = function () {
  let msg = this.message;
  if (this.system) {
    msg += ' in system '+this.system;
  }
  log('error',msg);
}


const error = function (msg,sys) {
  if (sys) {
    log('error',msg+sys?' from '+sys:'');
  } else {
    log('error',msg);
  }
  if (debuggerOnError) {
    debugger; //keep
  }
  if (throwOnError) {
    let ex = Exception.mk(msg,sys);
    throw ex;
  }
}

export {error};
// Copyright 2019 Chris Goad
// License: MIT

/* When a Object has a method called update, the state of that node is maintained by application of that method
 * when there are changes. Some nodes within the tree might be generated by update, and in that case, the node is marked computed.
 * Independently, the atomic values of some properties might be set by update, and in that case, the property might me marked computed.
 * Typically, the latter marking is made on the prototype (eg, if width of a bar is computed, this fact is declared in the prototype of the bar)
 */


const declareComputed = function (node) {
  node.__computed = 1; 
  return node;
}

defineFieldAnnotation("computed");  // defines __setComputed and __getComputed

const isComputed = function (node,k,id) {
  let d = id?id:0;
  if (d > 20) {
     error('update','stack overflow'); 
  }
  if (!node) {
    return false;
  }
  if (node.__computed) {
    return true;
  }
  if (k && node.__getcomputed(k)) {
    return true;
  }
  
  return isComputed(node.__get('__parent'),undefined,d+1);
}


let updateCount = 0;
let catchUpdateErrors = false;// useful off for debugging;

let displayError;

const setDisplayError = function (fn) {
  displayError = fn;
}

const updateErrorHandler = function (node,e) {
  debugger; //keep
  let msg = e.message + ' in update';
  let src = node.__sourceUrl;
  if (src) {
    msg += ' from '+src;
  } else {
    let name = node.__name;
    if (name) {
      msg += ' of '+name;
    }
  }
  error(msg);
  if (displayError) {
    displayError(msg);
  }
}

let preUpdateHooks = [];

let updateFilter;

const setUpdateFilter = function (fn) {
  updateFilter = fn;
}

ObjectNode.__update = function () {
  if (!this.update) {
    return;
  }
  if (updateFilter  && !updateFilter(this)) {
    return;
  }
  let inhs = inheritors(this);
  if (inhs.length > 1) {
    inhs.forEach((inh) => {
      if (inh !== this) {
        inh.__update();
      }
    });
    return;
  }
  preUpdateHooks.forEach((f) => {f(this)});
  log('update','__updating ',this.__name);
  if (catchUpdateErrors) {
    try {
      this.update.apply(this,arguments);     
    } catch(e) {
      updateErrorHandler(this,e);
      return;
    }
  } else {
    this.update.apply(this,arguments);
  }
  this.__newData = 0;
  if (this.__updateCount) {
    this.__updateCount++;
  } else {
    this.__updateCount = 1;
  }
}

ObjectNode.__initialize = function () {
  if (this.initialize) {
    this.initialize();
  }
}

const forEachPart = function (node,fn,filter) {
  forEachTreeProperty(node,function (child) {
    if (child.update) {
      if (!filter || filter(child)) {
        fn(child);
      }
    } else {
      forEachPart(child,fn,filter);
    }
  });
}

ObjectNode.__updateAndDraw = function () {
  this.__update();
  this.draw();
}

const partsFromSource = function (src) {
  let rs = ArrayNode.mk();
  forEachPart(function () {
    if (fromSource(src)) {
      rs.push(src);
    }
  })
  return rs;
}
const partAncestor = function (node) {
  let rs = node;
  while (1) {
    if (rs.update) {
      return rs;
    }
    let pr = rs.__get('__parent');
    if (pr) {
      rs = pr;
    } else {
      return rs;
    }
  }
}
  
  


const updateParts = function (node,filter) {
  let updateLast = [];
  forEachPart(node,function (inode) {
    if (inode.__updateLast) {
      updateLast.push(inode);
    } else {
      inode.__update();
    }
  },filter);
  updateLast.forEach(function (inode) {
    inode.__update();
  });
}

const updateInheritors = function (node,filter) {
  forInheritors(node,function (x) {x.__update()},filter);
}

const updateRoot = function (filter) {
  if (root && root.update && (!filter || filter(root)))  {
    root.__update();
  } else if (root) {
      updateParts(root,filter);
  }
}

const updateAncestors = function (node) {
  if (node) {
    node.__update();
    updateAncestors(node.__parent);
  }
}


const resetArray = function (node,prop) {
  let child = node.__get(prop); 
  if (child) {
    removeChildren(child);
  } else {
    child = node.set(prop,ArrayNode.mk());
  }
  return child;
}

const resetComputedArray = function (node,prop) {
  let child = resetArray(node,prop);
  declareComputed(child);
  return child;
}


// data might be internal, in which case the __internalData and __internalDataString are set, or external, in which case .data is a value with a __sourceUrl

const getData = function (node,idata) {
  if (idata) {
    if (getval(idata,'__sourceUrl')) {
      node.data = idata;
    } else {
      let data = core.lift(idata);
      if (data.__parent) {
        node.data = data;
      } else {
        node.set('data',data);
      }
    }
    return node.data;
  } 
  if (node.__internalData) {
    return node.__internalData;
  }
  if (node.data) {
    return node.data;
  }
  
  let indata = node.__internalDataString;
  if (indata) {
    let data = lift(JSON.parse(indata));
   // data.__computed = true;
    node.set("__internalData",data);
    return data;
  }
  
  
}

const setDataString = function (node,str) {
  node.__internalDataString = str;
  node.__internalData = undefined; // getData will now update __internalData from __internalDataString
}

ObjectNode.initializeData = function (dataString) {
   this.__internalDataString = dataString;
   this.__internalData = undefined;
   return getData(this);
}



// create a new fresh value for node[prop], all set for computing a new state

const resetComputedObject = function (node,prop,factory) {
  let value = node.__get(prop),
    newValue;
  if (value) {
    removeChildren(value);
  } else {
    if (factory) {
      newValue = factory();
    } else {
      newValue = ObjectNode.mk();
    }
    value = node.set(prop,newValue);
  }
  declareComputed(value);
  return value;
}
 
 //resetComputedDNode = pj.resetComputedObject; // old name
 
/* if stash is nonnull, save the computed nodes to stash
 * the stash option is used when saving an item, but wanting its state to persist after the save
 */

const removeComputed = function (node,stash) {
  let  found = 0;
  let computedProperties = node.__computedProperties;
  forEachTreeProperty(node,function (child,prop) {
    if (prop === "__required") {
      return;
    }
    let tp = typeof child;
    if (!child || (tp !== 'object')) {
      if (computedProperties && (tp === 'string') && computedProperties[prop]) {
        stash[prop] = child;
        node[prop] = '';
        return 1;
      }
      return 0;
    }
    if (child.__computed) {
      found = 1;
      if (stash) {
        stash[prop] = child;
      }
      if (ArrayNode.isPrototypeOf(child)) {
        node.set(prop,ArrayNode.mk());
      } else {
        child.remove();
      }
    } else {
      let stashChild;
      if (stash) {
        stashChild = stash[prop] = {__internalNode:1};
      } else {
        stashChild = undefined;
      }
      if (removeComputed(child,stashChild)) {
        found = 1;
      } else {
        if (stash) {
          delete stash[prop];
        }
      }
    }
  },true);
  return found;
}


const restoreComputed = function (node,stash) {
  for (let prop in stash) {
    if (prop === '__internalNode') {
      continue;
    }
    let stashChild = stash[prop];
    if (!stashChild) {
      return;
    }
    if (typeof stashChild === 'string') {
      node[prop] = stashChild;
      return;
    }
    if (stashChild.__internalNode) {
      restoreComputed(node[prop],stashChild);
    } else {
      node[prop] = stashChild;
    }
  }
}
  
export {updateRoot,updateParts,isComputed,setUpdateFilter,setDisplayError,displayError,getData,setDataString,
removeComputed,restoreComputed,resetComputedArray,resetComputedObject,declareComputed};
// Copyright 2019 Chris Goad
// License: MIT


// For monitoring.


let instantiateCount = 0;
let internalChainCount = 0;
  


let internalChain;
let includeComputed = false;
let headsOfChains; // for cleanup

/* Here is the main function, which is placed up front to clarify what follows.
 * If count is defined, it tells how many copies to deliver.
 */


ObjectNode.instantiate = function (count) {
  let n = count?count:1;
  let multiRs,singleRs;
  if (n>1) {
    multiRs = [];
  }
  internalChain = false;
  headsOfChains = [];
  markCopyTree(this);
  addChains(this);
  // recurse through the tree collecting chains
  collectChains(this);
  // the same chains can be used for each of the n
  // instantiations
  for (let i=0;i<n;i++) {
    buildCopiesForChains(); // copy them
    buildCopiesForTree(this); // copy the rest of the tree structure
    singleRs = stitchCopyTogether(this);
    clearCopyLinks(this);
    if (n > 1) {
      multiRs.push(singleRs);
    }
  }
  cleanupSourceAfterCopy(this);
  theChains = [];
  instantiateCount++;
  if (internalChain) {
    internalChainCount++;
  }
  headsOfChains.forEach(function (x) {
    delete x.__headOfChain;
  });
  return (n>1)?multiRs:singleRs;
}

let theChains = [];



const markCopyTree = function (node) {
  if (node.__const) {
    return;
  }
  node.__inCopyTree = 1;
  if (includeComputed || !node.__computed) {
    forEachTreeProperty(node,function (c) {
      markCopyTree(c);
    });
  }
}

/* Compute the prototype chain for a node - an explicit array of the prototypes.
 * The argument chainNeeded is true when addToChain is called from an object up the chain, rather than the tree recursor
 * We don't bother with chains of length 1.
 */


const addChain = function (node,chainNeeded) {
  if (node.hasOwnProperty('__chain')) {
    return node.__chain;
  }
  let proto = Object.getPrototypeOf(node);
  let typeOfProto = typeof proto;
  let chain;
  if (((typeOfProto === 'function')||(typeOfProto === 'object')) && (proto.__get('__parent'))) { //  a sign that proto is in the object tree
    // is it in the tree being copied?
    if (proto.__inCopyTree) {
      chain = addChain(proto,1).concat(); 
      // @todo potential optimization; pch doesn't need copying if chains don't join (ie if there are no common prototypes)
      internalChain = 1;
      chain.push(node);
    } else {
      // the chain terminates at node for copying purposes
      chain = [node];
    }
    node.__chain = chain;
    return chain;
  } else {
    // this has no prototype within the object tree (not just the copy tree)
    if (chainNeeded) {
      let rs = [node];
      node.__chain = rs;
      return rs;
    } else {
      return undefined;
    }
  }
}

const addChains = function (node) {
  if (node.__const) {
    return;
  }
  addChain(node);
  if (includeComputed || !node.__computed) {
    forEachTreeProperty(node,function (c) {
      addChains(c);
    });
  }
}

const collectChain = function (node) {
  let chain = node.__chain;
  if (chain && (chain.length > 1) &&(!chain.collected)) {
    theChains.push(chain);
    chain.collected = 1;
  }
}

const collectChains = function (node) {
  if (node.__const) {
    return;
  }
  collectChain(node);
  if (includeComputed || !node.__computed) {
    forEachTreeProperty(node,function (c) {
      collectChains(c);
    });
  }
}

const buildCopiesForChain = function (chain) { 
  /**
   * for [a,b,c], a is a proto of b, and b of c
   * current is the last member of the new chain. This is initially the
   * head of the chain back in the old tree.
   */
  let current = chain[0];
  let ln = chain.length;
  /**
   * build the chain link-by-link, starting with the head. proto is the current element of the chain.
   * Start with the head, ie chain[0];
   */
  for (let i=0;i<ln;i++) { 
    let proto = chain[i];
    let protoCopy = proto.__get('__copy');
    if (!protoCopy) {
      //anchor  protoCopy back in the original
      protoCopy = Object.create(current); 
      if (i === 0) {
        protoCopy.__headOfChain = 1;
        headsOfChains.push(protoCopy);
      }
      if (chain.__name) {
        protoCopy.__name = proto.__name;
      }
      proto.__copy = protoCopy;
    }
    current = protoCopy; 
  }
}

const buildCopiesForChains = function () {
  theChains.forEach(function (ch) {buildCopiesForChain(ch);});
}

// __setIndex is used for  ordering children of a Object (eg for ordering shapes), and is sometimes associated with Arrays.

const buildCopyForNode = function (node) {
  let cp  = node.__get('__copy');//added __get 11/1/13
  if (!cp) {
    if (ArrayNode.isPrototypeOf(node)) {
      cp = ArrayNode.mk();
      let setIndex = node.__setIndex;
      if (setIndex !== undefined) {
        cp.__setIndex = setIndex;
      }
    } else {
      cp = Object.create(node);
    }
    node.__copy = cp;
    cp.__headOfChain = 1;
    headsOfChains.push(cp);

  }
}

// prototypical inheritance is for Objects only


const buildCopiesForTree = function (node) { 
  if (node.__const) {
    return;
  }
  buildCopyForNode(node);
  if (includeComputed || !node.__computed) {
    forEachTreeProperty(node,function (child) {
      if (!child.__head) {  // not declared as head of prototype chain
        buildCopiesForTree(child);
      }  
    });
  }
}


const stitchCopyTogether = function (node) { // add the __properties
  if (node.__const) {
    return;
  }
  let isArray = ArrayNode.isPrototypeOf(node),
    nodeCopy = node.__get('__copy'),
    ownProperties,thisHere;
  if (!nodeCopy) {
    error('unexpected');
  }
  if (node.__computed) {
    nodeCopy.__computed = 1;
    if (!includeComputed) {
      return nodeCopy;
    }
  }
  ownProperties = Object.getOwnPropertyNames(node);
  thisHere = node;
  // perChild takes care of assigning the child copy to the  node copy for Objects, but not Arrays
  const perChild = function (prop,child,iisArray) {
      let childType = typeof child, 
        childCopy,treeProp;
      if (child && (childType === 'object')  && (!child.__head)) {
        childCopy = getval(child,'__copy');
        treeProp =  getval(child,'__parent') === thisHere; 
        if (childCopy) {
          if (!iisArray) {
            nodeCopy[prop]=childCopy;
          }
          if (treeProp) {
            childCopy.__name = prop;
            childCopy.__parent = nodeCopy;
          }
        }
        if (treeProp)  {
          stitchCopyTogether(child);
        }
        return childCopy;
      } else {
        if (iisArray) {
          return child;
        } else {
          // atomic properties of nodes down the chains need to be copied over, since they will not be inherited
          if (!nodeCopy.__get('__headOfChain')) {
            nodeCopy[prop] = child; 
          }
        }
      }
    }
  if (isArray) {
    node.forEach(function (ichild) {
      nodeCopy.push(perChild(null,ichild,1));
    });
  } else {
    ownProperties.forEach(function (prop) {
      if (!internal(prop)) {
        perChild(prop,thisHere[prop]);
      }
    });
  }
  return nodeCopy;
}


const cleanupSourceAfterCopy1 = function (node) {
  delete node.__inCopyTree;
  delete node.__chain;
  delete node.__copy;
  delete node.__headOfChain;
}


const cleanupSourceAfterCopy = function (node) {
  if (node.__const) {
    return;
  }
  cleanupSourceAfterCopy1(node);
  if (includeComputed || !node.__computed) {
    forEachTreeProperty(node,function (c) {
      cleanupSourceAfterCopy(c);
    });
  }
}

const clearCopyLinks = function (node) {
  deepDeleteProp(node,'__copy');
}


// A utility: how many times is x hereditarily instantiated within this?
ObjectNode.__instantiationCount = function (x) {
  let rs = 0;
  if (x.isPrototypeOf(this)) {
    rs = 1;
  } else {
    rs = false;
  }
  forEachTreeProperty(this,function (v) {
    let c = v.__instantiationCount(x);
    rs = rs +c;
  });
  return rs;
}

ArrayNode.__instantiationCount = ObjectNode.__instantiationCount;

// instantiate the  Object's  prototype
ObjectNode.__clone = function () {
  let p = Object.getPrototypeOf(this);
  if (ObjectNode.isPrototypeOf(p)) {
    return p.instantiate();
  } else {
    error("Attempt to clone a non-Object",this.__name);
  }
}// Copyright 2019 Chris Goad
// License: MIT

/* Serialization of prototype trees.
 * Technique: each node in the JavaScript graph constituting the prototype tree is assigned a code (either a number or string). 
 * Then, objects are assembled which describe each node N by assiging attributes to its code.
 * These  are packaged together into a  single object R, which is serialized as JSON.
 * 
 *  The codes for nodes which are internal to the prototype are sequential integers starting with 0.
 *  Codes for objects referenced by the prototype, but external to it, are needed too.  Such external objects might have been
 *  loaded separately, or built into the application. In any case, external codes have 
 *  the form xN for sequential non-negative integers N.
 *  
 *  Here are the  properties of R  which represent the attributes of nodes N with codes C
 *  (1)  R.atomicProperties, an array. R.atomicProperties[C] is  an object which has the same values for atomic-valued properties
 *       as does N; however function values f are encoded by [f.toString()]
 *  (2) R.children, an array. R.children[C]  is an object which maps each object-valued property P of N
 *    to the code for the value of N.P
 *  (3) R.arrays.  An object where R.arrays[C] is defined when N is an array.  R.arrays[C] === length(N).
 *  (4) R.chains: this  contains an array of prototype-chain descriptions, one per head-of-chain. Each description is an array of the codes
 *    of nodes in the chain. Each chain description ends  with the code for an external node.
 * (5) R.externals, an array which gives the meanings of the codes xN for externals.
 * (6) R.__requires, an array of all the urls mentioned in R.externals (the files that must be loaded prior to interpretation of this serialization)
 
 *  An external is described by string of one the forms:  [<built-in>]/<path> or [<url>]/<path>
 *
 *  The built-ins for the PrototypeJungle application are things like "geom", and "ui". For example, "/geom/Point" refers to
 *  the  Point prototype as defined in pj.geom. Any prototype tree which contains Points will define a code 
 *  which is assigned  the value "/geom/Point" in R.externals.
 *
 *  For a separately loaded item, [source] denotes the URl from which it was loaded.  URLs come in two forms: <path> (eg /shape/arrow.js),
 *  and (username)<path> (eg (sys)/test/circle.js). 
 *  The former denotes a path in PrototypeJungle's own repository (https://prototypejungle.org/repo1),
 and latter a path in the repository of the given user.
 *
 *  In either case,   <path> specifies the sequence of selections which yield the referred-to object when starting with the external object.
 *  For example, [/shape/arrow.js]/head denotes the object X.head, where X is the item that was loaded from /shape/arrow.js 
 *  
 * R.chains[0][0] is the root of the serialization.
 * 
 */


let serializeFunctions = false;

const externalAncestor = function (x,root) {
  if (x === root) {
    return undefined;
  } else if (getval(x,'__sourceUrl')||getval(x,'__builtIn')) {
    return x;
  } else {
    let parent = getval(x,'__parent');
    if (parent) {
      return externalAncestor(parent,root);
    } else {
      return undefined;
    }
    
  }
}

let dependencies,externalReferences;


const externalReference = function (x) {
  if (x.__get('__referenceString')) {
    return x.__referenceString;
  }
  let url = x.__sourceUrl;
  let rs = '['+url+']';
  x.__referenceString = rs;
  if (!dependencies[url]) {
    dependencies[url] = true;
  }
  externalReferences.push(x); // these need to be cleared after the serialization
  return rs;
  
}


const referencePath = function (x,root) {
  let extAncestor = externalAncestor(x,root);
  let  builtIn,componentPath,relPath,builtInPath;
  if (extAncestor === undefined) {
    return undefined;
  }
  builtIn = getval(extAncestor,'__builtIn');
  if ( !builtIn) {
    componentPath = externalReference(extAncestor); 
    if ( !componentPath) {
      throw(Exception.mk('Not in a require',x));
    }
  }
  if (!x.__pathOf) {
     error('serialize','unexpected condition'); 
  }
  relPath = (x === extAncestor)?'':x.__pathOf(extAncestor).join('/');                                  
  if (builtIn) {
    if (extAncestor === codeRoot) {
      return relPath;
    } else {
      builtInPath = extAncestor.__pathOf(codeRoot);
      return builtInPath.join('/') + '/' + relPath;
    }
  }
  return (relPath==='')?componentPath:componentPath+relPath;
}

const encode = function (root) {
  dependencies = {};
  externalReferences = [];
  let nodes = [];
  let externals = [];
  let theObjects  = [];
  let chains = [];
  let theArrays = {};
  let externalItems = [];
  let atomicProperties = [];
  let theChildren = [];
  let nodeCount = 0;  
  const assignCode = function (x,depth,notHead) {
    let rs;
    if (ArrayNode.isPrototypeOf(x)) {
      if (x.__code) {
        return x.__code;
      } else {
        rs = x.__code = nodeCount++;
        nodes.push(x);
        x.forEach(function (child) {
          if (child && (typeof child === 'object')) {
            assignCode(child,depth+1);
          }
        });
        return rs;
      }
    }
    if (!x || !(x.__get)) {
       error('deserialize','unexpected condition'); 
    }
    if (notHead) {
      x.__notHead = true;
    }
    if (x.__get('__code')) {
      rs = x.__code;
    } else {
      let reference = referencePath(x,root);
      if (reference) {
        rs = 'x'+externals.length;
        externals.push(reference);
        x.__code = rs;
        externalItems.push(x);
        return rs;
      }
      nodes.push(x);
      rs = x.__code = nodeCount++;
      forEachTreeOrExternalProperty(x,function (child) {
        assignCode(child,depth+1);
      });
    }
    if (typeof rs === 'number') {
      let proto = Object.getPrototypeOf(x);
      if (proto) {
        assignCode(proto,depth+1000,true);
      }
    }
    return rs;
  }


  
  const findObjects = function () {
  
    let ln = nodes.length;
    for (let i=0;i<ln;i++) {
      let node = nodes[i];
      if (ArrayNode.isPrototypeOf(node)) {
        theArrays[i] = node.length;
      } else if (!node.__get('__notHead')) {
        theObjects.push(node);
      }
    }
  }
  
  const buildChain = function (x) {
    if (ArrayNode.isPrototypeOf(x)) {
      return undefined;
    }
    let code = x.__code;
    if (typeof code !== 'number') {
       error('serialize','unexpected condition'); 
      return;
    }
    let cx = x;
    let chain = [code];
    while (true) {
      cx = Object.getPrototypeOf(cx);
      if (!cx) {
        chains.push(chain);
        return;
      }
      code = cx.__code;
      chain.push(code);
      if (typeof code !== 'number') {
        chains.push(chain);
        return;
  
      }
    }
  }
  
  // properties that are used in serialization, and that should not themselves be serialized
  const excludedProps = {__code:1,__notHead:1,__headOfChain:1};
  
  
  const theProps = function (x,atomic) {
    let rs = undefined;
    const addToResult = function(prop,atomicProp) {
      let vcode;
      if (excludedProps[prop]) {
        return;
      }
      let v = x[prop];
      if (atomicProp) {
        if (!serializeFunctions && (typeof v === 'function')  && !(v.serializeMe)) {
          return;
        }
        let tpv = typeof v;

        if ((v === null)||(tpv !== 'object')) {
          if (!rs) {
            rs = {};
          }
          if (tpv === 'function') {
            rs[prop] = [v.toString()];
          } else if (tpv === 'number') {
            rs[prop] = nDigits(v,5); 
          } else {
            rs[prop] = v;
          }
        }
      } else {
        if ((v !== null)&&(typeof v === 'object')) {
          if (!rs) {
            rs = {};
          }
          vcode = v.__code;
          if (typeof vcode === 'string') { //an external reference
            if (v.__parent === x) {
              vcode = vcode + ' child';
            }
          }
          rs[prop] = vcode;
        }
      }
    }
    let propNames = Object.getOwnPropertyNames(x);
    rs = undefined;
    let isArray = ArrayNode.isPrototypeOf(x);
    let ln;
    if (isArray) {
      ln = x.length;
    }
    propNames.forEach(function (prop) {
      if (isArray) {
        let n = Number(prop);
        if (isNaN(n) || (n < ln)) {
          addToResult(prop,atomic);
        }
      } else {
        addToResult(prop,atomic);
      }
    });
    return rs;
  }
  
  const buildProperties = function () {
    let ln = nodes.length;
    for (let i=0;i<ln;i++) {
      atomicProperties.push(theProps(nodes[i],true));
      theChildren.push(theProps(nodes[i],false));
    }
  }
  
  const externalizeCleanup = function () {
    nodes.forEach((node) => {node.__code = undefined;});
    nodes.forEach((node) => {node.__notHead = undefined;});
    externalItems.forEach((ext) => {ext.__code = undefined;});
    externalReferences.forEach((x) => {x.__referenceString = undefined;});
  }

  /* The operations have been defined. NOW for the action */
  assignCode(root,0);
  findObjects();
  theObjects.forEach(buildChain);
  buildProperties();
  let rs = {};
  rs.chains = chains;
  rs.arrays = theArrays;
  rs.atomicProperties = atomicProperties;
  rs.children = theChildren;
  rs.externals = externals;
  rs.__requires = Object.getOwnPropertyNames(dependencies);
  externalizeCleanup();
  return rs;
}


    
let beforeSerialize = [];// a list of callbacks
let afterSerialize = []; // ditto
  
const serialize = function (node) {
  let srcp = node.__sourceUrl;
  node.__sourceUrl = undefined;// for reference generaation in externalize
  beforeSerialize.forEach(function (fn) {fn(node);});
  let rs = encode(node);
  node.__sourceUrl = srcp;
  afterSerialize.forEach(function (fn) {fn(node);});
  return rs;
}

//let prettyJSON  = false;


const stringify = function (node,pretty) {
  let x = serialize(node);
  return  pretty?JSON.stringify(x,null,4):JSON.stringify(x);
}

export {encode,serialize,stringify,referencePath,beforeSerialize,afterSerialize};// Copyright 2019 Chris Goad
// License: MIT

// <Section> deserialize  ====================================================


const splitRefToUrl = function (ref) {
  let splitRef = ref.split('|');
  let isSplit = splitRef.length > 1;
  return (isSplit)?fullUrl(splitRef[0],splitRef[1]):ref;
}


const externalReferenceToUrl = function (ref,includesPath) {
  let closeBracket,url;
  let firstChar = ref[0];
  if (firstChar === '[') {
    closeBracket = ref.lastIndexOf(']')
    url = ref.substr(1,closeBracket-1);
  } else {
    url = ref;
  }
  if (includesPath) {
    let path = ref.substring(closeBracket+1);
    return {url,path};
    //return {url:url,path:path};
  } else {
    return url;
  }
}

const resolveExternalReference = function (ref) {
  let urlAndPath,item,rs;
  let firstChar = ref[0];
  if (firstChar === '[') {
    urlAndPath = externalReferenceToUrl(ref,true);
    item = installedItems[urlAndPath.url];
    if (!item) {
      return undefined;
    }
    rs = urlAndPath.path?evalPath(urlAndPath.path,item):item;
  } else if (firstChar === '/') {
    rs = evalPath(ref.substr(1),codeRoot);
  } else {
    error('deserialize','unexpected condition'); 
  }
  //if (!rs) { //seems benign, but I'll leave this in commented in case of later trouble; cg 4/1/2018
 ///   error('deserialize','unexpected condition'); 
  //}
  return rs;
}




const deserialize = function (x) {
  let inodes = {};
  let externalItems = {};
  let atomicProperties,children,arrays,externals;
  ({atomicProperties,children,arrays,externals} = x);
  let value;
  
  let installAtomicProperties = function (parentCode) {
    let parent = inodes[parentCode];
    if (!parent) {
      return;
    }
    let values = atomicProperties[parentCode];
    for (let prop in values) {
      value = values[prop];
      if (Array.isArray(value)) {// a function
        let fn = eval('('+value+')');
        if (!serializeFunctions) {  // only serializing functions with theh serializeMe flag, which needs to be reasserted
          fn.serializeMe = true;
        }
        parent[prop] = fn;
        
      } else {
        parent[prop] = values[prop];
      }
    }
  }
  
  const installChildren = function (parentCode) {
    let parent = inodes[parentCode];
    if (!parent) {
      return;
    }
    let values = children[parentCode];
    for (let prop in values) {
      let child;
      let childCode = values[prop];
      if (typeof childCode === 'number') {
        child = inodes[childCode];
      } else {
        if (childCode === undefined) {
          //debugger;
          continue;
        }
        if (childCode.indexOf(' child')>=0) {
          child = externalItems[beforeChar(childCode,' ')];
          child.__parent = parent;                               
        } else {
          child = externalItems[childCode];
        }
      }
      parent[prop] = child;
    }
  }
  
  const buildChain = function (ichain) {
    let chain = ichain.slice(0); // copy it, so that deserialize is idempotent
    chain.reverse();
    let cx;
    chain.forEach(function (code) {
      if (typeof code === 'number') {
        let node = inodes[code];
        if (!node) {
          node = Object.create(cx);
          inodes[code] = node;
        }
        cx = node;
      } else {
        cx = externalItems[code];
        if (!cx) {
           //error('deserialize','unexpected condition'); //seems benign, but I'll leave this in commented in case of later trouble; cg 4/1/2018
          cx = ObjectNode.mk(); //temporary; 
        }
      }
    });
  }
  let eln = externals.length;
  for (let i=0;i<eln;i++) {
    let rs = resolveExternalReference(externals[i]);
    if (rs !== undefined) {
      externalItems['x'+i] =rs;
    } 
  }
  x.chains.forEach(buildChain);
  for (let acode in arrays) {
    let code = Number(acode);
    let a = ArrayNode.mk();
    let aln = arrays[code];
    if (aln) {
      a.length = arrays[code];
    }
    inodes[code] = a;
  }
  let ln = atomicProperties.length;
  for (let i=0;i<ln;i++) {
    installAtomicProperties(i);
    installChildren(i);
  }
  let rs = inodes[0];
  return rs; 
}

export {deserialize};// Copyright 2019 Chris Goad
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
	httpPost('www/'+path,str,cb);
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


export {httpGet,saveJson,beginsWith,endsIn,afterLastChar,beforeLastChar,parseQuerystring,pathExceptLast,pathLast,transferProperties};
// Copyright 2019 Chris Goad
// License: MIT

/* This installs components implemented by js scripts. The scripts should have the form
 * core.require(file1,file2...fileN,function (v1,v2... vn)){...return value});. Such code builds an item, and returns it, utilizing
 * the items already defined in the dependencies file1... filen, bound to v1... vn.
 * How it works: each script goes through 3 stages: loading, recohrding dependendencies, and installation.
 *  as soon as a script is loaded, its contained core.require is executed in a mode which records its dependendcies, but does not run its funcdtion
 *  Those depedencies are, in turn loaded, and their dependencies recorded
 *  core.requireEdges holds the graph of dependencies
 *  Once the graph is complete, the requires are installed from bottom up; that is each f(v1,...vn) is run with values
 *  that have already been computed for file1.. filen
 */
    

/* first, the error handler (throw doesn't work, since much of the activity is invoked from async callbacks) */

let debugInstall = 0;
// this is true if a hust of 127.0.0.1:3000 indicates running prototypejungle itself locally. This is turned off for export.
vars.local = beginsWith(window.location.host,'127')||beginsWith(window.location.host,'localhost');

const installDebug = function () {
  if (debugInstall) {
    debugger; //keep
  }
}
const installError = function (src,erm) {
  debugger; //keep
  let where = src==='top'?' at top level':(erm?' in ':'')+src;
  afterInstall(erm?(erm + where):where);
}
let loadedUrls = [];
let getCache = {};

let getPending = {};

const mapUrl = function (url,cb) {cb(url)};

vars.mapUrl = mapUrl;
vars.inverseMapUrl = function (url) {return url;}


const domainOf = function (url) {
  if (beginsWith(url,'/')||beginsWith(url,'(')) {
    return '';
  }
  let m = url.match(/^(https?:\/\/[^\/]*)\//);
  return m?m[1]:m;
}

const absoluteUrl = function (path,requester) {
  if (beginsWith(path,'http://')|| beginsWith(path,'https://') || beginsWith(path,'(')) {
     return path;
  }
  if (beginsWith(path,'/'))  {
    return path;
  }
  installDebug();
  let up =  beforeLastChar(requester,'/');
  let rs = path;
  while (beginsWith(rs,'..')) {
    up = beforeLastChar(up,'/');
    rs = path.substr(3);
  }
  return up + '/' + rs;
}
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


const httpGetForInstall = function (iurl,cb) {
	//debugger;
  log('install','httpGet',iurl);
  let cache = getCache[iurl];
  let rs;
  if (cache) {
    installDebug();
    cb(undefined,cache);
    return;
  }
  if (getPending[iurl]) {
    return;
  }
  getPending[iurl] =true;
  log('install',"getting ",iurl);

  vars.mapUrl(iurl,function (url) {
    let request = new XMLHttpRequest();
    request.open('GET',url, true);// meaning async
    request.onload = function() {
      log('install','httpGet loaded',iurl);
      if (cb) {
        if (request.status >= 200 && request.status < 400) {
        // Success!
         rs = request.responseText;
         log('install',"GOT ",iurl);
         delete getPending[iurl];
         loadedUrls.push(iurl);
         getCache[iurl] = rs;
         cb(undefined,rs);
        } else {
          installError('Failed to load '+iurl);
        }
        // We reached our target server, but it returned an error
      }
    };
    request.onerror = function() {
        installError('Failed to load '+iurl);
    };
    request.send();
  });
}


/*
const loadjs = function (iurl,requester) {
    log('install','loadjs',iurl,' from ',requester);
    loadedUrls.push(iurl);
		//debugger;
		httpGetForInstall(iurl,function (erm,rs) {
			//debugger;
			eval(rs);
		});
}
*/


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



let installedItems = {};
let loadedScripts = {};
let evaluatedScripts = {};
let requireActions,requireEdges,installErrorSource,requireRoot,currentRequire;
let afterInstall;
let requiresInstalled = false;

const resetInstalledItems = function () {
 installedItems = {};
}
const resetLoadVars = function () {
  evaluatedScripts = {};
  requireActions = {};
  requireEdges = {}; // maps urls of nodes to urls of their children (dependencies listed in the require call)
  installErrorSource = undefined; // set to the source where the install failed, if a failure occurs
  requiresInstalled = false;
}

let installRequire;


const dependenciesEvaluated = function (src) {
  let rs = true;
  if (!src) {
    return true;
  }
  let isItem = endsIn(src,'.item');
  if (isItem) {
    if (evaluatedScripts[src]) {
      return true;
    }
    if (!loadedScripts[src]) {
      return false;
    }
  }
  if ((src !== requireRoot) && !evaluatedScripts[src] && !isItem) {
    return false;
  }
  let dependencies = requireEdges[src];
  let ln = dependencies?dependencies.length:0;
  for (let i=0;i<ln;i++) {
    if (rs && !dependenciesEvaluated(dependencies[i])) {
      rs = false;
    }
  }
  if (isItem && rs) {
    evaluatedScripts[src] = 1;
  }
  return rs;
}

// items have their surface parts (eg a circle and lozeng), and then the prototypes object which holds their prototypes. We want to be able to load
// such items into a  prototypejungle state, which involves adding the prototypes of the item to the main prototypes object, creating a prototype PTOP with the given parts
// (in our example a circle and lozenge), and then adding PTOP to the main prototypes object as well. If there is only one part, we need not built a tree for PTOP,
// but can use that single  part as PTOP instead.

 const assemblyParts = function (item) { 
    let ownprops = Object.getOwnPropertyNames(item);
    let candidates = [];
    ownprops.forEach((prop) => {
      let v = item[prop];
      if (core.isNode(v)) {
        if (!((prop ==='prototypes') || (prop.substring(0,2) === '__') || (prop === 'transform'))) {
          candidates.push(v);
        }
      }
    });
    return candidates;
 };
 
 const importItem = function (item) {
   let source =  item.__sourceUrl;
   // we are about to dismantle the item, so need to forget it for reassmbly next time it is loaded
   installedItems[source] = undefined;
   let itemProtos = item.prototypes;
      // move the protos over to the main prototypes object
   core.forEachTreeProperty(itemProtos,(iproto,nm) => {
      if (iproto.__sourceUrl) {
        core.installPrototype(nm,iproto);
      }
   });
   let candidates = assemblyParts(item);
   let rs;
   if (candidates.length === 1) {
     rs = candidates[0];//.instantiate();
   } else {
     rs = svg.Element.mk('<g/>');
     rs.__assembly = true;
     candidates.forEach((c) => {
       //c.neverselectable = true; 9/13
      c.unselectable = true;
      let pos = c.getTranslation();
       let nm = c.__name;
       c.__singleton = true; // has only one instance;means that this prototype need not be shown in the object-property panel nor used in copy
       rs.set(nm,c);
       c.moveto(pos);
       c.unselectable = true;
     });
   }
   let frs = core.installPrototype('import',rs);
   return frs;
 }

// the requester is the url of the script in which require of these sources occurred
// returns true if it found something already installed, allowing satisfaction of a new dependency
const require1 = function (requester,sources) {
  installDebug();
  const installRequiresIfPossible = function () {
    if (dependenciesEvaluated(requireRoot)) {
      installRequires();
    }
  }
  if (sources.length === 0) {
    installRequiresIfPossible();
    return;
  }
  let satisfiedDependency = false;
  sources.forEach(function (src) {
    let isItem = endsIn(src,'.item');
    if (endsIn(src,'.jpg')) { // afterImageUrl set in the UI
      installDebug();
      if (vars.afterImageUrl) {
        vars.afterImageUrl(src,function (erm,rs) {
          evaluatedScripts[src] = 1; // so that this is no longer regarded as as an unfullfilled dependency
          installedItems[src] = rs;
          rs.__sourceUrl = src;
          installRequiresIfPossible();
        });
      }
    } else if (isItem) {
       loadItem(src);
    }  else if (endsIn(src,'.json') || endsIn(src,'.data') || isItem) {
       httpGetForInstall(src,function (erm,rs) {
         evaluatedScripts[src] = 1; // so that this is no longer regarded as as an unfullfilled dependency
         loadedScripts[src] = rs;        
         let parsedRs = lift(parseJSONwithCatch(src,rs));
         if (parsedRs !== 'parseError') {
           // always lift
           let lifted = core.lift(parsedRs);
           lifted.__sourceUrl = src;
           installedItems[src] = lifted;
           //parsedRs.__sourceUrl = src;
           //installedItems[src] = parsedRs;
         }
         installRequiresIfPossible();
       });
    } else {
      let evScript = evaluatedScripts[src];
      let inItem = installedItems[src];
      let ldScript = loadedScripts[src];
      if (!(evScript || inItem || ldScript)) {
        loadjs(src,requester);
      } else {
        if (inItem) {
          evaluatedScripts[src] = 1;
        } else if (ldScript && !evScript) {
          eval(ldScript);
          evaluatedScripts[src] = 1;
        }
        log('install','AVOIDED repeat load of ',src);
        satisfiedDependency = true;
      }
    }
  });
  // check for completion  if  a dependency has been satisfied
  if (satisfiedDependency) {
    installRequiresIfPossible();
  }
  return satisfiedDependency;
 
}

let catchInstall = true; // false is useful for debupgging, but should be on for normal usage

const  debugMode = function (vl) {
  if (vl) {
    catchUpdateErrors = false;
    catchInstall = false;
  } else {
    catchUpdateErrors = true;
    catchInstall = true;    
  }
}
installRequire = function (src) {
  installDebug();
  if (installErrorSource) {
    return installErrorSource;
  }
  let val = installedItems[src];
  if (val) {
    return val;
  }
  let children = requireEdges[src];
  let values = children?children.map(installRequire):[];
  if (endsIn(src,'.item')) {
    val = deserialize(loadedScripts[src]);//loadedItem);;
  } else {
    let action = requireActions[src];
    if (!action) {
      installDebug();
    }
    log('install','RUNNING ACTIONN',src,catchInstall);
    if (catchInstall) {
      try {
        val = action(...values); // run the function fn of the require core.require(fl0,fl1...,fn)
      } catch (e) {
        installErrorSource = src;
        installError(src,e.message);
        return src;
      }
    } else {
      val = action(...values);
    }
  }
  if (val) {
    installedItems[src]= val;
    val.__sourceUrl = src;
    if (vars.onInstall) {
       vars.onInstall(val);
    }
  }
  return val;
}


const installRequires1 = function (src) {
  let dependencies = requireEdges[src];
  if (dependencies) {
    dependencies.forEach(installRequires1);
  }
  return installRequire(src);
}

const installRequires = function () {
  if (requiresInstalled) {
    return;
  }
  requiresInstalled = true;
  let val = installRequires1(requireRoot);
  if (installErrorSource) {
    installDebug();
    return;
  }
  log('install','AFTER INSTALL');
  afterInstall(undefined,val);
}

let require = function () {
  installDebug();
  let cRequire;
  let thisScript = document.currentScript;
  if (thisScript ){
    let thisDomain =  (vars.local?'http://':'https://')+window.location.host + '/';
    let fullRequire = thisScript.src;
    if (beginsWith(fullRequire,thisDomain)) {
       let servedFromPJ = (thisDomain === 'https://prototypejungle.firebaseapp.com/')  || vars.local;
     cRequire = (servedFromPJ)?fullRequire.replace(thisDomain,'/'):fullRequire;
    } else {
      cRequire = vars.inverseMapUrl(fullRequire);
    }
  } else { // this case occurs only when install is from the  code_editor
    cRequire = currentRequire;
  }
  evaluatedScripts[cRequire] = 1;
  installDebug();
  let numRequires;
  numRequires = arguments.length-1;
  let sources = [];
  for (let i=0;i<numRequires;i++) {
    let isrc = arguments[i];
    let src = absoluteUrl(isrc,cRequire);
    sources.push(src);
  }
  requireActions[cRequire] = arguments[numRequires];
  requireEdges[cRequire] = [].concat(sources);
  require1(cRequire,sources);
}


const loadRequires = function (requires,cb) {
  if (cb) {
     afterInstall = cb;
  }
  resetLoadVars();
  requireRoot = 'zub';
  installedItems.zub = 1;
  let arequires = requires.map(function (url) {return absoluteUrl(url,'/');});
  requireEdges['zub'] = [].concat(arequires);
  require1('zub',arequires);
}

const loadItem = function (src) {
  httpGetForInstall(src,function (erm,rs) {
    installDebug();
    let prs = JSON.parse(rs);
    loadedScripts[src] = prs;
    let requires = prs.__requires;
    let arequires = requires.map(function (url) {return absoluteUrl(url,'/');});
    requireEdges[src] = [].concat(arequires);
    require1(src,arequires);
  })
}

let prescript = 'let {core,geom,dom,draw}=Window,codeRoot=core.codeRoot,root=core.root,svg=dom.svg,Point=geom.Point;\n';

let prescriptNeeded = false; // needed for Safari, but not other browsers
const evalWithCatch = function (src,iscript) {
  let script = (prescriptNeeded)?prescript + iscript:iscript;
  if (catchInstall) {
    try {
      eval(script);
    } catch (e) {
      installErrorSource = src;
      installError(src,e.message);
      return src;
    }
  } else {
    eval(script);
  }
}


const parseJSONwithCatch = function (src,script) {
  let rs;
  if (catchInstall) {
    try {
      rs = JSON.parse(script);
    } catch (e) {
      installErrorSource = src;
      installError(src,e.message);
      return 'parseError';
    }
  } else {
     rs = JSON.parse(script);
  }
  return rs;
}

let afterLoadTop;   

const loadTopDefs = function (cb) {
  afterLoadTop = cb;
  // binds globals to the modules
  loadjs('/topdefs.js');
}

const install = function (isrc,cb) {
  installDebug();
  let requester = '/';
  let src = absoluteUrl(isrc,requester);
  let rs = installedItems[src];
  if (rs) { 
    cb(undefined,rs);
    return;
  }
  resetLoadVars();
  afterInstall = cb;
  requireRoot = src;
  if (endsIn(src,'.item')) {
    loadItem(src);
    return;
  }
  currentRequire = src;
  let ldScript = loadedScripts[src];
  if (ldScript) {
    evalWithCatch(src,ldScript);
  } else {
    if (beginsWith(src,'http'))  {
      loadjs(src,requester);
    } else {
      httpGetForInstall(src, function (err,rs) {
        evalWithCatch(currentRequire,rs);
      });
    }
  }
}


const findPrototypeWithUrl = function (url) {
  if (!root.prototypes) {
    return undefined;
  }
  let rs;
  forEachTreeProperty(root.prototypes,function (itm) {
    if (itm.__sourceUrl === url) {
      rs = itm;
    }
  });
  return rs;
}


const replaceRequireInItem = function (url,toReplace,replacement) {
  let code = loadedScripts[url];
  let newCode = code.replace(toReplace,replacement);
  loadedScripts[url] = newCode;
}


const checkSyntax = function (code)  {
  let svRequire = require;
  require = () => {};
  try {
    eval(code);
  } catch (e) {
    if (e instanceof SyntaxError) {
      require = svRequire;
      return e.message;
    }
  }
  require = svRequire;
}
//  this is used in the code editor
// a file "standsAlone" if it is suitable for loading into the code editor as the top level js

const standsAloneObject = {};

const standsAlone = (url) => {
  if (Array.isArray(url)) {
    url.forEach((aurl) => standsAloneObject[aurl] = true);
  } else {
    standsAloneObject[url] = true;
  }
}

const standsAloneP = (url) => Boolean(standsAloneObject[url]);



export {httpGetForInstall,httpPost,loadjs,install,require,debugMode,requireEdges,loadedUrls,replaceRequireInItem,
        findPrototypeWithUrl,loadedScripts,installedItems,resetInstalledItems,afterLoadTop,
        absoluteUrl,loadTopDefs,checkSyntax,assemblyParts,importItem,standsAlone,standsAloneP};
        
        // Copyright 2019 Chris Goad
// License: MIT

/* A normal setup for managing items,  is for there to be a current item which
 * is being manipulated in a running state, a state which contains various other items installed from external sources.
 * Each node in such a set up can be assigned a path, call it an 'xpath' (x for 'possibly external'). The first element
 * of this path is either '.' (meaning the current item), '' (meaning pj itself)  or the url of the source of the item.
 * pj.xpathOf(node,root) computes the path of node relative to root, and pj.evalXpath(root,path) evaluates the path
 */



const xpathOf = function (node,root) {
  let sourceUrl;
  let rs = [];
  let current = node;
  let name;
  while (true) {
    if (current === undefined) {
      return undefined;
    }
    if (current === root) {
      rs.unshift('.');
      return rs;
    }
    if (current === codeRoot) {
      rs.unshift('');
      return rs;
    }
    sourceUrl = current.__get('__sourceUrl');
    if (sourceUrl) {
      rs.unshift(sourceUrl);
      return rs;
    }
    name = getval(current,'__name');
    if (name!==undefined) {// if we have reached an unnamed node, it should not have a parent either
      rs.unshift(name);
    }
    current = getval(current,'__parent');
  }
} 

const evalXpath = function (root,path) {
  let p0,current,ln,prop,i;
  if (!path) {
    error('No path');
  }
  p0 = path[0];
  if (p0 === '.') {
    current = root;
  } else if (p0 === '') {
    current = codeRoot;
  } else { 
    current = installedItems[p0];
  }
  ln=path.length;
  for (i=1;i<ln;i++) {
    prop = path[i];
    if (current && (typeof current === 'object')) {
      current = current[prop];
    } else {
      return undefined; 
    }
  }
  return current;
}

export {xpathOf,evalXpath};
// Copyright 2019 Chris Goad
// License: MIT


vars.activeConsoleTags = ['error'];//,'drag','util','tree'];
  
const log = function (tag) {
  if (typeof console === 'undefined') {
    return;
  }
  let activeTags = vars.activeConsoleTags;
  if ((activeTags.indexOf('all')>=0) || (activeTags.indexOf(tag) >= 0)) { 
    // transform arguments list into array
    let aa = [].slice.call(arguments);
    console.log(tag,aa.join(', ')); //keep
  }
};


let startTime = Date.now()/1000;
// time log, no tag


const resetClock = function () {
  startTime = Date.now()/1000;
}

const elapsedTime = function () {
  let now = Date.now()/1000;
  let elapsed = now-startTime;
  return  Math.round(elapsed * 1000)/1000;
}

const tlog = function () {
  let elapsed,aa,rs;
  if (!vars.tlogActive) {
    return;
  }
  if (typeof console === 'undefined') {
    return;
  }
  elapsed = elapsedTime();
  // turn arguments into array
  aa = [].slice.call(arguments);
  rs = 'At '+elapsed+': '+aa.join(', ');
  console.log(rs); //keep
}

const timers = {};
const advanceTimer = function (nm,v) {
  let cv = timers[nm];
  if (cv === undefined) {
    cv = [0,0];
    timers[nm] = cv;
  }
  cv[0] = cv[0]+1;
  cv[1] = cv[1] + v;
}

const resetTimer = function (nm) {
  timers[nm] = 0;
}


export {log,tlog,advanceTimer,resetTimer,timers};






const hasRole = function (node,role) {
  return node.role === role;
}

const toRole = function (roles) { //temporary during transition from roles to role
  if (typeof roles === 'object') {
    return roles[0];
  }
  return roles;
}

let descendantRoleSearchEnabled = true; // a fancy feature that might prove confusing; if this var is false,only consider the item
const descendantWithRole = function (item,role,roles) {      
  let rs;
  const recurser = (node) => {
    if (node.__name === 'prototypes') return undefined;
    let nodeRole = node.role;
    if ((role && nodeRole === role) ||
        (roles && (roles.findIndex((candidate) => candidate === nodeRole))>-1)) {
      rs = node;
      throw nul;
    } else {
      if (descendantRoleSearchEnabled) {
        forEachTreeProperty(node,recurser);
      } else {
        throw nul;
      }
    }
  }
  try {
    recurser(item);
  } catch(e) {
  }
  return rs;
}

const ancestorWithRole = function (item,role,roles) {
  let rs = findAncestor(item,function (node) {
   // if ((!descendantRoleSearchEnabled) && (node.unselectable || node.neverselectable)) {
   //   return false;
   // }
    let nodeRole = node.role;
    if ((role && nodeRole === role) ||
        (roles && (roles.findIndex((candidate) => candidate === nodeRole))>-1)) {
      return node;
    }}); 
  return rs;
}


// make sure that, in each prototype, if it has an own dimension, its width and height are set to it.
const propagateDimension  = function (item) {
  if (item === ObjectNode) {
    return;
  }
  let dim = item.__get('dimension');
  if (dim !== undefined) {
    item.width = item.height = dim;
  }
  propagateDimension(Object.getPrototypeOf(item));
}

const transferExtent = function (dest,src,own) {
  let destDim = own?dest.__get('dimension'):dest.dimension;
  let dim = own?src.__get('dimension'):src.dimension;
  let width = own?src.__get('width'):src.width;
  let height = own?src.__get('height'):src.height;
  if (Number(destDim)) {
    if (dim) {
      dest.dimension = dim;
    } else if (width) {
      dest.dimension = Math.max(width,height);
    }
    propagateDimension(dest);
    return;
  }
  if (Number(dim)) {
    dest.width = dim;
    dest.height = dim;
    return;
  }
  if (Number(width)) {
    dest.width = width;
  }
  if (Number(height)) {
    dest.height = height;
  }
}

const transferOwnExtent = function (dest,src) {
  transferExtent(dest,src,true);
}

const containingKit = function (item) {
  return findTopAncestor(item,(node) => node.isKit);
}


// transferState is used in copying as well as replacement
const transferState = function (dest,src,settings,own=true,forCopy) {
  let transferState = dest.transferState;
  if (transferState) {
    dest.transferState(src,own);
  }
  if (!forCopy) {
    let kit = containingKit(dest);
    if (kit && kit.transferElementState) {
      kit.transferElementState(dest,src,own);
    }
    let transferGraphState = dest.transferGraphState;
    if (transferGraphState) {
      dest.transferGraphState(dest,src,own);
    }
  }
  setProperties(dest,src,['role','unselectable','neverselectable','visibility','__singleton']);
  dest.role = src.role;
  if (dest.resizable) {
    transferExtent(dest,src,own);
  }
  if (settings) {
    dest.set(settings);
    //dest.setIfMissing(settings);
  }
}

// fix the cross-tree links 
const fixLinks = function (node,replaced,replacement) {
  let names = Object.getOwnPropertyNames(node);
  names.forEach(function (nm) {
    let treeProp = treeProperty(node,nm,false,true);
    if (treeProp) {
      fixLinks(node[nm],replaced,replacement);
    } else if (node[nm] === replaced) {
      node[nm] = replacement;
    }
  });
}


  
  

// climbCount if present tells how many steps to go up the tree to what is updated
// used for replacing parts

const ireplace = function (replaced,replacementProto,climbCount,settings) {
  let inPrototypesTree  = isPrototype(replaced);
  let position;
  if (!inPrototypesTree) {
    position = replaced.getTranslation();
  }
  let parent = replaced.__parent;
  let replacement = replacementProto.instantiate();
  if (inPrototypesTree) {
    replacement.hide();
  } else {
    replacement.unhide();
  }
  if (settings) {
    replacement.set(settings);
  }
  parent.__replaceChild(replaced,replacement); // keeps the order of children intact; FORWARD REFERENCE
  parent.draw(); // only for debugging
  if (replacement.initialize && !inPrototypesTree) {  transferState(replacement,replaced,undefined,!inPrototypesTree/*own*/);
    replacement.initialize();
  }
  transferState(replacement,replaced,settings,!inPrototypesTree/*own*/);//mod cg 1/8/19
  if (position) {
    replacement.moveto(position);
  }
  // if replaced is in the prototype tree, cause all of the inheritors to inherit from the replacement
  if (inPrototypesTree)    {
    forInheritors(replaced,function (ireplaced) {
      if (ireplaced === replaced) { // any node counts as an inheritor of itself - we're  only interested in strict inheritors
        return;
      }
      ireplace(ireplaced,replacement,climbCount);
    });
  }
  return replacement;
}

let afterReplaceHooks = [];

const replace = function (replaced,replacementProto,climbCount,settings) {
  let links = crossTreeLinks();
  let rs = ireplace(replaced,replacementProto,climbCount,settings);
  installLinks(links);
  afterReplaceHooks.forEach( (fn) => fn());
  return rs;
}

ObjectNode.swapPrototypeOf = function (replacementProto) {
  return replace(this,replacementProto);
}


ObjectNode.swapThisPrototype = function (replacementProto) {
  return replace(this,replacementProto);
}

// this copies the item itself (ie the head of its prototype chain, but the copy inherits from Object.getPrototyepOf(item)
// TransferState is used to populate the copy, and the result is added as a sibling of item in the tree

const copyItem = function (item,iunder) {
  let proto = Object.getPrototypeOf(item);
  let rs = proto.instantiate();
  transferState(rs,item,undefined,true,true);
  transferOwnExtent(rs,item);
  propagateDimension(rs);
  let under = iunder?iunder:item.__parent;
  let newName = autoname(under,item.__name);
  under.set(newName,rs);
  return rs;
}

ObjectNode.copy = function (placeUnder) {
  return copyItem(this,placeUnder);
}

export {propagateDimension,containingKit,transferState,replace,toRole,descendantRoleSearchEnabled,
        descendantWithRole,ancestorWithRole,copyItem,hasRole,afterReplaceHooks};


/* a mark is just something with a datum, a presentation, and a generator */

const defineSpread = function (groupConstructor) {


let Spread = codeRoot.set('Spread',groupConstructor()).__namedType(); 
let Mark = codeRoot.set('Mark',groupConstructor()).__namedType(); 


// each Spread should have a generator method, and optionally a bind metho.

Spread.mk = function () {
  let rs = Object.create(codeRoot.Spread);
  rs.set('marks',groupConstructor());
  rs.marks.unselectable = true;
  return rs;
}

Spread.reset = function () {
  this.set('marks',groupConstructor());
  this.data = undefined;
  this.marks.unselectable = true;

}

codeRoot.Spread.update = function () {
  if (this.__newData) {
    this.inSync = false;
  }
  let data = this.data;
  if (!data) {
    return;
  }
  if (this.inSync) {
    return;
  }
  let marks = this.marks;
  let ln = data.length;
  let thisHere = this;
  for (let i=0;i<ln;i++) {
    let p = thisHere.generator(marks,'m'+i,data[i],i);
    p.__dataIndex = i;
    declareComputed(p);
    p.__update();
  }
  this.inSync = true;
}

codeRoot.Spread.selectMark = function (n) {
  return this.marks['m'+n];
}

codeRoot.Spread.forEachMark = function (fn) {
  forEachTreeProperty(this.marks,function (child) {
    if (child.__dataIndex !== undefined) {
      fn(child);
    }
  });
}

codeRoot.Spread.length = function () {
  let data = this.data;
  return data?data.length:0;
}

}

export {defineSpread};// computes the diff between core.root, and a state (deserialized from a saved state)
// Theory of operation. A state is just a prototype tree (always distinct from the tree installed as root)
// If a state and root are isomorphic, a map maps the nodes of state to root.
// so, a state remembers the values of primitive and external properties while the root is changing
//After the root has changed, if it remains isomorphic (only prim props have changed), a diff records, node by node
// the prim prop values of the root that differ from the base state. These diffs are used to build a history between changes
// to non-primitive properties.
// Every time a nonprim change happens, a full state is recorded, and a new map built
// To go back to an old state, that state is copied and installed as root

// first copy everything except the cross-tree links, then fix those up
 // assumes the nodes are already labeled

const copyState = function (state) {
  // for now
  return deserialize(serialize(state));
}

vars.debugDiff = false;

const diffDebug = (msg) => {
  if (vars.debugDiff) {
    console.log('DEBUG DIFF ',msg); //keep
    debugger;//keep
  }
}


const buildLabelMap = function (stateTop) {
  let map = {};
  const R = function (state) {
    if (map[state.__label]) {
      return;
    }
    if (state.__label === undefined) {
      error('missing label'); 
    }
    map[state.__label] = state;
    let ownprops = Object.getOwnPropertyNames(state);
    ownprops.forEach((p) => {
      let child = state[p];
      if (child && (typeof child === 'object') &&  (child.__parent === state)) {
        let proto = Object.getPrototypeOf(child);
        if (!externalToTree(proto)) {
          R(proto);
        }
        if (!externalToTree(child)) {
          R(child);
        }
      };
    });
    return map;
  }
  R(stateTop);
  return map;
}

const remap = function (state,map) {
  let labelMap = buildLabelMap(state);
  map.forEach(function (mapEl) {
    let label = mapEl.node1.__label;
    mapEl.node2 = labelMap[label];
  });
}

const encodeMap = function (state,map) {
  let labelMap = buildLabelMap(state);
  return map.map((mapEl) => stringPathOf(mapEl.node1,state));
}
  
    
      
  




const propsToIgnore = ['__code','__element','__container','__setCount','__setIndex','__notHead',
'__parent','__label','__resizeBoxes','__selected','__updateCount','__beenAdjusted'];

//oneWay means that props2 may include more properties than props1, but not vice versa
                       
const propsEquivalent = function (props1,props2,oneWay=false) {
  let ln1 = props1.length;
  let ln2 = props2.length;
  for (let i=0;i<ln1;i++) {
    let p=props1[i];
    if ((propsToIgnore.indexOf(p) === -1) && (props2.indexOf(p) === -1)) {
        diffDebug('props1 not equivalent');
        return false;
    }
  }
  if (oneWay) {
    return true;
  }
  for (let i=0;i<ln2;i++) {
    let p=props2[i];
    if ((propsToIgnore.indexOf(p) === -1) && (props1.indexOf(p) === -1)) {
        diffDebug('props2 not equivalent');
        return false;
    }
  }
  return true;
}

const objectProperties = (node) => {
  let ownprops = Object.getOwnPropertyNames(node);
  let rs = [];
  ownprops.forEach((p) => {
    let child = node[p];
    if (child && (typeof child === 'object')) {
     // if (!child.__computed) {
     rs.push(p);
     // }
    }
  });
  return rs;
}


  
//let collectedNodes1 = [];
let nodeMap; // this maps nodes1 to nodes2; each member has the form {node1:node1,node2:node2}


const collectNodes = function (n1,n2) { // traverse the trees in order given by the ownprops of n1
  let nodeMap = [];
  let labelCount = 0;

	  
	const collectNodesR = function (n1,n2,callDepth=0) { // traverse the trees in order given by the ownprops of n1
	 // n1.__label = n2.label = labelCount++;
    /*let computed1 = n1.__computed;
    let computed2 = n2.__computed;
     if (computed1 !== computed2) {
		  diffDebug('label mismatch false');
		  return false;
	  }
    if (computed1) {
      return true;
    }*/
	  let  label1 = getval(n1,'__label');
	  let  label2 = getval(n2,'__label');
	  if (label1 !== label2) {
		  diffDebug('label mismatch false');
		  return false;
	  }
	  if (label1) {
		  //console.log('found label');
		  return true;
	  }
	  let ext1 = callDepth && externalToTree(n1);
	  let ext2 = callDepth && externalToTree(n2);
	  if (ext1 || ext2) {
		  let rs = ext1 === ext2;
		  if (!rs) {
		    diffDebug('Ext match false');
		  }
		  return rs;
	  }
	  n1.__label = n2.__label = labelCount++;
	  nodeMap.push({node1:n1,node2:n2});
    let obprops1 = objectProperties(n1);
	  let obprops2 = objectProperties(n2);
	  if (!propsEquivalent(obprops1,obprops2,true)) {
		  //console.log('false 0');
		  return false
	  }
	  let ln = obprops1.length;
	  for (let i=0;i<ln;i++) {
		let p = obprops1[i];
      if (propsToIgnore.indexOf(p) > -1) {
        continue;
      }
     // console.log(callDepth,n1.__name,'/',p);
     // if (p === 'data') {
     //   debugger;
     // }
      let child1 = n1[p];
      let child2 = n2[p];
      let extRef1 = child1.__get('__sourceUrl');
	    let extRef2 = child2.__get('__sourceUrl');
      if (extRef1 || extRef2) {
   	    let rs = extRef1 === extRef2;
		    if (!rs) {
		      diffDebug('Ext match false');
          return false;
		    }
        continue;
      }
      let treeChild1 = child1.__parent === n1;
      let treeChild2= child2.__parent === n2;
      if (treeChild1 !== treeChild2) {
        diffDebug('false 2');
        return false;
      }
      if (treeChild1) { //both tree children
        let proto1 = Object.getPrototypeOf(child1);
        let proto2 = Object.getPrototypeOf(child2);
        //console.log('to proto');
        let rs = collectNodesR(proto1,proto2,callDepth+1);
        if (!rs) {
          return false;
        }
        rs = collectNodesR(child1,child2,callDepth+1);
        if (!rs) {
          return false;
        }
        
		  }
	  }
	  //console.log(callDepth,' true');
	  return true;
	}
	  
  let rs = collectNodesR(n1,n2);
  return rs?nodeMap:false;
	
}
  
const findDiff = function (n1,n2) {
  let foundADiff = false;
  let ownprops1 = Object.getOwnPropertyNames(n1);
  let ownprops2 = Object.getOwnPropertyNames(n2);
  let obprops1 = objectProperties(n1);
  let obprops2 = objectProperties(n2);
  if (!propsEquivalent(obprops1,obprops2)) {
     return false;
  }
  let primProps = [];
  let filter = (p) => (propsToIgnore.indexOf(p) === -1) && (primProps.indexOf(p)===-1)&&(obprops1.indexOf(p)===-1);
  ownprops1.forEach((p) => {
    if (filter(p)) {
      primProps.push(p);
    }
  });
  ownprops2.forEach((p) => {
    if (filter(p)) {
      primProps.push(p);
    }
  });
  let diffs = {};
  // first check the object properties; no change is allowed in them
  let ln = obprops1.length;
  for (let i=0;i<ln;i++) {
    let p = obprops1[i];
    let child1 = n1[p];
    let child2 = n2[p];
    if (getval(child1,'__label') !== getval(child2,'__label')) {
      diffDebug('label mismatch false');
      return false;
    };    
  }
  ln = primProps.length;
  for (let i=0;i<ln;i++) {
    let p = primProps[i];
    if (propsToIgnore.indexOf(p) > -1) {
      continue;
    }
    let child1 = n1[p];
    let child2 = n2[p];
    let typ1 = typeof child1;
    let typ2 = typeof child2;
    if ((child1 !== undefined) && (typ1 !== typ2)) {
      if (p !== '__sourceUrl') { // special case
        diffDebug('type mismatch false');
        return false;
      }
    }
    if (child1 !== child2) {
      foundADiff = true;
      diffs[p] = child2;
    }
  }
  return foundADiff?diffs:'none';
}

const findAllDiffs = function (map) {
  let foundADiff = false;
  let ln = map.length;
  let diffs = {};
  for (let i=0;i<ln;i++) {
    let mapEl = map[i];
    let diff = findDiff(mapEl.node1,mapEl.node2);
    if (diff===false) {
      return false;
    } else if (diff && (diff!=='none')) {
      foundADiff = true;
      diffs[i] = diff;
    } 
  }
  return foundADiff?diffs:'none';
}
// installs the state represented by the map, without diffs
const installMap = function (map) {
  debugger;
  root = map[0].node2;
  let cnt = 0; // only for debugging
  map.forEach(function ({node1,node2}) {
	  let ownprops1 = Object.getOwnPropertyNames(node1);
    ownprops1.forEach(function (p) {
      if (node2 === undefined) {
         return;
      }
      let child1 = node1[p];
      let child2 = node2[p];

     /* if (child2 === 'undefined') {
         debugger; //keep
      }*/
      let obChild1 = Boolean(child1 && (typeof child1 === 'object'));
      if (!obChild1) {
        if (child1!== child2) {
          node2[p] = child1;
        }
      }
	  });
    cnt++;
    // we might have to remove some added properties
    let ownprops2 = Object.getOwnPropertyNames(node2);
    ownprops2.forEach(function (p) {
      if ((propsToIgnore.indexOf(p)===-1) && (ownprops1.indexOf(p)===-1)) {
        delete node2[p];
      }
    });

  });
}
  
  const  clearLabels = function (nd) {
	forEachDescendant((node) => {node.__label = undefined;})
  }
	  
	  
		  

	  
  

const installDiffs = function (map,diffs) {
  //let ln = map.length;
  for (let i in diffs) {
  //for (let i=0;i<ln;i++) {
    let node2 = map[i].node2;
    let diff = diffs[i];
    for (let p in diff) {
    //let props = Object.getOwnPropertyNames(diff);
    //props.forEach(function (p) {
      node2[p] = diff[p];
    };
  }
}

const removeFactor = function (n,f) {
  if (n === 1)  return 1;
  let rm = n%f;
  if (rm === 0) {
	return removeFactor(n/f,f);
  }
  return n;
}

const removeFactors = function (n) {
  return removeFactor(removeFactor(removeFactor(n,2),3),7);
}


const listem = function (n) {
  let rs =[];
  for (let i=1;i<n;i++) {
    if (removeFactors(i) === 1) {
      rs.push(i);
	}
  }
  return rs;
}
	 

export {nodeMap,collectNodes,findAllDiffs}


let history = [];
// each element of history is either a complete state, or a diff
// at any given moment (except when the mouse is moving), the last element of history represents the current state 
// (perhaps via a diff)
// popping the state means going to history[history.length - 2]



let beforeSaveStateHooks = [];
let afterSaveStateHooks = [];

let historyFailed = false;
const isDiff = (h) => Boolean(h.diffs);
let afterHistoryFailureHooks = [];
let beforeSerializeState = [];
let afterSerializeState = [];

const addStateToHistory = function (kind) { //complete state, that is
  clearLabels(root);
  let srcp = root.__sourceUrl;
  root.__sourceUrl = undefined;// for reference generaation in externalize
  //beforeSerialize.forEach(function (fn) {fn(root);});
  beforeSerializeState.forEach(function (fn) {fn(root);});
  let s = encode(root);
  let state = deserialize(s);
  let map = collectNodes(state,root);
  root.__sourceUrl = srcp;
  afterSerializeState.forEach(function (fn) {fn(root);});
  //let labelMap = buildLabelMap(state); // just for testing
  if (!map) {
	  console.log('CollectNodes failed');//keep
    historyFailed = true;
    debugger;  //keep
	  console.log('history failure');// shouldn't happen; keep
    afterHistoryFailureHooks.forEach((fn) => fn());
  }
  history.push({map,state,kind});

}


const previousState = function (n) {
  for (let i=n;i>=0;i--) {
    let h = history[i];
    if (!isDiff(h)) {
      return i;
    }
  }
}

const mostRecentState = function () {
  return previousState(history.length - 1);
}

const nullDiff = function (diff) {
  return Object.getOwnPropertyNames(diff).length ===0;
}

const nullDiffs = function (diffs) {
  let ln = diffs.length;
  for (let i=0;i<ln;i++) {
    if (!nullDiff(diffs[i])) {
      return false;
    }
  }
  return true;
}
let currentHistoryIndex = -1;

const canRedo = () => (history.length > (currentHistoryIndex + 1));

let useDiffs = false; // use of diffs doesn't work yet for saved histories.
const saveState = function (kind) {
  //debugger;
  //console.log('saveState');
  if (!vars.historyEnabled) {
	return;
  }
  beforeSaveStateHooks.forEach((fn) => {fn();});
  let ln = history.length;
  if (currentHistoryIndex < (ln-1)) {
    history.length = currentHistoryIndex+1;
  }
  // put this all in a catch, because we must be certain to run afterSaveStateHooks
  try {
    if (currentHistoryIndex < 0) {
      addStateToHistory(kind);
    } else {
      let lastState = history[mostRecentState()];
      let diffs = findAllDiffs(lastState.map);
      if (diffs  && useDiffs) { 
        if (diffs !== 'none') {
          history.push({diffs,kind});  // add a diff 
        }
      } else { // need a new complete state
        addStateToHistory(kind);
      }
    }
  } catch (e) {
    error('Problem in saving state');
  }
  afterSaveStateHooks.forEach((fn) => {fn();});
  currentHistoryIndex = history.length - 1;

}


let afterRestoreStateHooks = [];

/*
const installMostRecentState = function () {
  let ln = history.length;
  for (i=ln-1;i>=0;i--) {
    let h = history[i];
    if (!isDiff(h)) {
      lastState = h.state;
      lastMap = h.map;
      installMap(lastMap);
      return i;
    }
  }
}
*/


const gotoState= function (n) { // goes to a state, or diff
  //debugger;
  if (!vars.historyEnabled) {
    return;
  }
  let ln = history.length;
  if ((n >= ln) || (currentHistoryIndex === n)) {
    return;
  }
  let current = history[currentHistoryIndex];
  let destination = history[n];
  let currentStateIndex = previousState(currentHistoryIndex);
  let destStateIndex = previousState(n);
  let destState = history[destStateIndex];
  if (currentStateIndex === destStateIndex) { // only need to install a diff
    installMap(destState.map);
    if (n > destStateIndex) {
      installDiffs(destState.map,destination.diffs);
    }
  } else { // we have moved to a new state 
    //debugger;
    root = copyState(destState.state);
    remap(root,destState.map); 
    if (n > destStateIndex) {
      installDiffs(destState.map,destination.diffs);
    }
    if (vars.installRoot) {
	    vars.installRoot();
    }
  }
  if (vars.refresh) {
	   vars.refresh();
  }
  afterRestoreStateHooks.forEach((fn) => {fn();});
  currentHistoryIndex = n;
}


const undo = function () {
  let ln = history.length;
  if (ln > 1) {
    gotoState(currentHistoryIndex-1);
    // history.pop();
  } 
}

const next = function () {
  let ln = history.length; 
  if (currentHistoryIndex < ln-1) {
    gotoState(currentHistoryIndex  + 1);
  }
}

let stepInterval = 1000;

const oneStepPromise = function (interval,then) {
   let pr = new Promise(function (resolve,reject) {
     let ln = history.length;
     if (currentHistoryIndex === ln -1) {
      resolve("end");
     } else {
        setTimeout(() => {
          next();
         resolve('step')
        },interval);
     }
   });
   pr.then(then);
}

const oneStep =function (intv=1000) {
  oneStepPromise(intv,(val) => {});//console.log("Finished one step",val));
}

const animate = function (intv=1000) {
  let then;
  then = function (val) {
    if (val === 'step') {
      oneStepPromise(intv,then);
    } else {
      //console.log('finished animation');
    }
  }
  oneStepPromise(intv,then);
}

const encodeHistory = function () {
  return history.map((h) => isDiff(h)?h:{state:encode(h.state),map:encodeMap(h.state,h.map),kind:h.kind});
}

const decodeMap = function (state,map) {
  return map.map(function (path) {
    return {node1:evalPath(state,path)};
  });
}
   

const decodeHistory = function (h) {
  return h.map((he) => {
   if (isDiff(he)) return he;
   let state = deserialize(he.state);
   let map = decodeMap(state,he.map);
   let kind = he.kind;
   return {state,map,kind};
  });
}


const githubTest = function () {
  httpGet('https://raw.githubusercontent.com/chrisGoad/prototypetrees/dev/src/core/basic_ops.js',
          function (erm,rs) {
              debugger; //keep
          });
}

const turnIntoPromise = function (fn,input) {
  return new Promise(
    function (resolve,reject) {
      fn(input,function (err,rs) {
        if (err) { 
          reject(err); 
        } else {
          resolve(rs);
        }
      });
    });
}

/*
const httpGetPromise = function (url) {
  return new Promise(
    function (resolve,reject) {
      httpGetForInstall(url,function (err,rs) {
        if (err) { 
          reject(err); 
        } else {
          resolve(rs);
        }
      });
    });
}
*/
const collectRequires = function (h) {
  let accum = {};
  h.forEach(function (he) {
    if (!isDiff(he)) {
      let requires = he.state.__requires;
      requires.forEach(function (rq) {
        accum[rq] = 1;
      });
    }
  });
  return Object.getOwnPropertyNames(accum);
}
      

async function installHistory(isrc,cb) {
  //let jrs = await httpGetPromise(isrc);
  let jrs = await turnIntoPromise(httpGetForInstall,isrc);
  let rs = JSON.parse(jrs);
  let requires = collectRequires(rs);
  //await turnIntoPromise(loadRequires,['/shape/circle.js']);//requires);
  await turnIntoPromise(loadRequires,requires);
  history = decodeHistory(rs);

}


  

export {history,historyFailed,afterHistoryFailureHooks,beforeSaveStateHooks,afterSaveStateHooks,saveState,useDiffs,
        gotoState,undo,next,canRedo,currentHistoryIndex,afterRestoreStateHooks,oneStep,animate,encodeHistory,
        githubTest,installHistory,beforeSerializeState,afterSerializeState};
