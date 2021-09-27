const port = 8888;
const hostname = '0.0.0.0';

const imageExt = ['.png', '.jpg', '.ico', '.svg'];
const mimeTypes = {
    'plain': 'text/plain',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml',
    '.ico': 'image/x-icon',
};


const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function (request, response) {
    console.log('type', request.method, "request", request.url)
    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.
        let filePath = "";
        if (request.url.indexOf("/api") !== 0) {
            filePath = './page' + request.url;
            if (filePath == './page/')
                filePath = './page/index.html';

            // 확장자 없을 때 자동으로 .html 추가
            if (path.extname(filePath) === '') {
                filePath += '.html';
            }
        } else filePath = request.url;

        let extname = String(path.extname(filePath)).toLowerCase();
        if (imageExt.indexOf(extname) !== -1) {
            filePath = './' + request.url;
        }
        let contentType = 'text/html';

        contentType = mimeTypes[extname] || 'application/octet-stream';
        if (filePath.indexOf("/api") === 0) {
            apiResponse(response, filePath);
        } else { // 파일 반환
            fileResponse(response, filePath);
        }
    });
}).listen(port, hostname);

console.log(`Server running at http://${hostname}:${port}/`);

function apiResponse(response, api) {
    let content = "wrong api";
    if (api.indexOf("GetData") !== -1) {
        const dummy = [{
            name: "good man",
            src: "video/good man.mp4",
            thumnail: "video/good man/thum1.png",
            type: "mp4"
        },
        {
            name: "good man 2",
            src: "video/good man 2.mp4",
            thumnail: "video/good man 2/thum1.png",
            type: "mp4"
        }];
        content = JSON.stringify(dummy);
    }
    response.writeHead(200, {
        'Content-Type': mimeTypes["plain"],
        'Access-Control-Allow-Origin': '*',
        'accept-ranges': 'bytes',
        'Content-length': content.length,
    });
    response.end(content, 'utf-8');
}


function fileResponse(response, filePath) {
    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {

            if (extname === '.ico') {
                response.writeHead(200, {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=345600',
                    'accept-ranges': 'bytes',
                    'Content-length': content.length,
                });
                response.end(content, 'utf-8');
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        }
    });
}