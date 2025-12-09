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
const { sendJSON } = require('../routes/apiHandler');


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

        sendJSON(req, res, 200, responseData);

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
            sendJSON(req, res, 404, {
                success: false,
                error: {
                    message: 'Recipe not found',
                    code: 'NOT_FOUND'
                }
            });
            return;
        }

        sendJSON(req, res, 200, {
            success: true,
            data: { recipe }
        });
    } catch (error) {
        console.error('Error getting recipe by ID:', error);
        console.error('Error getting recipe by ID:', error);
        sendJSON(req, res, 500, {
            success: false,
            error: {
                message: 'Internal server error',
                code: 'INTERNAL_ERROR'
            }
        });
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
    try {
        // Check if request is multipart/form-data
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('multipart/form-data')) {
            return sendJSON(req, res, 400, {
                success: false,
                error: {
                    message: 'Content-Type must be multipart/form-data',
                    code: 'INVALID_CONTENT_TYPE'
                }
            });
        }

        // Parse multipart form data
        const { parseMultipartForm } = require('../utils/multipartParser');
        const { fields, files } = await parseMultipartForm(req, './images');

        const recipeData = {
            recipeName: fields.recipeName,
            description: fields.description,
            ingredients: fields.ingredients,
            directions: fields.directions,
        };

        // Validate recipe data
        const validation = validateRecipe(recipeData);
        if (!validation.valid) {
            if (!validation.valid) {
                return sendJSON(req, res, 400, {
                    success: false,
                    error: {
                        message: 'Missing required fields',
                        code: 'VALIDATION_ERROR',
                        details: validation.errors
                    }
                });
            }
            return;
        }

        // Validate image is uploaded
        if (!files.image) {
            if (!files.image) {
                return sendJSON(req, res, 400, {
                    success: false,
                    error: {
                        message: 'Recipe image is required',
                        code: 'IMAGE_REQUIRED'
                    }
                });
            }
            return;
        }

        // Validate image type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(files.image.contentType)) {
            // Delete uploaded file
            const fs = require('fs');
            try { fs.unlinkSync(files.image.filepath); } catch (e) { }

            return sendJSON(req, res, 400, {
                success: false,
                error: {
                    message: 'Only JPEG, PNG, and WebP images are allowed',
                    code: 'INVALID_IMAGE_TYPE'
                }
            });
        }

        // Validate image size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (files.image.size > maxSize) {
            // Delete uploaded file
            const fs = require('fs');
            try { fs.unlinkSync(files.image.filepath); } catch (e) { }

            return sendJSON(req, res, 400, {
                success: false,
                error: {
                    message: 'Image size must be less than 5MB',
                    code: 'IMAGE_TOO_LARGE'
                }
            });
        }

        // Check authentication
        const user = req.user;
        if (!user || !user.id || !user.username) {
            // Delete uploaded file
            const fs = require('fs');
            try { fs.unlinkSync(files.image.filepath); } catch (e) { }

            return sendJSON(req, res, 401, {
                success: false,
                error: {
                    message: 'Unauthorized',
                    code: 'UNAUTHORIZED'
                }
            });
        }

        // Set image path (relative to web root)
        recipeData.imagePath = `/images/${files.image.filename}`;

        // Create recipe
        const newRecipe = Recipe.create(recipeData, user.id, user.username);

        sendJSON(req, res, 201, {
            success: true,
            data: {
                recipe: newRecipe
            }
        });
    } catch (error) {
        console.error('Error creating recipe:', error);
        console.error('Error creating recipe:', error);
        sendJSON(req, res, 500, {
            success: false,
            error: {
                message: 'Internal server error',
                code: 'INTERNAL_ERROR'
            }
        });
    }
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
        const contentType = req.headers['content-type'];

        let updateData = {};
        let newImagePath = null;

        // Check if multipart/form-data (with possible file upload)
        if (contentType && contentType.includes('multipart/form-data')) {
            const { parseMultipartForm } = require('../utils/multipartParser');
            const { fields, files } = await parseMultipartForm(req, './images');

            updateData = {
                recipeName: fields.recipeName,
                description: fields.description,
                ingredients: fields.ingredients,
                directions: fields.directions
            };

            // If new image uploaded, validate and use it
            if (files.image) {
                // Validate image type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!allowedTypes.includes(files.image.contentType)) {
                    const fs = require('fs');
                    try { fs.unlinkSync(files.image.filepath); } catch (e) { }

                    return sendJSON(req, res, 400, {
                        success: false,
                        error: {
                            message: 'Only JPEG, PNG, and WebP images are allowed',
                            code: 'INVALID_IMAGE_TYPE'
                        }
                    });
                }

                // Validate image size (max 5MB)
                const maxSize = 5 * 1024 * 1024;
                if (files.image.size > maxSize) {
                    const fs = require('fs');
                    try { fs.unlinkSync(files.image.filepath); } catch (e) { }

                    return sendJSON(req, res, 400, {
                        success: false,
                        error: {
                            message: 'Image size must be less than 5MB',
                            code: 'IMAGE_TOO_LARGE'
                        }
                    });
                }

                newImagePath = `/images/${files.image.filename}`;
            }
        } else {
            // JSON request (fallback)
            updateData = {
                recipeName: req.body.recipeName,
                description: req.body.description,
                ingredients: req.body.ingredients,
                directions: req.body.directions
            };
        }

        const validation = validateRecipe(updateData);
        if (!validation.valid) {
            return sendJSON(req, res, 400, {
                success: false,
                error: {
                    message: 'Missing required fields',
                    code: 'VALIDATION_ERROR',
                    details: validation.errors
                }
            });
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

        // If new image was uploaded, add to updateData
        if (newImagePath) {
            updateData.imagePath = newImagePath;
        }

        const updatedRecipe = Recipe.update(recipeId, updateData, user.id);

        if (!updatedRecipe) {
            return sendJSON(req, res, 404, {
                success: false,
                error: {
                    message: 'Recipe not found',
                    code: 'NOT_FOUND'
                }
            });
        }

        sendJSON(req, res, 200, {
            success: true,
            data: { recipe: updatedRecipe }
        });
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            sendJSON(req, res, 403, {
                success: false,
                error: {
                    message: error.message,
                    code: 'FORBIDDEN'
                }
            });
        } else {
            console.error('Error updating recipe:', error);
            sendJSON(req, res, 500, {
                success: false,
                error: {
                    message: 'Internal server error',
                    code: 'INTERNAL_ERROR'
                }
            });
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
            return sendJSON(req, res, 404, {
                success: false,
                error: {
                    message: 'Recipe not found',
                    code: 'NOT_FOUND'
                }
            });
        }

        sendJSON(req, res, 200, {
            success: true,
            message: 'Recipe deleted successfully'
        });
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            sendJSON(req, res, 403, {
                success: false,
                error: {
                    message: error.message,
                    code: 'FORBIDDEN'
                }
            });
        } else {
            console.error('Error deleting recipe:', error);
            sendJSON(req, res, 500, {
                success: false,
                error: {
                    message: 'Internal server error',
                    code: 'INTERNAL_ERROR'
                }
            });
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
