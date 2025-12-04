/**
 * SpiceScript - Main Server File
 * 
 * Server utama untuk aplikasi SpiceScript.
 * 
 * Fungsi:
 * - Serve static files (HTML, CSS, JS, images untuk frontend)
 * - Handle API requests untuk authentication dan recipes
 * - Route management
 * 
 * Cara menjalankan:
 * node server/index.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const { handleAPIRequest, isAPIRequest } = require('./routes/router');

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

/**
 * Helper function untuk serve static file
 * 
 * @param {string} filePath - Path ke file
 * @param {Object} res - Response object
 * @param {string} contentType - MIME type
 */
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

/**
 * Main HTTP Server
 * 
 * Handles:
 * 1. API requests (/api/*) -> router
 * 2. Static HTML pages -> serve HTML files
 * 3. Static assets -> serve CSS, JS, images
 */
const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);

    // ============= API REQUESTS =============
    // Jika request ke /api/*, delegate ke API router
    if (isAPIRequest(req.url)) {
        return handleAPIRequest(req, res);
    }

    // ============= STATIC FILE SERVING =============
    let filePath = '';
    let contentType = 'text/html';

    // Routing untuk HTML pages
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

/**
 * Start Server
 */
server.listen(config.server.port, config.server.host, () => {
    console.log('='.repeat(60));
    console.log('  SpiceScript Server Started');
    console.log('='.repeat(60));
    console.log(`  Server running at http://${config.server.host}:${config.server.port}/`);
    console.log(`  Serving files from: ${path.join(__dirname, '..')}`);
    console.log('');
    console.log('  Available Pages:');
    console.log(`    http://${config.server.host}:${config.server.port}/           → Catalog (Home)`);
    console.log(`    http://${config.server.host}:${config.server.port}/sign-in     → Sign In`);
    console.log(`    http://${config.server.host}:${config.server.port}/sign-up     → Sign Up`);
    console.log(`    http://${config.server.host}:${config.server.port}/details     → Recipe Details`);
    console.log(`    http://${config.server.host}:${config.server.port}/entry_form  → Create Recipe`);
    console.log('');
    console.log('  API Endpoints:');
    console.log(`    POST http://${config.server.host}:${config.server.port}/api/auth/signup    → Register`);
    console.log(`    POST http://${config.server.host}:${config.server.port}/api/auth/signin    → Login`);
    console.log(`    POST http://${config.server.host}:${config.server.port}/api/auth/signout   → Logout`);
    console.log(`    GET  http://${config.server.host}:${config.server.port}/api/auth/me        → Get Current User`);
    console.log(`    GET  http://${config.server.host}:${config.server.port}/api/recipes        → Get All Recipes`);
    console.log(`    GET  http://${config.server.host}:${config.server.port}/api/recipes/:id    → Get Recipe by ID`);
    console.log(`    POST http://${config.server.host}:${config.server.port}/api/recipes        → Create Recipe`);
    console.log(`    PUT  http://${config.server.host}:${config.server.port}/api/recipes/:id    → Update Recipe`);
    console.log(`    DEL  http://${config.server.host}:${config.server.port}/api/recipes/:id    → Delete Recipe`);
    console.log('='.repeat(60));
    console.log('');
    console.log('  Test Users (untuk login):');
    console.log('    Username: john.doe@example.com     | Password: password123');
    console.log('    Username: jane.smith@example.com   | Password: mypassword');
    console.log('    Username: peter.martin@example.com | Password: testpass');
    console.log('='.repeat(60));
});
