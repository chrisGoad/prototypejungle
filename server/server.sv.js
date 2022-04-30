
const http = require('http');
const fs = require('fs');

const mtypes = {html:'text/html',js:'application/javascript',mjs:'application/javascript',json:'application/json','jpg':'image/jpeg',
                  css:'text/css',svg:'image/svg+xml',ico:'image/x-icon',gif:'image/gif'};
                  
const requestListener = function (req, res) {
	let iurl = req.url;
	let url = new URL('http://whatever'+iurl); // this url is constructed so that we can extract its parts
	let method = req.method;
	let ipath = url.pathname;
	let dot = ipath.lastIndexOf('.');
	let ext = ipath.substring(dot+1);
  //fpath = path in the file system relative to prototypejungle root
	let fpath = (ipath.substring(0,1) === '/')?ipath.substring(1):ipath; 
	//let fpath = (ipath.substring(0,5) === '/www/')?ipath.substring(1):'www'+ipath; 
	let ctype = mtypes[ext];
  console.log('');
  console.log('PrototypeJungle ipath ',ipath,' fpath ',fpath,'method=',method,'ctype=',ctype);
	let data;
  if (method === 'POST') {
		ctype = 'image/jpg';
		let chunks = [];
		let dln = 0;
		req.on('data', chunk => {
			  dln += chunk.length;
				chunks.push(chunk);
    });
    req.on('end', () => {
				let  rs = Buffer.concat(chunks,dln);
        res.end('ok');
				console.log('writing ',dln,' bytes');
				fs.writeFileSync(fpath,rs);

    });
    return;
	}
	let body,missing;
	if (fs.existsSync(fpath)) {
    body	= fs.readFileSync(fpath);
	} else {
		console.log('missing');
		missing = 1;
		body = '';
		ctype = 'text/plain';
	}
  let ln = body.length;
	console.log('reading',ln,'bytes');		
	res.writeHead(missing?404:200, {
    'Content-Length': ln,
	  'Content-Type': ctype+'; charset=utf-8'});
  res.end(body);

}

const server = http.createServer(requestListener);
server.listen(8081);