/**
 * Authentication Middleware
 * 
 * Middleware untuk:
 * - Verify session dari cookie
 * - Protect routes yang require authentication
 * - Attach user data ke request object
 * 
 * Cara pakai:
 * - Import middleware ini di router
 * - Apply ke routes yang perlu authentication
 */

const { parseCookies } = require('../utils/cookies');
const Session = require('../models/Session');
const User = require('../models/User');
const config = require('../config/config');

/**
 * Authentication Middleware
 * 
 * Middleware ini akan:
 * 1. Parse cookies dari request
 * 2. Extract session ID
 * 3. Validate session
 * 4. Load user data
 * 5. Attach user ke req.user
 * 
 * Jika gagal authentication:
 * - Return 401 Unauthorized
 * - Request tidak dilanjutkan ke handler berikutnya
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Function} next - Next middleware/handler function
 */
function authenticate(req, res, next) {
    try {
        // 1. Parse cookies dari header
        const cookies = parseCookies(req.headers.cookie);

        // 2. Get session ID dari cookie
        const sessionId = cookies[config.session.cookieName];

        if (!sessionId) {
            // Tidak ada session cookie
            return sendUnauthorized(res, 'Session tidak ditemukan. Silakan login.');
        }

        // 3. Validate session
        const session = Session.findById(sessionId);

        if (!session) {
            // Session tidak valid atau expired
            return sendUnauthorized(res, 'Session tidak valid atau sudah expired. Silakan login kembali.');
        }

        // 4. Load user data
        const user = User.findById(session.userId);

        if (!user) {
            // User tidak ditemukan (mungkin sudah dihapus)
            Session.destroy(sessionId);
            return sendUnauthorized(res, 'User tidak ditemukan. Silakan login kembali.');
        }

        // 5. Attach user dan session ke request object
        // Ini bisa diakses di handler selanjutnya via req.user dan req.session
        req.user = user;
        req.session = session;

        // Lanjutkan ke handler berikutnya
        next();

    } catch (error) {
        console.error('Authentication error:', error);
        return sendUnauthorized(res, 'Authentication error');
    }
}

/**
 * Helper function untuk send 401 Unauthorized response
 * 
 * @param {Object} res - HTTP response object
 * @param {string} message - Error message
 */
function sendUnauthorized(res, message = 'Unauthorized') {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: false,
        error: {
            message: message,
            code: 'UNAUTHORIZED'
        }
    }));
}

module.exports = {
    authenticate
};
