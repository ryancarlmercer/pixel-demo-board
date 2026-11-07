const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
http.createServer((req,res) => {
  const pathname = new URL(req.url,'http://localhost').pathname;
  const file = {'/':'index.html','/index.html':'index.html','/puppet.js':'puppet.js'}[pathname];
  if (!file) {res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':'text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  fs.createReadStream(path.join(root,file)).pipe(res);
}).listen(17432,'127.0.0.1',()=>console.log('Fridge Puppet: http://127.0.0.1:17432'));
