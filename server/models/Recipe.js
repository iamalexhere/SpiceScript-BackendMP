/**
 * Recipe Model - TODO: IMPLEMENT
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
 * TODO: Implement loadRecipes()
 * 
 * Load recipes dari file JSON
 * 
 * @returns {Array} Array of recipe objects
 * 
 * HINTS:
 * - Similar dengan User.loadUsers()
 * - Check file exists, read, parse JSON
 */
function loadRecipes() {
    // TODO: Implement
    
            // Cek apakah file ada
            try {
            if (!fs.existsSync(RECIPES_FILE)) {
                return [];
            }
    
            // Baca file
            const rawData = fs.readFileSync(RECIPES_FILE, 'utf-8');
    
            // cek jika string kosong
            if (!rawData.trim()) {
                return [];
            }
            // return ( string json jadi array object )
            return JSON.parse(rawData);
        } catch (error) {
            console.error('Error loading recipes:', error);
            return [];
        }
}

/**
 * TODO: Implement saveRecipes()
 * 
 * Save recipes ke file JSON
 * 
 * @param {Array} recipes - Array of recipe objects
 * 
 * HINTS:
 * - Similar dengan User.saveUsers()
 * - JSON.stringify dengan pretty print
 */
function saveRecipes(recipes) {
    // TODO: Implement
    throw new Error('saveRecipes() not implemented yet');
}

/**
 * TODO: Implement findAll()
 * 
 * Get semua recipes
 * 
 * @returns {Array} Array of all recipes
 * 
 * HINTS:
 * - Load dengan loadRecipes()
 * - Return semua recipes (tidak perlu filter password seperti User)
 */
function findAll() {
   const recipeslist = loadRecipes();
   return recipeslist;
    // return dalam bentuk array of object recipe
}

/**
 * TODO: Implement findById()
 * 
 * Find recipe by ID
 * 
 * @param {number} id - Recipe ID
 * @returns {Object|null} Recipe object atau null jika tidak found
 * 
 * HINTS:
 * - Load recipes
 * - Use find() method
 */
function findById(id) {
    // TODO: Implement
    const recipes = loadRecipes();
    
    //jaga jaga biar id nya number
    const recipesid = Number(id); 

    const recipe = recipes.find(r => r.id === recipesid) || null;
    return recipe;
}


/**
 * TODO: Implement findByAuthor()
 * 
 * Find recipes by author ID
 * 
 * @param {number} authorId - User ID dari author
 * @returns {Array} Array of recipes dari author tersebut
 * 
 * HINTS:
 * - Load recipes
 * - Use filter() untuk cari recipes dengan authorId === parseInt(authorId)
 */
function findByAuthor(authorId) {
    // TODO: Implement
    
    const recipes = loadRecipes();

    //jaga jaga biar authorId nya number
    const AuthorId = Number(authorId); 

    //return array yang resep nya id author nya sama dengan AuthorId
    return recipes.filter(r => r.authorId === AuthorId);
}

/**
 * TODO: Implement create()
 * 
 * Create recipe baru
 * 
 * @param {Object} recipeData - Data recipe baru
 * @param {number} authorId - User ID dari pembuat recipe
 * @param {string} authorName - Username dari pembuat recipe
 * @returns {Object} Created recipe
 * 
 * HINTS:
 * - Generate ID baru (max ID + 1)
 * - Create recipe object dengan fields:
 *   - recipeName, description, ingredients, directions dari recipeData
 *   - imagePath (default '../images/default-recipe.jpg' jika kosong)
 *   - authorId, authorName dari parameter
 *   - createdAt, updatedAt dengan new Date().toISOString()
 * - Add ke recipes array dan save
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
        imagePath: "../images/default-recipe.jpg",
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
 * TODO: Implement update()
 * 
 * Update recipe
 * 
 * @param {number} id - Recipe ID
 * @param {Object} updateData - Data yang akan diupdate
 * @param {number} userId - User ID yang melakukan update (untuk authorization)
 * @returns {Object|null} Updated recipe atau null jika tidak found/unauthorized
 * 
 * HINTS:
 * - Find recipe index
 * - Check authorization: recipes[index].authorId === userId
 * - Throw error jika bukan author: "Unauthorized: Anda hanya bisa mengubah resep Anda sendiri"
 * - Update dengan spread operator
 * - Prevent changing: id, authorId, authorName, createdAt
 * - Update updatedAt timestamp
 * - Save dan return
 */
function update(id, updateData, userId) {
    // TODO: Implement
    throw new Error('update() not implemented yet');
}

/**
 * TODO: Implement deleteRecipe()
 * 
 * Delete recipe
 * 
 * @param {number} id - Recipe ID
 * @param {number} userId - User ID yang melakukan delete (untuk authorization)
 * @returns {boolean} true jika berhasil delete, false jika tidak found
 * 
 * HINTS:
 * - Find recipe index
 * - Check authorization (sama seperti update)
 * - Remove dengan splice(index, 1)
 * - Save
 * - Return true/false
 */
function deleteRecipe(id, userId) {
    // TODO: Implement
    throw new Error('deleteRecipe() not implemented yet');
}

/**
 * TODO: Implement search()
 * 
 * Search recipes by name atau description
 * 
 * @param {string} query - Search query
 * @returns {Array} Array of matching recipes
 * 
 * HINTS:
 * - Load recipes
 * - Convert query ke toLowerCase()
 * - Use filter() untuk cari recipes yang recipeName atau description includes query
 */
function search(query) {
    // TODO: Implement
    throw new Error('search() not implemented yet');
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
