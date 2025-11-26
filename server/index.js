const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = 'localhost';

// MIME types untuk berbagai file
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Helper function untuk serve file
function serveFile(filePath, res, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
            console.error(`Error reading file: ${filePath}`);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    let filePath = '';
    let contentType = 'text/html';

    // Routing
    if (req.url === '/' || req.url === '/catalog') {
        filePath = path.join(__dirname, '../html/catalog.html');
    } else if (req.url === '/sign-in') {
        filePath = path.join(__dirname, '../html/sign-in.html');
    } else if (req.url === '/sign-up') {
        filePath = path.join(__dirname, '../html/sign-up.html');
    } else if (req.url.startsWith('/details')) {
        filePath = path.join(__dirname, '../html/details.html');
    } else if (req.url === '/entry_form') {
        filePath = path.join(__dirname, '../html/entry_form.html');
    }
    // Serve static assets (CSS, JS, images, icons)
    else if (req.url.startsWith('/css/') ||
        req.url.startsWith('/js/') ||
        req.url.startsWith('/images/') ||
        req.url.startsWith('/icons/')) {
        filePath = path.join(__dirname, '..', req.url);
        const ext = path.extname(filePath);
        contentType = MIME_TYPES[ext] || 'application/octet-stream';
    }
    // Handle unknown routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Page Not Found</h1>');
        return;
    }

    // Serve the file
    serveFile(filePath, res, contentType);
});

// Start server
server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
    console.log(`Serving files from: ${path.join(__dirname, '..')}`);
    console.log('\nAvailable routes:');
    console.log(`  http://${HOST}:${PORT}/           → Catalog`);
    console.log(`  http://${HOST}:${PORT}/sign-in     → Sign In`);
    console.log(`  http://${HOST}:${PORT}/sign-up     → Sign Up`);
    console.log(`  http://${HOST}:${PORT}/details     → Recipe Details`);
    console.log(`  http://${HOST}:${PORT}/entry_form  → Create Recipe`);
});
