/**
 * Cryptography Utilities
 * 
 * File ini berisi fungsi-fungsi untuk:
 * - Hash password menggunakan PBKDF2 (Password-Based Key Derivation Function 2)
 * - Verify password terhadap hash
 * - Generate session ID yang secure
 * 
 * Menggunakan built-in crypto module dari Node.js
 */

const crypto = require('crypto');
const config = require('../config/config');

/**
 * Hash password menggunakan PBKDF2
 * 
 * PBKDF2 adalah algoritma yang direkomendasikan untuk password hashing karena:
 * - Slow by design (mencegah brute force attacks)
 * - Menggunakan salt (mencegah rainbow table attacks)
 * - Configurable iterations (bisa disesuaikan untuk keamanan lebih)
 * 
 * Format hash: salt:hash
 * Salt disimpan bersama hash agar bisa diverify nanti
 * 
 * @param {string} password - Plain text password
 * @returns {string} Hashed password dalam format "salt:hash"
 */
function hashPassword(password) {
    // Generate random salt (16 bytes = 128 bits)
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash password dengan PBKDF2
    const hash = crypto.pbkdf2Sync(
        password,                       // Password yang akan di-hash
        salt,                           // Salt untuk randomization
        config.crypto.iterations,       // Jumlah iterations (100000)
        config.crypto.keyLength,        // Length dari derived key (64 bytes)
        config.crypto.digest            // Digest algorithm (sha512)
    ).toString('hex');

    // Return dalam format salt:hash
    // Kita simpan salt karena diperlukan untuk verifikasi
    return `${salt}:${hash}`;
}

/**
 * Verify password terhadap hash yang tersimpan
 * 
 * @param {string} password - Plain text password yang akan diverify
 * @param {string} storedHash - Stored hash dari database dalam format "salt:hash"
 * @returns {boolean} true jika password cocok, false jika tidak
 */
function verifyPassword(password, storedHash) {
    // Split stored hash menjadi salt dan hash
    const [salt, originalHash] = storedHash.split(':');

    // Hash password yang diinput dengan salt yang sama
    const hash = crypto.pbkdf2Sync(
        password,
        salt,
        config.crypto.iterations,
        config.crypto.keyLength,
        config.crypto.digest
    ).toString('hex');

    // Compare hash menggunakan timingSafeEqual untuk mencegah timing attacks
    // timingSafeEqual membandingkan dua buffer dengan waktu yang konstan
    return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(originalHash)
    );
}

/**
 * Generate session ID yang cryptographically secure
 * 
 * SECURITY IMPLEMENTATION:
 * - Uses crypto.randomBytes(32) for true randomness (256 bits of entropy)
 * - NOT derived from any secret or user data
 * - Impossible to tamper with or forge
 * - Each session ID is unique and unpredictable
 * 
 * HOW IT WORKS:
 * 1. Generate 32 random bytes (256 bits)
 * 2. Convert to hex string (64 characters)
 * 3. Send to client as cookie value
 * 4. Store mapping sessionId → userId in sessions.json on server
 * 
 * WHY THIS IS SECURE:
 * - Client only gets random string (cannot guess other users' session IDs)
 * - Actual user data (userId) stored server-side
 * - Even if attacker gets session ID, they can't derive user info from it
 * - 2^256 possible values = practically unguessable
 * 
 * @returns {string} Random session ID (64 hex characters)
 * 
 * @example
 * const sessionId = generateSessionId();
 * // Returns: "3f7a9b2c8e1d4f6a5..."  (64 chars)
 */
function generateSessionId() {
    // Generate 32 random bytes dan convert ke hex string
    // 32 bytes = 256 bits of entropy (sangat secure)
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate random string untuk testing atau other purposes
 * 
 * @param {number} length - Panjang string dalam bytes
 * @returns {string} Random hex string
 */
function generateRandomString(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

module.exports = {
    hashPassword,
    verifyPassword,
    generateSessionId,
    generateRandomString
};
