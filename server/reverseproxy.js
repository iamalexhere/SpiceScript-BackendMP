/**
 * SpiceScript - Reverse Proxy Server
 * 
 * Client <--HTTPS--> Reverse Proxy <--HTTP--> Web Server
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration: Proxy listens on HTTPS, forwards to web server HTTP
const PROXY_PORT = process.env.PROXY_PORT || 8443;
const PROXY_HOST = process.env.PROXY_HOST || 'localhost';
const WEBSERVER_PORT = process.env.WEBSERVER_PORT || 3000;
const WEBSERVER_HOST = process.env.WEBSERVER_HOST || 'localhost';

// Load SSL certificates for HTTPS
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../private-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../certificate.pem'))
};

// Main handler: forwards HTTPS requests to HTTP web server
const proxyHandler = (clientReq, clientRes) => {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] ${clientReq.method} ${clientReq.url}`);

    // Prepare web server request with forwarded headers
    const serverOptions = {
        hostname: WEBSERVER_HOST,
        port: WEBSERVER_PORT,
        path: clientReq.url,
        method: clientReq.method,
        headers: {
            ...clientReq.headers,
            'X-Forwarded-For': clientReq.socket.remoteAddress,
            'X-Forwarded-Proto': 'https',
            'X-Forwarded-Host': clientReq.headers.host
        }
    };

    // Create HTTP request to web server
    const serverReq = http.request(serverOptions, (serverRes) => {
        // Forward web server response to client
        clientRes.writeHead(serverRes.statusCode, serverRes.headers);
        serverRes.pipe(clientRes);

        // Log completion
        serverRes.on('end', () => {
            const duration = Date.now() - startTime;
            console.log(`[${new Date().toISOString()}] ${clientReq.method} ${clientReq.url} - ${serverRes.statusCode} (${duration}ms)`);
        });
    });

    // Handle web server connection errors
    serverReq.on('error', (err) => {
        console.error('[Proxy Error]', err.message);
        if (!clientRes.headersSent) {
            clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
            clientRes.end('502 Bad Gateway - Web server unavailable');
        }
    });

    // Handle client errors
    clientReq.on('error', (err) => {
        console.error('[Client Error]', err.message);
        serverReq.destroy();
    });

    // Pipe client request body to web server
    clientReq.pipe(serverReq);
};

// Create HTTPS server
const proxyServer = https.createServer(sslOptions, proxyHandler);

// Start server
proxyServer.listen(PROXY_PORT, PROXY_HOST, () => {
    console.log('='.repeat(60));
    console.log('  SpiceScript Reverse Proxy Server');
    console.log('='.repeat(60));
    console.log(`  Reverse Proxy Server: https://${PROXY_HOST}:${PROXY_PORT}/`);
    console.log(`  Web Server:           http://${WEBSERVER_HOST}:${WEBSERVER_PORT}/`);
    console.log('='.repeat(60));
});
