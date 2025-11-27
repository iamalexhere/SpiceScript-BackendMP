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
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        // Collect data chunks
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // When complete, parse JSON
        req.on('end', () => {
            try {
                if (body) {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                } else {
                    resolve({});
                }
            } catch (error) {
                console.error('Error parsing JSON body:', error);
                reject(new Error('Invalid JSON'));
            }
        });

        // Handle error
        req.on('error', error => {
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
 * @param {Object} res - Response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Data to send
 */
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

module.exports = {
    parseBody,
    matchRoute,
    parseQueryString,
    getPath,
    sendJSON
};
