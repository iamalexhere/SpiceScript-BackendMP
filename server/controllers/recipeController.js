/**
 * Recipe Controller - TODO: IMPLEMENT
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
 * TODO: Implement getAllRecipes()
 * 
 * Get All Recipes
 * 
 * GET /api/recipes
 * Public access
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * IMPLEMENTATION STEPS:
 * 1. Get all recipes dengan Recipe.findAll()
 * 2. Send response 200 dengan recipes data dan count
 */
async function getAllRecipes(req, res) {
    // TODO: Implement

    // res.writeHead(501, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify({
    //     success: false,
    //     error: {
    //         message: 'getAllRecipes() not implemented yet',
    //         code: 'NOT_IMPLEMENTED'
    //     }
    // }));

    try {
        const DataRecipe = Recipe.findAll();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: {
                DataRecipe,
                count: DataRecipe.length
            }
        }));
    } catch (error) {
        console.error('Error in getAllRecipes:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'Failed to getAll recipes',
            error: error.message
        }));
    }
    
}

/**
 * TODO: Implement getRecipeById()
 * 
 * Get Recipe by ID
 * 
 * GET /api/recipes/:id
 * Public access
 * 
 * @param {Object} req - Request object (req.params.id dari router)
 * @param {Object} res - Response object
 * 
 * IMPLEMENTATION STEPS:
 * 1. Get recipeId dari req.params.id
 * 2. Find recipe dengan Recipe.findById()
 * 3. Jika tidak found, return 404
 * 4. Send recipe data dengan status 200
 */
async function getRecipeById(req, res) {
    // TODO: Implement
    
    // res.writeHead(501, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify({
    //     success: false,
    //     error: {
    //         message: 'getRecipeById() not implemented yet',
    //         code: 'NOT_IMPLEMENTED'
    //     }
    // }));

        try {
        const recipeId = req.params && req.params.id;

        //jika server menerima request tanpa id / kosong
        if (!recipeId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Recipe ID tidak diterima'
            }));
            return;
        }

        //ambil recip berdasarkan id dari models Recipe.js
        const recipe = Recipe.findById(recipeId);

        //jika server menerima request id tapi id nya tidak ada di data recipe
        if (!recipe) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Recipe tidak ditemukan'
            }));
            return;
        }

        //kirim resep ke user
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: {
                recipe
            }
        }));


    } catch (error) {
        console.error('Error in getRecipeById:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'Error ketika mengambil resep berdasarkan ID',
            error: error.message
        }));
    }
}

/**
 * TODO: Implement createRecipe()
 * 
 * Create New Recipe
 * 
 * POST /api/recipes
 * Requires: Authentication
 * Body: { recipeName, description, imagePath, ingredients, directions }
 * 
 * @param {Object} req - Request object (req.user dari auth middleware)
 * @param {Object} res - Response object
 * 
 * IMPLEMENTATION STEPS:
 * 1. Get recipeData dari req.body
 * 2. Validate dengan validateRecipe()
 * 3. Jika validation gagal, return 400
 * 4. Get user dari req.user
 * 5. Create recipe dengan Recipe.create(recipeData, user.id, user.username)
 * 6. Send response 201 dengan recipe data
 */
async function createRecipe(req, res) {
    // TODO: Implement
    res.writeHead(501, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: false,
        error: {
            message: 'createRecipe() not implemented yet',
            code: 'NOT_IMPLEMENTED'
        }
    }));
}

/**
 * TODO: Implement updateRecipe()
 * 
 * Update Recipe
 * 
 * PUT /api/recipes/:id
 * Requires: Authentication + Author authorization
 * Body: { recipeName, description, imagePath, ingredients, directions }
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * IMPLEMENTATION STEPS:
 * 1. Get recipeId dari req.params.id
 * 2. Get updateData dari req.body
 * 3. Validate dengan validateRecipe()
 * 4. Get user dari req.user
 * 5. Update dengan Recipe.update(recipeId, updateData, user.id)
 * 6. Handle authorization error (403)
 * 7. Handle not found (404)
 * 8. Send updated recipe dengan status 200
 */
async function updateRecipe(req, res) {
    // TODO: Implement
    res.writeHead(501, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: false,
        error: {
            message: 'updateRecipe() not implemented yet',
            code: 'NOT_IMPLEMENTED'
        }
    }));
}

/**
 * TODO: Implement deleteRecipe()
 * 
 * Delete Recipe
 * 
 * DELETE /api/recipes/:id
 * Requires: Authentication + Author authorization
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * 
 * IMPLEMENTATION STEPS:
 * 1. Get recipeId dari req.params.id
 * 2. Get user dari req.user
 * 3. Delete dengan Recipe.delete(recipeId, user.id)
 * 4. Handle authorization error (403)
 * 5. Handle not found (404)
 * 6. Send success message dengan status 200
 */
async function deleteRecipe(req, res) {
    // TODO: Implement
    res.writeHead(501, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: false,
        error: {
            message: 'deleteRecipe() not implemented yet',
            code: 'NOT_IMPLEMENTED'
        }
    }));
}

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe
};
