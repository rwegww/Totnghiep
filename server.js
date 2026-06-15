const fs = require('fs');
const http = require('http');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 8765);

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp3': 'audio/mpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
};

function sendFile(response, filePath) {
    response.writeHead(200, {
        'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
    });
    fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    const requestedPath = decodeURIComponent(requestUrl.pathname);
    let filePath = path.join(root, requestedPath);

    if (!filePath.startsWith(root)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    if (requestedPath === '/' || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(root, 'index.html');
    }

    sendFile(response, filePath);
});

server.listen(port, '127.0.0.1', () => {
    console.log(`Invitation site running at http://127.0.0.1:${port}`);
});
