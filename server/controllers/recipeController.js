/**
 * Recipe Controller
 * 
 * Controller untuk handle recipe operations:
 * - Get all recipes (public)
 * - Get recipe by ID (public)
 * - Create recipe (authenticated only)
 * - Update recipe (author only)
 * - Delete recipe (author only)
 */
const Recipe = require('../models/Recipe');
const { validateRecipe } = require('../utils/validation');


/**
 * Get All Recipes
 * 
 * GET /api/recipes
 * Public access
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function getAllRecipes(req, res) {
    try {
        const recipes = Recipe.findAll();

        const responseData = {
            success: true,
            data: {
                recipes: recipes
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify(responseData));

    } catch (error) {
        console.log('Error finding all recipes:', error);
    }
}

/**
 * Get Recipe by ID
 * 
 * GET /api/recipes/:id
 * Public access
 * 
 * @param {Object} req - Request object (req.params.id dari router)
 * @param {Object} res - Response object
 */
async function getRecipeById(req, res) {
    try {
        const recipeId = req.params.id;
        const recipe = Recipe.findById(recipeId);

        if (!recipe) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: 'Recipe not found',
                    code: 'NOT_FOUND'
                }
            }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: { recipe }
        }));
    } catch (error) {
        console.error('Error getting recipe by ID:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            error: {
                message: 'Internal server error',
                code: 'INTERNAL_ERROR'
            }
        }));
    }
}

/**
 * Create New Recipe
 * 
 * POST /api/recipes
 * Requires: Authentication
 * Body: { recipeName, description, imagePath, ingredients, directions }
 * 
 * @param {Object} req - Request object (req.user dari auth middleware)
 * @param {Object} res - Response object
 */
async function createRecipe(req, res) {
    const recipeData = {
        recipeName: req.body.recipeName,
        description: req.body.description,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
    };

    if (!validateRecipe(recipeData)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing required fields' }));
        return;
    }

    const user = req.user;
    if (!user || !user.id || !user.username) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
    }

    const newRecipe = Recipe.create(recipeData, user.id, user.username);

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(newRecipe));
}

/**
 * Update Recipe
 * 
 * PUT /api/recipes/:id
 * Requires: Authentication + Author authorization
 * Body: { recipeName, description, imagePath, ingredients, directions }
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function updateRecipe(req, res) {
    try {
        const recipeId = req.params.id;
        const updateData = {
            recipeName: req.body.recipeName,
            description: req.body.description,
            ingredients: req.body.ingredients,
            directions: req.body.directions
        };

        if (!validateRecipe(updateData)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: 'Missing required fields',
                    code: 'VALIDATION_ERROR'
                }
            }));
            return;
        }

        const user = req.user;
        if (!user || !user.id) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: 'Unauthorized',
                    code: 'UNAUTHORIZED'
                }
            }));
            return;
        }

        const updatedRecipe = Recipe.update(recipeId, updateData, user.id);

        if (!updatedRecipe) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: 'Recipe not found',
                    code: 'NOT_FOUND'
                }
            }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: { recipe: updatedRecipe }
        }));
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: error.message,
                    code: 'FORBIDDEN'
                }
            }));
        } else {
            console.error('Error updating recipe:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: 'Internal server error',
                    code: 'INTERNAL_ERROR'
                }
            }));
        }
    }
}

/**
 * Delete Recipe
 * 
 * DELETE /api/recipes/:id
 * Requires: Authentication + Author authorization
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function deleteRecipe(req, res) {
    try {
        const recipeId = req.params.id;
        const user = req.user;

        if (!user || !user.id) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: 'Unauthorized',
                    code: 'UNAUTHORIZED'
                }
            }));
            return;
        }

        const deleted = Recipe.delete(recipeId, user.id);

        if (!deleted) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: 'Recipe not found',
                    code: 'NOT_FOUND'
                }
            }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'Recipe deleted successfully'
        }));
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: error.message,
                    code: 'FORBIDDEN'
                }
            }));
        } else {
            console.error('Error deleting recipe:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: {
                    message: 'Internal server error',
                    code: 'INTERNAL_ERROR'
                }
            }));
        }
    }
}

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe
};
