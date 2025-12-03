/**
 * Main Router
 * 
 * Central routing untuk semua API endpoints.
 * File ini menghandle:
 * - Authentication routes (/api/auth/*)
 * - Recipe routes (/api/recipes/*)
 * - Route matching
 * - Middleware application
 * 
 * Cara kerja:
 * 1. Parse request URL dan method
 * 2. Match dengan route patterns
 * 3. Apply middleware (auth jika perlu)
 * 4. Call controller yang sesuai
 */

const authController = require('../controllers/authController');
const recipeController = require('../controllers/recipeController');
const { authenticate } = require('../middleware/auth');
const { handleError, notFound, methodNotAllowed } = require('../middleware/errorHandler');
const { parseBody, matchRoute, getPath, parseQueryString } = require('./apiHandler');

/**
 * Route handler utama untuk semua API requests
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
async function handleAPIRequest(req, res) {
    try {
        // Get path tanpa query string
        const path = getPath(req.url);
        const method = req.method;

        console.log(`[API] ${method} ${path}`);

        // ============= AUTHENTICATION ROUTES =============

        // POST /api/auth/signup - Register
        if (path === '/api/auth/signup' && method === 'POST') {
            const body = await parseBody(req);
            req.body = body;
            return authController.signUp(req, res);
        }

        // POST /api/auth/signin - Login
        if (path === '/api/auth/signin' && method === 'POST') {
            const body = await parseBody(req);
            req.body = body;
            return authController.signIn(req, res);
        }

        // POST /api/auth/signout - Logout (requires auth)
        if (path === '/api/auth/signout' && method === 'POST') {
            // Apply auth middleware
            return authenticate(req, res, () => {
                authController.signOut(req, res);
            });
        }

        // GET /api/auth/me - Get current user (requires auth)
        if (path === '/api/auth/me' && method === 'GET') {
            return authenticate(req, res, () => {
                authController.getCurrentUser(req, res);
            });
        }

        // ============= RECIPE ROUTES =============

        // GET /api/recipes - Get all recipes (public)
        if (path === '/api/recipes' && method === 'GET') {
            // Parse query params untuk future search functionality
            req.query = parseQueryString(req.url);
            return recipeController.getAllRecipes(req, res);
        }

        // POST /api/recipes - Create recipe (requires auth)
        if (path === '/api/recipes' && method === 'POST') {
            const body = await parseBody(req);
            req.body = body;

            return authenticate(req, res, () => {
                recipeController.createRecipe(req, res);
            });
        }

        // GET /api/recipes/:id - Get recipe by ID (public)
        const getRecipeMatch = matchRoute('/api/recipes/:id', path);
        if (getRecipeMatch.match && method === 'GET') {
            req.params = getRecipeMatch.params;
            return recipeController.getRecipeById(req, res);
        }

        // PUT /api/recipes/:id - Update recipe (requires auth)
        const updateRecipeMatch = matchRoute('/api/recipes/:id', path);
        if (updateRecipeMatch.match && method === 'PUT') {
            const body = await parseBody(req);
            req.body = body;
            req.params = updateRecipeMatch.params;

            return authenticate(req, res, () => {
                recipeController.updateRecipe(req, res);
            });
        }

        // DELETE /api/recipes/:id - Delete recipe (requires auth)
        const deleteRecipeMatch = matchRoute('/api/recipes/:id', path);
        if (deleteRecipeMatch.match && method === 'DELETE') {
            req.params = deleteRecipeMatch.params;

            return authenticate(req, res, () => {
                recipeController.deleteRecipe(req, res);
            });
        }

        // ============= 404 NOT FOUND =============
        // Jika tidak ada route yang match
        return notFound(res);

    } catch (error) {
        // Catch any errors dan handle dengan error handler
        console.error('Router error:', error);
        return handleError(error, res);
    }
}

/**
 * Check apakah request adalah API request
 * 
 * @param {string} url - Request URL
 * @returns {boolean} true jika API request
 */
function isAPIRequest(url) {
    return url.startsWith('/api/');
}

module.exports = {
    handleAPIRequest,
    isAPIRequest
};
