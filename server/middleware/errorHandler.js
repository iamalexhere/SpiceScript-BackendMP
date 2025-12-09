/**
 * Error Handler Middleware
 * 
 * Centralized error handling untuk consistent error responses
 * 
 * Digunakan sebagai last middleware dalam chain untuk catch semua errors
 */

const { sendJSON } = require('../routes/apiHandler');

/**
 * Send error response dengan format yang konsisten
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} code - Error code (optional)
 */
function sendError(req, res, statusCode, message, code = 'ERROR') {
    sendJSON(req, res, statusCode, {
        success: false,
        error: {
            message: message,
            code: code
        }
    });
}

/**
 * Handle different types of errors dan return appropriate response
 * 
 * @param {Error} error - Error object
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function handleError(error, req, res) {
    console.error('Error occurred:', error);

    // Validation errors
    if (error.name === 'ValidationError') {
        return sendError(req, res, 400, error.message, 'VALIDATION_ERROR');
    }

    // Authorization errors
    if (error.message.includes('Unauthorized')) {
        return sendError(req, res, 403, error.message, 'FORBIDDEN');
    }

    // Not found errors
    if (error.message.includes('not found') || error.message.includes('tidak ditemukan')) {
        return sendError(req, res, 404, error.message, 'NOT_FOUND');
    }

    // Duplicate/conflict errors
    if (error.message.includes('already exists') || error.message.includes('sudah digunakan')) {
        return sendError(req, res, 409, error.message, 'CONFLICT');
    }

    // Default: Internal server error
    return sendError(
        req,
        res,
        500,
        'Internal server error. Silakan coba lagi.',
        'INTERNAL_ERROR'
    );
}

/**
 * 404 Not Found handler
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function notFound(req, res) {
    sendError(req, res, 404, 'Endpoint tidak ditemukan', 'NOT_FOUND');
}

/**
 * 405 Method Not Allowed handler
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {string} allowedMethods - String of allowed methods (e.g., "GET, POST")
 */
function methodNotAllowed(req, res, allowedMethods = '') {
    res.setHeader('Allow', allowedMethods);
    sendError(req, res, 405, 'Method tidak diizinkan', 'METHOD_NOT_ALLOWED');
}

module.exports = {
    sendError,
    handleError,
    notFound,
    methodNotAllowed
};
