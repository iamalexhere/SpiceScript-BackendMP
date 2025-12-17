/**
 * Cookie Utilities
 * 
 * File ini berisi helper functions untuk menangani cookies:
 * - Parse cookie dari request header
 * - Serialize cookie untuk response header
 * - Clear/delete cookie
 */

/**
 * Parse cookie string menjadi object
 * 
 * Contoh input: "sessionId=abc123; userId=456"
 * Contoh output: { sessionId: 'abc123', userId: '456' }
 * 
 * @param {string} cookieHeader - Cookie header string dari request
 * @returns {Object} Object berisi key-value pairs dari cookies
 */
function parseCookies(cookieHeader) {
    const cookies = {};

    // Jika tidak ada cookie header, return empty object
    if (!cookieHeader) {
        return cookies;
    }

    // DEBUG: Log raw cookie header
    console.log('[Cookies] Parsing Raw Cookie Header:', cookieHeader);

    // Split berdasarkan semicolon dan process setiap cookie
    cookieHeader.split(';').forEach(cookie => {
        // Split berdasarkan equals sign pertama
        const parts = cookie.trim().split('=');
        const name = parts[0];
        const value = parts.slice(1).join('='); // Join kembali jika value mengandung '='

        if (name) {
            // Decode URI component untuk handle special characters
            cookies[name] = decodeURIComponent(value);
        }
    });

    // DEBUG: Log parsed cookies
    console.log('[Cookies] Parsed Cookies:', cookies);

    return cookies;
}

/**
 * Serialize cookie menjadi string untuk Set-Cookie header
 * 
 * @param {string} name - Nama cookie
 * @param {string} value - Value cookie
 * @param {Object} options - Options untuk cookie (httpOnly, sameSite, maxAge, dll)
 * @returns {string} Cookie string untuk Set-Cookie header
 */
function serializeCookie(name, value, options = {}) {
    // DEBUG: Log serialization request
    console.log(`[Cookies] Serializing Cookie: ${name}=${value.substring(0, 10)}... (truncated)`);
    console.log('[Cookies] Cookie Options:', options);

    // Encode name dan value
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    // Tambahkan options
    if (options.maxAge) {
        // maxAge dalam detik untuk cookie
        cookie += `; Max-Age=${Math.floor(options.maxAge / 1000)}`;
    }

    if (options.path) {
        cookie += `; Path=${options.path}`;
    }

    if (options.domain) {
        cookie += `; Domain=${options.domain}`;
    }

    if (options.httpOnly) {
        cookie += '; HttpOnly';
    }

    if (options.secure) {
        cookie += '; Secure';
    }

    if (options.sameSite) {
        cookie += `; SameSite=${options.sameSite}`;
    }

    // DEBUG: Log final cookie string
    console.log('[Cookies] Final Set-Cookie String:', cookie);

    return cookie;
}

/**
 * Generate cookie string untuk clear/delete cookie
 * 
 * Cara delete cookie adalah dengan set Max-Age=0 atau expires di masa lalu
 * 
 * @param {string} name - Nama cookie yang akan dihapus
 * @param {Object} options - Options (path, domain)
 * @returns {string} Cookie string untuk clear cookie
 */
function clearCookie(name, options = {}) {
    console.log(`[Cookies] Clearing Cookie: ${name}`);
    return serializeCookie(name, '', {
        ...options,
        maxAge: 0 // Set maxAge 0 untuk immediate expiration
    });
}

module.exports = {
    parseCookies,
    serializeCookie,
    clearCookie
};
