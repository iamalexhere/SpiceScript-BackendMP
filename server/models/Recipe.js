/**
 * Recipe Model
 * 
 * Model untuk mengelola data recipes:
 * - CRUD operations untuk recipes
 * - Read/write dari/ke recipes.json
 * - Authorization check (user hanya bisa edit/delete resep sendiri)
 * 
 * Data structure untuk Recipe:
 * {
 *   id: number,
 *   recipeName: string,
 *   description: string,
 *   imagePath: string,
 *   ingredients: string,
 *   directions: string,
 *   authorId: number,
 *   authorName: string,
 *   createdAt: string (ISO date),
 *   updatedAt: string (ISO date)
 * }
 */

const fs = require('fs');
const config = require('../config/config');
const recipes = [];

// Path ke file recipes.json
const RECIPES_FILE = config.dataFiles.recipes;

/**
 * Load recipes dari file JSON
 * 
 * @returns {Array} Array of recipe objects
 */
function loadRecipes() {
    try {
        // Cek apakah file recipes json ada
        // fs.existsSync digunakan untuk memeriksa secara sinkronus apakah file path ada
        if (!fs.existsSync(RECIPES_FILE)) {
            return [];
        }

        // fs.readFileSync digunakan untuk membaca isi file secara sinkronus
        const content = fs.readFileSync(RECIPES_FILE, 'utf-8');

        // Parse json ke js object
        const recipes = JSON.parse(content);

        return recipes;
    } catch (error) {
        console.log('Error loading recipes:', error);
        return [];
    }
}

/**
 * Save recipes ke file JSON
 * 
 * @param {Array} recipes - Array of recipe objects
 */
function saveRecipes(recipes) {
    try {
        const data = JSON.stringify(recipes, null, 2);
        fs.writeFileSync(RECIPES_FILE, data, 'utf-8');
    } catch (error) {
        console.error('Error saving recipes:', error);
        throw error;
    }
}

/**
 * Get semua recipes
 * 
 * @returns {Array} Array of all recipes
 */
function findAll() {
    return loadRecipes();
}

/**
 * Find recipe by ID
 * 
 * @param {number} id - Recipe ID
 * @returns {Object|null} Recipe object atau null jika tidak found
 */
function findById(id) {
    const recipes = loadRecipes();
    return recipes.find(recipe => recipe.id === parseInt(id)) || null;
}

/**
 * Find recipes by author ID
 * 
 * @param {number} authorId - User ID dari author
 * @returns {Array} Array of recipes dari author tersebut
 */
function findByAuthor(authorId) {
    const recipes = loadRecipes();
    return recipes.filter(recipe => recipe.authorId === parseInt(authorId));
}

/**
 * Create recipe baru
 * 
 * @param {Object} recipeData - Data recipe baru
 * @param {number} authorId - User ID dari pembuat recipe
 * @param {string} authorName - Username dari pembuat recipe
 * @returns {Object} Created recipe
 */
function create(recipeData, authorId, authorName) {
    const data = fs.readFileSync(RECIPES_FILE, 'utf8');
    const recipes = JSON.parse(data);

    const maxId = Math.max(...recipes.map(r => r.id));
    const newId = maxId + 1;

    const newRecipe = {
        id: newId,
        recipeName: recipeData.recipeName,
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        directions: recipeData.directions,
        imagePath: recipeData.imagePath || "/images/default-recipe.jpg",
        authorId: authorId,
        authorName: authorName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    recipes.push(newRecipe);
    fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2), 'utf8');

    return newRecipe;
}

/**
 * Update recipe
 * 
 * @param {number} id - Recipe ID
 * @param {Object} updateData - Data yang akan diupdate
 * @param {number} userId - User ID yang melakukan update (untuk authorization)
 * @returns {Object|null} Updated recipe atau null jika tidak found/unauthorized
 */
function update(id, updateData, userId) {
    const recipes = loadRecipes();
    const index = recipes.findIndex(recipe => recipe.id === parseInt(id));

    if (index === -1) {
        return null;
    }

    if (recipes[index].authorId !== parseInt(userId)) {
        throw new Error('Unauthorized: Anda hanya bisa mengubah resep Anda sendiri');
    }

    const updatedRecipe = {
        ...recipes[index],
        ...updateData,
        id: recipes[index].id,
        authorId: recipes[index].authorId,
        authorName: recipes[index].authorName,
        createdAt: recipes[index].createdAt,
        updatedAt: new Date().toISOString()
    };

    recipes[index] = updatedRecipe;
    saveRecipes(recipes);

    return updatedRecipe;
}

/**
 * Delete recipe
 * 
 * @param {number} id - Recipe ID
 * @param {number} userId - User ID yang melakukan delete (untuk authorization)
 * @returns {boolean} true jika berhasil delete, false jika tidak found
 */
function deleteRecipe(id, userId) {
    const recipes = loadRecipes();
    const index = recipes.findIndex(recipe => recipe.id === parseInt(id));

    if (index === -1) {
        return false;
    }

    if (recipes[index].authorId !== parseInt(userId)) {
        throw new Error('Unauthorized: Anda hanya bisa menghapus resep Anda sendiri');
    }

    recipes.splice(index, 1);
    saveRecipes(recipes);

    return true;
}

/**
 * Search recipes by name atau description
 * 
 * @param {string} query - Search query
 * @returns {Array} Array of matching recipes
 */
function search(query) {
    const recipes = loadRecipes();
    const searchQuery = query.toLowerCase();

    return recipes.filter(recipe => {
        const nameMatch = recipe.recipeName.toLowerCase().includes(searchQuery);
        const descMatch = recipe.description.toLowerCase().includes(searchQuery);
        return nameMatch || descMatch;
    });
}

module.exports = {
    findAll,
    findById,
    findByAuthor,
    create,
    update,
    delete: deleteRecipe,
    search
};
