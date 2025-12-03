/**
 * Authentication Controller - TODO: IMPLEMENT
 * 
 * Controller untuk handle authentication operations:
 * - Sign Up (Register user baru)
 * - Sign In (Login)
 * - Sign Out (Logout)
 * - Get Current User
 */

const User = require('../models/User');
const Session = require('../models/Session');
const { validateSignUp, validateSignIn } = require('../utils/validation');
const { serializeCookie, clearCookie } = require('../utils/cookies');
const config = require('../config/config');

/**
 * TODO: Implement signUp()
 * 
 * Sign Up - Register user baru
 * 
 * POST /api/auth/signup
 * Body: { username, email, password, confirmPassword }
 * 
 * @param {Object} req - Request object (dengan req.body berisi form data)
 * @param {Object} res - Response object
 * 
 * IMPLEMENTATION STEPS:
 * 1. Extract data dari req.body
 * 2. Validate dengan validateSignUp()
 * 3. Jika validation gagal, return 400 dengan details
 * 4. Create user dengan User.create()
 * 5. Create session dengan Session.create(newUser.id)
 * 6. Serialize cookie dengan serializeCookie()
 * 7. Send response 201 dengan Set-Cookie header dan user data
 * 8. Handle errors dengan try-catch
 */
async function signUp(req, res) {
    // TODO: Implement
    res.writeHead(501, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: false,
        error: {
            message: 'signUp() not implemented yet',
            code: 'NOT_IMPLEMENTED'
        }
    }));
}

/**
 * TODO: Implement signIn()
 * 
 * Sign In - Login user
 * 
 * POST /api/auth/signin
 * Body: { email, password }
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * IMPLEMENTATION STEPS:
 * 1. Extract email dan password dari req.body
 * 2. Validate dengan validateSignIn()
 * 3. Validate credentials dengan User.validateCredentials()
 * 4. Jika invalid, return 401
 * 5. Create session
 * 6. Serialize cookie
 * 7. Send response dengan Set-Cookie header
 */
async function signIn(req, res) {
    // TODO: Implement
    res.writeHead(501, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: false,
        error: {
            message: 'signIn() not implemented yet',
            code: 'NOT_IMPLEMENTED'
        }
    }));
}

/**
 * TODO: Implement signOut()
 * 
 * Sign Out - Logout user
 * 
 * POST /api/auth/signout
 * Requires: Authentication (session cookie)
 * 
 * @param {Object} req - Request object (req.session dari auth middleware)
 * @param {Object} res - Response object
 * 
 * IMPLEMENTATION STEPS:
 * 1. Get sessionId dari req.session.sessionId
 * 2. Destroy session dengan Session.destroy()
 * 3. Clear cookie dengan clearCookie()
 * 4. Send success response dengan clear cookie header
 */
async function signOut(req, res) {
    // TODO: Implement
    res.writeHead(501, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: false,
        error: {
            message: 'signOut() not implemented yet',
            code: 'NOT_IMPLEMENTED'
        }
    }));
}

/**
 * TODO: Implement getCurrentUser()
 * 
 * Get Current User - Get authenticated user info
 * 
 * GET /api/auth/me
 * Requires: Authentication (session cookie)
 * 
 * @param {Object} req - Request object (req.user dari auth middleware)
 * @param {Object} res - Response object
 * 
 * IMPLEMENTATION STEPS:
 * 1. Get user dari req.user (sudah di-set oleh auth middleware)
 * 2. Send user data dengan status 200
 */
async function getCurrentUser(req, res) {

    try {
        const user = req.user;

        const responseData = {
                success: true,
                data: {
                    user: user
                }
            }

        res.writeHead(200, {'Content-Type': 'application/json'});

        res.end(JSON.stringify(responseData));
    } catch (error) {
        console.log('Error getting current user: ', error);
    }

}

module.exports = {
    signUp,
    signIn,
    signOut,
    getCurrentUser
};
