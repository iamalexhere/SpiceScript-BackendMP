/**
 * API Request Handler
 * 
 * Helper untuk:
 * - Parse HTTP request body (JSON)
 * - Extract URL parameters (e.g., /api/recipes/123 => { id: 123 })
 * - Match routes dengan pattern
 */

/**
 * Parse JSON body dari request
 * 
 * @param {Object} req - HTTP request object
 * @returns {Promise<Object>} Parsed JSON body
 */
const zlib = require('zlib');

/**
 * Parse JSON body dari request
 * 
 * @param {Object} req - HTTP request object
 * @returns {Promise<Object>} Parsed JSON body
 */
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        let chunkCount = 0;
        const startTime = Date.now();

        console.log('[parseBody] Starting to parse request body');

        // Collect data chunks
        req.on('data', chunk => {
            chunkCount++;
            body += chunk.toString();
            console.log(`[parseBody] Received chunk ${chunkCount}, size: ${chunk.length} bytes, total: ${body.length} bytes`);
        });

        // When complete, parse JSON
        req.on('end', () => {
            const duration = Date.now() - startTime;
            console.log(`[parseBody] Request body complete after ${duration}ms, total size: ${body.length} bytes, chunks: ${chunkCount}`);

            try {
                if (body) {
                    const parsed = JSON.parse(body);
                    console.log('[parseBody] JSON parsed successfully, keys:', Object.keys(parsed));
                    resolve(parsed);
                } else {
                    console.log('[parseBody] Empty body, returning empty object');
                    resolve({});
                }
            } catch (error) {
                console.error('[parseBody] Error parsing JSON body:', error.message);
                console.error('[parseBody] Body content (first 200 chars):', body.substring(0, 200));
                reject(new Error('Invalid JSON'));
            }
        });

        // Handle error
        req.on('error', error => {
            console.error('[parseBody] Request error:', error.message);
            reject(error);
        });
    });
}

/**
 * Match URL dengan route pattern dan extract parameters
 * 
 * Contoh:
 * - pattern: '/api/recipes/:id'
 * - url: '/api/recipes/123'
 * - result: { match: true, params: { id: '123' } }
 * 
 * @param {string} pattern - Route pattern (e.g., '/api/recipes/:id')
 * @param {string} url - Actual URL path
 * @returns {Object} { match: boolean, params: Object }
 */
function matchRoute(pattern, url) {
    // Convert pattern ke regex
    // :id => menjadi named capture group
    const paramNames = [];
    const regexPattern = pattern.replace(/:(\w+)/g, (match, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)'; // Match any non-slash characters
    });

    // Create regex dengan exact match (^ dan $)
    const regex = new RegExp(`^${regexPattern}$`);
    const matches = url.match(regex);

    if (!matches) {
        return { match: false, params: {} };
    }

    // Extract parameters
    const params = {};
    paramNames.forEach((name, index) => {
        params[name] = matches[index + 1];
    });

    return { match: true, params };
}

/**
 * Extract query parameters dari URL
 * 
 * Contoh:
 * - url: '/api/recipes?search=nasi&category=indonesian'
 * - result: { search: 'nasi', category: 'indonesian' }
 * 
 * @param {string} url - URL dengan query string
 * @returns {Object} Query parameters object
 */
function parseQueryString(url) {
    const queryIndex = url.indexOf('?');

    if (queryIndex === -1) {
        return {};
    }

    const queryString = url.substring(queryIndex + 1);
    const params = {};

    queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    });

    return params;
}

/**
 * Get path tanpa query string
 * 
 * @param {string} url - Full URL
 * @returns {string} Path saja tanpa query string
 */
function getPath(url) {
    const queryIndex = url.indexOf('?');
    return queryIndex === -1 ? url : url.substring(0, queryIndex);
}

/**
 * Send JSON response
 * 
 * @param {Object} req - Request object (needed for checking accept-encoding)
 * @param {Object} res - Response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Data to send
 */
function sendJSON(req, res, statusCode, data) {
    const jsonStr = JSON.stringify(data);
    const originalSize = Buffer.byteLength(jsonStr);
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const startTime = Date.now();

    console.log(`[sendJSON] Preparing response: status=${statusCode}, original size=${originalSize} bytes`);
    console.log(`[sendJSON] Client Accept-Encoding: ${acceptEncoding}`);

    // Cek GZIP support
    if (acceptEncoding.includes('gzip')) {
        console.log('[sendJSON] Client supports GZIP, attempting compression...');

        zlib.gzip(jsonStr, (err, buffer) => {
            const duration = Date.now() - startTime;

            if (!err) {
                const compressedSize = buffer.length;
                const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

                console.log(`[sendJSON] Compression successful in ${duration}ms`);
                console.log(`[sendJSON] Original: ${originalSize} bytes → Compressed: ${compressedSize} bytes (${ratio}% reduction)`);

                res.writeHead(statusCode, {
                    'Content-Type': 'application/json',
                    'Content-Encoding': 'gzip',
                    'Content-Length': compressedSize
                });
                res.end(buffer);

                console.log(`[sendJSON] Response sent with GZIP compression`);
            } else {
                console.error(`[sendJSON] Compression failed after ${duration}ms:`, err.message);
                console.log('[sendJSON] Falling back to uncompressed response');

                // Fallback jika kompresi gagal
                res.writeHead(statusCode, {
                    'Content-Type': 'application/json',
                    'Content-Length': originalSize
                });
                res.end(jsonStr);

                console.log(`[sendJSON] Response sent without compression (fallback)`);
            }
        });
    } else {
        // No Compression
        console.log('[sendJSON] Client does not support GZIP, sending uncompressed');

        res.writeHead(statusCode, {
            'Content-Type': 'application/json',
            'Content-Length': originalSize
        });
        res.end(jsonStr);

        const duration = Date.now() - startTime;
        console.log(`[sendJSON] Response sent without compression in ${duration}ms, size: ${originalSize} bytes`);
    }
}

module.exports = {
    parseBody,
    matchRoute,
    parseQueryString,
    getPath,
    sendJSON
};
