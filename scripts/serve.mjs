import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
http.createServer(async (req,res) => {
  try {
    let route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(route==='/' || route==='/index.html') route='/index.html';
    else if(['/privacidade','/termos','/politica-de-privacidade','/termos-de-uso'].includes(route.replace(/\/$/,''))) route=route.replace(/\/$/,'')+'/index.html';
    let file=path.resolve(root,'.'+route);
    if(!file.startsWith(root+path.sep)) {res.writeHead(403); return res.end();}
    const data=await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'});res.end(data);
  } catch {res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Página não encontrada.');}
}).listen(4187,'127.0.0.1',()=>console.log('Prévia: http://127.0.0.1:4187'));
