import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('out');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};
http
  .createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const candidate = path.resolve(root, '.' + pathname);
    if (candidate !== root && !candidate.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    let file = [candidate, candidate + '.html', path.join(candidate, 'index.html')].find(
      (p) => fs.existsSync(p) && fs.statSync(p).isFile(),
    );
    const status = file ? 200 : 404;
    file ||= path.join(root, '404.html');
    res.writeHead(status, {
      'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(3000, '127.0.0.1', () => console.log('Export preview http://127.0.0.1:3000'));
