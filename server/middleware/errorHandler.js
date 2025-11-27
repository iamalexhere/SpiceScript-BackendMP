/**
 * Error Handler Middleware
 * 
 * Centralized error handling untuk consistent error responses
 * 
 * Digunakan sebagai last middleware dalam chain untuk catch semua errors
 */

/**
 * Send error response dengan format yang konsisten
 * 
 * @param {Object} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} code - Error code (optional)
 */
function sendError(res, statusCode, message, code = 'ERROR') {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: false,
        error: {
            message: message,
            code: code
        }
    }));
}

/**
 * Handle different types of errors dan return appropriate response
 * 
 * @param {Error} error - Error object
 * @param {Object} res - HTTP response object
 */
function handleError(error, res) {
    console.error('Error occurred:', error);

    // Validation errors
    if (error.name === 'ValidationError') {
        return sendError(res, 400, error.message, 'VALIDATION_ERROR');
    }

    // Authorization errors
    if (error.message.includes('Unauthorized')) {
        return sendError(res, 403, error.message, 'FORBIDDEN');
    }

    // Not found errors
    if (error.message.includes('not found') || error.message.includes('tidak ditemukan')) {
        return sendError(res, 404, error.message, 'NOT_FOUND');
    }

    // Duplicate/conflict errors
    if (error.message.includes('already exists') || error.message.includes('sudah digunakan')) {
        return sendError(res, 409, error.message, 'CONFLICT');
    }

    // Default: Internal server error
    return sendError(
        res,
        500,
        'Internal server error. Silakan coba lagi.',
        'INTERNAL_ERROR'
    );
}

/**
 * 404 Not Found handler
 * 
 * @param {Object} res - HTTP response object
 */
function notFound(res) {
    sendError(res, 404, 'Endpoint tidak ditemukan', 'NOT_FOUND');
}

/**
 * 405 Method Not Allowed handler
 * 
 * @param {Object} res - HTTP response object
 * @param {string} allowedMethods - String of allowed methods (e.g., "GET, POST")
 */
function methodNotAllowed(res, allowedMethods = '') {
    res.writeHead(405, {
        'Content-Type': 'application/json',
        'Allow': allowedMethods
    });
    res.end(JSON.stringify({
        success: false,
        error: {
            message: 'Method tidak diizinkan',
            code: 'METHOD_NOT_ALLOWED',
            allowedMethods: allowedMethods
        }
    }));
}

module.exports = {
    sendError,
    handleError,
    notFound,
    methodNotAllowed
};
