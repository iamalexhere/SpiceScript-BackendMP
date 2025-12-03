/**
 * User Model
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

const fs = require('fs')
const path = require('path')
const config = require('../config/config')
const { hashPassword, verifyPassword } = require('../utils/crypto')

// Path ke file users.json
const USERS_FILE = config.dataFiles.users

/**
 * Load users dari file JSON
 *
 * @returns {Array} Array of user objects
 */
function loadUsers() {
    //Check apakah file exists dengan fs.existsSync()
    if (!fs.existsSync(USERS_FILE)) {
        return []
    }
    try {
        //Read file dengan fs.readFileSync()
        const data = fs.readFileSync(USERS_FILE, 'utf-8')
        //Parse JSON dengan JSON.parse()
        return JSON.parse(data)
    } catch (error) {
        console.error('Error loading users')
        return []
    }
}

/**
 * Implement saveUsers()
 *
 * Save users ke file JSON
 *
 * @param {Array} users - Array of user objects
 */
function saveUsers(users) {
    try {
        //Convert ke JSON dengan JSON.stringify(users, null, 2)
        const jsonString = JSON.stringify(users, null, 2)
        //Write ke file dengan fs.writeFileSync()
        fs.writeFileSync(USERS_FILE, jsonString)
    } catch (error) {
        console.error('gagal save user')
        return
    }
}

/**
 * Get semua users (tanpa password)
 *
 * @returns {Array} Array of users (without password field)
 */
function findAll() {
    try {
        //Load users dengan loadUsers()
        const users = loadUsers()
        //Use map() untuk transform array
        return users.map((user) => {
            //Remove password dari setiap user dengan destructuring
            const { password, ...userSisa } = user
            return userSisa
        })
    } catch (error) {
        console.error('gagal find all')
        return
    }
}

/**
 * Find user by ID
 *
 * @param {number} id - User ID
 * @returns {Object|null} User object (tanpa password) atau null jika tidak found
 */
function findById(id) {
    try {
        //Load users dengan loadUsers()
        const users = loadUsers()
        const intId = parseInt(id)
        //Use find() method untuk cari user dengan id === parseInt(id)
        const foundUser = users.find((user) => user.id === intId)

        if (!foundUser) {
            console.log('user not found')
            return null
        }
        //Remove password sebelum return
        const { password, ...userSisa } = foundUser

        return userSisa
    } catch (error) {
        console.error('gagal findById')
        return null
    }
}

/**
 * Find user by email
 *
 * @param {string} email - Email address
 * @returns {Object|null} User object (DENGAN password) atau null
 */
function findByEmail(email) {
    try {
        //Load users dengan loadUsers()
        const users = loadUsers()
        const lowerEmail = email.toLowerCase()
        //Use find() method
        //Compare email dengan toLowerCase() untuk case-insensitive
        const foundUser = users.find(
            (user) => user.email.toLowerCase() == lowerEmail
        )
        //Return dengan password (needed untuk authentication)
        return foundUser
    } catch (error) {
        console.log('gagal findByEmail')
        return null
    }
}

/**
 * Find user by username
 *
 * @param {string} username - Username
 * @returns {Object|null} User object (DENGAN password) atau null
 */
function findByUsername(username) {
    try {
        const users = loadUsers()
        const lowerUsername = username.toLowerCase()
        //Compare username dengan toLowerCase()
        const foundUser = users.find(
            (user) => user.username.toLowerCase() == lowerUsername
        )
        return foundUser
    } catch (error) {
        console.log('gagal mencari user')
        return null
    }
}

/**
 * Create user baru
 *
 * @param {Object} userData - Data user baru
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Plain text password (akan di-hash)
 * @returns {Object} Created user (tanpa password)
 */
function create(userData) {
    const users = loadUsers()

    //Check duplicate username dengan findByUsername()
    if (findByUsername(userData.username)) {
        throw new Error('username sudah digunakan')
    }

    //Check duplicate email dengan findByEmail()
    if (findByEmail(userData.email)) {
        throw new Error('email sudah digunakan')
    }

    //Generate ID baru: Math.max(...users.map(u => u.id)) + 1
    const newId = Math.max(...users.map((u) => u.id)) + 1
    //Hash password dengan hashPassword(userData.password)
    const hashedPassword = hashPassword(userData.password)

    //Create user object dengan timestamps (new Date().toISOString())
    const newUser = {
        id: newId,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
    }

    //Add ke array users dan save
    users.push(newUser)
    saveUsers(users)

    // Return user tanpa password
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
}

/**
 * Validate password untuk user
 *
 * @param {string} email - Email atau username
 * @param {string} password - Plain text password
 * @returns {Object|null} User object (tanpa password) jika valid, null jika tidak
 */
function validateCredentials(email, password) {
    //Try find by email dulu
    let user = findByEmail(email)

    //Jika tidak found, try find by username
    if (!user) {
        user = findByUsername(email)
    }

    //Jika user tidak ditemukan, return null
    if (!user) {
        return null
    }

    //Verify password dengan verifyPassword(password, user.password)
    const isValid = verifyPassword(password, user.password)

    if (isValid) {
        //Return user tanpa password jika valid
        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    }

    return null
}

/**
 * Update user data
 *
 * @param {number} id - User ID
 * @param {Object} updateData - Data yang akan diupdate
 * @returns {Object|null} Updated user atau null jika tidak found
 */
function update(id, updateData) {
    const users = loadUsers()
    //Find user index dengan findIndex()
    const index = users.findIndex((u) => u.id === parseInt(id))

    if (index === -1) {
        return null
    }

    const user = users[index]

    //Prevent changing id dan password
    const { id: _, password: __, ...dataToUpdate } = updateData

    //Update fields dengan spread operator
    //Update updatedAt timestamp
    const updatedUser = {
        ...user,
        ...dataToUpdate,
        updatedAt: new Date().toISOString(),
    }

    users[index] = updatedUser
    //Save dan return
    saveUsers(users)
    return updatedUser
}

module.exports = {
    findAll,
    findById,
    findByEmail,
    findByUsername,
    create,
    validateCredentials,
    update,
}
