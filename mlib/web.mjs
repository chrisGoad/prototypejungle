//active

const rs =function (rs) {

// parameters: maxLoops, cPoints (initWeb(pnts), called by addWeb copies pnts into cPoints)
// used in pairFilter only: minConnnectorLength,maxConnectorLength

/* theory of operation.
addWeb(pnts,lineP) drops lines between points pnts[i], pnts[j],  where (1) pairFilter(i,j) returns true, and (2) there is no intersection with a segment that has already been dropped. lineP is the prototype for the lines drepped. */
let defaults = {webTries:5,maxLoops:Infinity};//,maxTriesPerEnd:20};
//defaults = {maxDrops:1000,dropTries:5,maxLoops:1000};

//core.require(function () {
Object.assign(rs,defaults);

rs.pairFilter = function (i,j) {
	let {maxConnectorLength:mxCln,minConnectorLength:mnCln=0,cPoints} = this;
	let pi = cPoints[i];
	let pj = cPoints[j];
	let d = pi.distance(pj);
	return (mnCln < d) && (d < mxCln);
}

rs.singletonFilter = function (i) {
	return true;
}



rs.beforeAddSeg = function (seg) {
}
rs.initWeb = function (pnts) {
	let {cPoints,nearbyPoints,connectSegs,shapes} = this;
  debugger;
  this.cPoints = pnts;
	if (!nearbyPoints) {
		this.nearbyPoints = [];
	}
	if (!connectSegs) {
		this.connectSegs = [];
	} 
	if (!shapes) {
		this.set('shapes',core.ArrayNode.mk());
	} 
}

rs.addSegs = function (lineP) {
	let {connectSegs,shortenBy=10} = this;
  let ln = connectSegs.length;
	for (let i=0;i<ln;i++) {
		for (let j=i+1;j<ln;j++) {
			let sgi = connectSegs[i];
			let sgj = connectSegs[j];
			if (((sgi.index0 === sgj.index0) && (sgi.index1 === sgj.index1)) ||
			    ((sgi.index0 === sgj.index1) && (sgi.index1 === sgj.index0))) {
						debugger;
					}
		}
	}
			
	for (let i=0;i<ln;i++) {
		let sg = connectSegs[i];
		let ssg = sg.lengthen(shortenBy);
		ssg.index0 = sg.index0;
		ssg.index1 = sg.index1;
	  let line = this.genLine(ssg,lineP);
		let {end0,end1} = ssg;
		if (this.colorFromPoint) {
			line.stroke = this.colorFromPoint(end0);
		}
    this.installLine(line);		
	}
}	

rs.removeFromNears = function (i,ni) {
	let {nearbyPoints:nbp} = this;
	let nearsi = nbp[i];
	let j = nearsi[ni];
	nearsi[ni] = -(j+1);
}
	

/* nears[i], initially, is the array of js such that pairFilter(i,j) is true. Segements are dropped by choosing a random i, and then a random j from among the nears
that has not yet been dropped. When a segment is dropped nears[i][j] is set to -1. realNears(nears) is the array of non-negative nears (this is used for choosing the random j)*/


rs.realNears = (nears) => {
	return nears.filter((i) => i>=0);
}
rs.rnearsIndex2NearsIndex = function (nears,ri) {
	let nl = nears.length;
	let cnt = 0;
	for (let i=0;i<nl;i++) {
		let iv = nears[i];
		if (iv >= 0) {
			if (cnt === ri) {
				return i;
			}
			cnt++;
		}
	}
	error('unexpected');
}
rs.rnearsIndex2NearsIndexViaIndexOf = function (nears,rnears,ri) {
  let v = rnears[ri];
	let rs = nears.indexOf(v);
	if (rs === -1) {
		console.log('unexpected');
		debugger;
	}
	return rs;
}
		
	
	
rs.generateWeb = function (iparams) {
  let props = ['points','lineP','minConnectorLength','maxConnectorLength','webTries','shortenBy','maxLoops'];
  let params = {};
  core.transferProperties(params,this,props);
  core.transferProperties(params,iparams,props);
	let {points:pnts,lineP,minConnectorLength,maxConnectorLength,webTries,shortenBy=10,maxLoops=Infinity} = params;
  
	if (pnts) {
		this.initWeb(pnts);
	}
	let {cPoints,nearbyPoints,connectSegs} = this;
	let nbp = this.nearbyPoints = [];
	const computeNears = () => {
		let {cPoints,nearbyPoints:nbp} = this;
		let cln = cPoints.length;
		for (let i=0;i<cln;i++) {
			let nears = [];
			for (let j=0;j<cln;j++) {
				if (i>=j) {
					continue;
				}
				if (this.pairFilter(i,j)) {
					nears.push(j);
				}
			}
			nbp.push(nears);
		}
		// now add the near pairs in the other direction
		for (let i=0;i<cln;i++) {
			let nearsi = nbp[i];
			nearsi.forEach( (j) => {
				if (i < j	) {
				  let nearsj = nbp[j];
				  nearsj.push(i); 
				}
			});
		}
	}
	
	computeNears();
	
	const copyNbp = function () {
		let rs = [];
		nbp.forEach((nears) => {
		  rs.push(nears.concat());
		});
		return rs;
	}

	const numPassFilter = function (total,filter) {
		if (!filter) {
			return total;
		}
		let rs = 0;
		for (let i=0;i<total;i++) {
			if (filter(i)) {
				rs++;
			}
		}
		return rs;
	}

	const randomFiltered = function (total,filter,numPass) {
		let rnv = Math.floor(numPass*Math.random());
		if (!filter) {
			return rnv;
		}
		let cnt = 0;
		for (let i=0;i<total;i++) {
			if (filter(i)) {
				if (cnt === rnv) {
					return i;
				}
				cnt++;
			}
		}
	}
		
	
	const isCandidateForI  =  (i) => { // returns the number of candidates for j
		let nears = nbp[i];
		if (!nears) {
			debugger;
		}
		let sf = this.singletonFilter(i);
		return sf?nears.length:0
	}
	
	const randomI = () => { // returns [i,numCandidates for j]
	  let ln  = nbp.length;
    let filter = (i) => {
			return isCandidateForI(i);
		};
		let npf = numPassFilter(ln,filter);
		if (npf === 0) {
			return [0,0];
		}
		let rf = randomFiltered(ln,filter,npf);
		let nc = isCandidateForI(rf);
		return [rf,nc];
	}
	
const removeFromNears = function (i,ni) {
	let nearsi = nbp[i];
	let j = nearsi[ni];
	nearsi[ni] = -1;
//	nearsi[ni] = -(j+1);
}

		
	const randomPairs = (i) => {
		if (this.choosePairs) {
		  let cp = this.choosePairs(i);
			if (cp === undefined) {
				debugger;
			}
			let rss = cp.map( (pr) => {
				let [i,ni] = pr;
				let nears = nbp[i];;
				let j = nears[ni];
				removeFromNears(i,ni);
				return [i,j];
			});
			return rss;
		}
		let nearsi = nbp[i];
		let rnearsi = this.realNears(nearsi);
	  let nl = rnearsi.length;
		if (nl === 0) {
			return [];
		}
		let rni = Math.floor(Math.random()*nl);
		let j = rnearsi[rni];
		let ni = this.rnearsIndex2NearsIndexViaIndexOf(nearsi,rnearsi,rni);
		this.removeFromNears(i,ni);
		return [[i,j]];
	}
	
	let candidates = []; // for debugging
	this.numDropped = 0;
	let tries = 0;
	for (let ii=0;ii<maxLoops;ii++)  {
		// debugger;
	   let [randI,numCandidates] = randomI();
		 console.log('numCandidates',numCandidates,'tries',tries);
		if (numCandidates === 0) {
			console.log ('no candidates');
			debugger;
			break;
		}
		let rc = randomPairs(randI);
		tries++;
		if (tries>=webTries) {
			console.log('tries exceeded ',webTries);
			break;
		}
		if (rc.length === 0) {
			continue;
		}
		rc.forEach( (rp) => {
			candidates.push(rp); // for debugging
			let [ri,rj] = rp;
			let rip = cPoints[ri];
			let rjp = cPoints[rj];
			if ((!rip) || (!rjp)) {
				debugger;
			}
			let rseg  = geom.LineSegment.mk(rip,rjp).lengthen(-10);
			/*if (lineP) {
				rseg.lineP = lineP;
			}*/
			let {end0,end1} = rseg;
			end0.gridc = rip.gridc;
			end1.gridc = rjp.gridc;
			let lnc = connectSegs.length;
			let fnd = 0;
			for (let i = 0;i<lnc;i++) {
				let csg = connectSegs[i];
				if (rseg.intersects(csg)) {
					fnd = 1;
					console.log('intersects','lnc',lnc);
					break;
				}
			}
			if ( !fnd) {
				console.log('added segment',this.numDropped);
				this.beforeAddSeg(ri,rj);
				tries = 0;
				rseg.index0 = ri;
		    rseg.index1 = rj;
				connectSegs.push(rseg);
				this.numDropped++;
			}
		});
	}
	if (pnts) {
	  this.addSegs(lineP);
	}
  debugger;
}	
}


export {rs};	
	
		
		
			
			
		