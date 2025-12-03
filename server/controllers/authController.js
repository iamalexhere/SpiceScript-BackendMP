/**
 * Authentication Controller - TODO: IMPLEMENT
 *
 * Controller untuk handle authentication operations:
 * - Sign Up (Register user baru)
 * - Sign In (Login)
 * - Sign Out (Logout)
 * - Get Current User
 */

const User = require('../models/User')
const Session = require('../models/Session')
const { validateSignUp, validateSignIn } = require('../utils/validation')
const { serializeCookie, clearCookie } = require('../utils/cookies')
const config = require('../config/config')

/**
 * Implement signUp()
 *
 * Sign Up - Register user baru
 *
 * POST /api/auth/signup
 * Body: { username, email, password, confirmPassword }
 *
 * @param {Object} req - Request object (dengan req.body berisi form data)
 * @param {Object} res - Response object
 *
 */
async function signUp(req, res) {
    try {
        // Extract data dari req.body
        const { username, email, password, confirmPassword } = req.body

        // Validate dengan validateSignUp()
        const validationErrors = validateSignUp({
            username,
            email,
            password,
            confirmPassword,
        })

        // Jika validation gagal, return 400 dengan details
        if (validationErrors) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            return res.end(
                JSON.stringify({
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors,
                })
            )
        }

        // Create user dengan User.create()
        const newUser = User.create({ username, email, password })

        // Create session dengan Session.create(newUser.id)
        const sessionId = Session.create(newUser.id)

        // Serialize cookie dengan serializeCookie()
        const cookie = serializeCookie(
            config.session.cookieName,
            sessionId,
            config.session.maxAge
        )

        // Send response 201 dengan Set-Cookie header dan user data
        res.writeHead(201, {
            'Content-Type': 'application/json',
            'Set-Cookie': cookie,
        })
        res.end(
            JSON.stringify({
                success: true,
                message: 'User registered and logged in successfully',
                user: newUser,
            })
        )
    } catch (error) {
        // Handle errors dengan try-catch
        console.error('Sign up error:', error.message)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                success: false,
                message: error.message,
                code: 'SIGNUP_FAILED',
            })
        )
    }
}

/**
 * Implement signIn()
 *
 * Sign In - Login user
 *
 * POST /api/auth/signin
 * Body: { email, password }
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function signIn(req, res) {
    try {
        // Extract email dan password dari req.body
        const { email, password } = req.body

        // Validate dengan validateSignIn()
        const validationErrors = validateSignIn({ email, password })
        if (validationErrors) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            return res.end(
                JSON.stringify({
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors,
                })
            )
        }

        // Validate credentials dengan User.validateCredentials()
        const user = User.validateCredentials(email, password)

        // Jika invalid, return 401
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' })
            return res.end(
                JSON.stringify({
                    success: false,
                    message: 'Invalid email/username or password',
                    code: 'INVALID_CREDENTIALS',
                })
            )
        }

        // Create session
        const sessionId = Session.create(user.id)

        // Serialize cookie
        const cookie = serializeCookie(
            config.session.cookieName,
            sessionId,
            config.session.maxAge
        )

        // Send response dengan Set-Cookie header
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': cookie,
        })
        res.end(
            JSON.stringify({
                success: true,
                message: 'Login successful',
                user: user,
            })
        )
    } catch (error) {
        console.error('Sign in error:', error.message)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                success: false,
                message: 'Internal Server Error during sign in',
                code: 'SERVER_ERROR',
            })
        )
    }
}

/**
 * Implement signOut()
 *
 * Sign Out - Logout user
 *
 * POST /api/auth/signout
 * Requires: Authentication (session cookie)
 *
 * @param {Object} req - Request object (req.session dari auth middleware)
 * @param {Object} res - Response object
 */
async function signOut(req, res) {
    try {
        // Get sessionId dari req.session.sessionId
        const sessionId = req.session ? req.session.sessionId : null

        if (sessionId) {
            // Destroy session dengan Session.destroy()
            Session.destroy(sessionId)
        }

        // Clear cookie dengan clearCookie()
        const cookie = clearCookie(config.session.cookieName)

        // Send success response dengan clear cookie header
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': cookie,
        })
        res.end(
            JSON.stringify({
                success: true,
                message: 'Logout successful',
            })
        )
    } catch (error) {
        console.error('Sign out error:', error.message)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                success: false,
                message: 'Internal Server Error during sign out',
                code: 'SERVER_ERROR',
            })
        )
    }
}

/**
 * Implement getCurrentUser()
 *
 * Get Current User - Get authenticated user info
 *
 * GET /api/auth/me
 * Requires: Authentication (session cookie)
 *
 * @param {Object} req - Request object (req.user dari auth middleware)
 * @param {Object} res - Response object
 */
async function getCurrentUser(req, res) {
    try {
        // Get user dari req.user (sudah di-set oleh auth middleware)
        const user = req.user

        // Send user data dengan status 200
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                success: true,
                user: user,
            })
        )
    } catch (error) {
        console.error(error.message)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(
            JSON.stringify({
                success: false,
                message: 'Internal Server Error',
                code: 'SERVER_ERROR',
            })
        )
    }
}

module.exports = {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
}
