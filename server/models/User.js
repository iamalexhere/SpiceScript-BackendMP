/**
 * User Model - TODO: IMPLEMENT
 * 
 * Model untuk mengelola data user:
 * - CRUD operations untuk users
 * - Read/write dari/ke users.json
 * - Password hashing dan validation
 * 
 * Data structure untuk User:
 * {
 *   id: number,
 *   username: string,
 *   email: string,
 *   password: string (hashed),
 *   createdAt: string (ISO date),
 *   updatedAt: string (ISO date)
 * }
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const { hashPassword, verifyPassword } = require('../utils/crypto');

// Path ke file users.json
const USERS_FILE = config.dataFiles.users;

/**
 * TODO: Implement loadUsers()
 * 
 * Load users dari file JSON
 * 
 * @returns {Array} Array of user objects
 * 
 * HINTS:
 * - Check apakah file exists dengan fs.existsSync()
 * - Read file dengan fs.readFileSync()
 * - Parse JSON dengan JSON.parse()
 * - Handle error dengan try-catch
 */
function loadUsers() {
    // TODO: Implement
    throw new Error('loadUsers() not implemented yet');
}

/**
 * TODO: Implement saveUsers()
 * 
 * Save users ke file JSON
 * 
 * @param {Array} users - Array of user objects
 * 
 * HINTS:
 * - Convert ke JSON dengan JSON.stringify(users, null, 2)
 * - Write ke file dengan fs.writeFileSync()
 * - Handle error dengan try-catch
 */
function saveUsers(users) {
    // TODO: Implement
    throw new Error('saveUsers() not implemented yet');
}

/**
 * TODO: Implement findAll()
 * 
 * Get semua users (tanpa password)
 * 
 * @returns {Array} Array of users (without password field)
 * 
 * HINTS:
 * - Load users dengan loadUsers()
 * - Remove password dari setiap user dengan destructuring
 * - Use map() untuk transform array
 */
function findAll() {
    // TODO: Implement
    throw new Error('findAll() not implemented yet');
}

/**
 * TODO: Implement findById()
 * 
 * Find user by ID
 * 
 * @param {number} id - User ID
 * @returns {Object|null} User object (tanpa password) atau null jika tidak found
 * 
 * HINTS:
 * - Load users dengan loadUsers()
 * - Use find() method untuk cari user dengan id === parseInt(id)
 * - Remove password sebelum return
 */
function findById(id) {
    // TODO: Implement
    throw new Error('findById() not implemented yet');
}

/**
 * TODO: Implement findByEmail()
 * 
 * Find user by email
 * 
 * @param {string} email - Email address
 * @returns {Object|null} User object (DENGAN password) atau null
 * 
 * HINTS:
 * - Load users dengan loadUsers()
 * - Use find() method
 * - Compare email dengan toLowerCase() untuk case-insensitive
 * - Return dengan password (needed untuk authentication)
 */
function findByEmail(email) {
    // TODO: Implement
    throw new Error('findByEmail() not implemented yet');
}

/**
 * TODO: Implement findByUsername()
 * 
 * Find user by username
 * 
 * @param {string} username - Username
 * @returns {Object|null} User object (DENGAN password) atau null
 * 
 * HINTS:
 * - Similar dengan findByEmail()
 * - Compare username dengan toLowerCase()
 */
function findByUsername(username) {
    // TODO: Implement
    throw new Error('findByUsername() not implemented yet');
}

/**
 * TODO: Implement create()
 * 
 * Create user baru
 * 
 * @param {Object} userData - Data user baru
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Plain text password (akan di-hash)
 * @returns {Object} Created user (tanpa password)
 * 
 * HINTS:
 * - Check duplicate username dengan findByUsername()
 * - Check duplicate email dengan findByEmail()
 * - Generate ID baru: Math.max(...users.map(u => u.id)) + 1
 * - Hash password dengan hashPassword(userData.password)
 * - Create user object dengan timestamps (new Date().toISOString())
 * - Add ke array users dan save
 */
function create(userData) {
    // TODO: Implement
    throw new Error('create() not implemented yet');
}

/**
 * TODO: Implement validateCredentials()
 * 
 * Validate password untuk user
 * 
 * @param {string} email - Email atau username
 * @param {string} password - Plain text password
 * @returns {Object|null} User object (tanpa password) jika valid, null jika tidak
 * 
 * HINTS:
 * - Try find by email dulu
 * - Jika tidak found, try find by username
 * - Verify password dengan verifyPassword(password, user.password)
 * - Return user tanpa password jika valid
 */
function validateCredentials(email, password) {
    // TODO: Implement
    throw new Error('validateCredentials() not implemented yet');
}

/**
 * TODO: Implement update()
 * 
 * Update user data
 * 
 * @param {number} id - User ID
 * @param {Object} updateData - Data yang akan diupdate
 * @returns {Object|null} Updated user atau null jika tidak found
 * 
 * HINTS:
 * - Find user index dengan findIndex()
 * - Update fields dengan spread operator
 * - Update updatedAt timestamp
 * - Prevent changing id dan password
 * - Save dan return
 */
function update(id, updateData) {
    // TODO: Implement
    throw new Error('update() not implemented yet');
}

module.exports = {
    findAll,
    findById,
    findByEmail,
    findByUsername,
    create,
    validateCredentials,
    update
};
