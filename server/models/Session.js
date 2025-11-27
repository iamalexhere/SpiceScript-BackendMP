/**
 * Session Model - TODO: IMPLEMENT
 * 
 * Model untuk mengelola user sessions:
 * - Create session baru ketika user login
 * - Find/validate session
 * - Delete session ketika user logout
 * - Cleanup expired sessions
 * - Persist sessions ke sessions.json
 * 
 * Session structure:
 * {
 *   sessionId: string,
 *   userId: number,
 *   createdAt: string (ISO date),
 *   expiresAt: string (ISO date)
 * }
 */

const fs = require('fs');
const config = require('../config/config');
const { generateSessionId } = require('../utils/crypto');

// Path ke file sessions.json
const SESSIONS_FILE = config.dataFiles.sessions;

// In-memory sessions storage
let sessions = [];

/**
 * TODO: Implement load()
 * 
 * Load sessions dari file JSON
 * Dipanggil saat server startup
 * 
 * HINTS:
 * - Check file exists
 * - Read dan parse JSON
 * - Set ke variable sessions
 * - Call cleanup() setelah load
 */
function load() {
    // TODO: Implement
    throw new Error('load() not implemented yet');
}

/**
 * TODO: Implement save()
 * 
 * Save sessions ke file JSON
 * 
 * @param {Array} sessionsToSave - Array of session objects (optional, default ke in-memory sessions)
 * 
 * HINTS:
 * - Similar dengan saveUsers/saveRecipes
 * - Use sessionsToSave parameter atau default ke global sessions variable
 */
function save(sessionsToSave = sessions) {
    // TODO: Implement
    throw new Error('save() not implemented yet');
}

/**
 * TODO: Implement create()
 * 
 * Create session baru
 * 
 * @param {number} userId - User ID
 * @returns {string} Session ID
 * 
 * HINTS:
 * - Generate sessionId dengan generateSessionId()
 * - Calculate expiresAt: new Date(Date.now() + config.session.maxAge)
 * - Create session object dengan sessionId, userId, createdAt, expiresAt
 * - Push ke sessions array
 * - Call save()
 * - Return sessionId
 */
function create(userId) {
    // TODO: Implement
    throw new Error('create() not implemented yet');
}

/**
 * TODO: Implement findById()
 * 
 * Find session by ID
 * 
 * @param {string} sessionId - Session ID
 * @returns {Object|null} Session object atau null jika tidak found/expired
 * 
 * HINTS:
 * - Find session dalam sessions array
 * - Check apakah expired: new Date(session.expiresAt) < new Date()
 * - Jika expired, call destroy(sessionId) dan return null
 * - Return session jika valid
 */
function findById(sessionId) {
    // TODO: Implement
    throw new Error('findById() not implemented yet');
}

/**
 * TODO: Implement destroy()
 * 
 * Destroy/delete session
 * 
 * @param {string} sessionId - Session ID yang akan dihapus
 * @returns {boolean} true jika berhasil delete, false jika tidak found
 * 
 * HINTS:
 * - Store initial length
 * - Filter out session dengan sessionId tersebut
 * - Call save()
 * - Return true jika length berkurang, false jika tidak
 */
function destroy(sessionId) {
    // TODO: Implement
    throw new Error('destroy() not implemented yet');
}

/**
 * TODO: Implement cleanup()
 * 
 * Cleanup expired sessions
 * 
 * @returns {number} Jumlah sessions yang dihapus
 * 
 * HINTS:
 * - Get current time: new Date()
 * - Filter sessions yang belum expired
 * - Count berapa yang dihapus
 * - Call save() jika ada yang dihapus
 * - Log ke console
 */
function cleanup() {
    // TODO: Implement
    throw new Error('cleanup() not implemented yet');
}

/**
 * TODO: Implement getAll()
 * 
 * Get all active sessions
 * 
 * @returns {Array} Array of active sessions
 * 
 * HINTS:
 * - Call cleanup() dulu
 * - Return sessions array
 */
function getAll() {
    // TODO: Implement
    throw new Error('getAll() not implemented yet');
}

/**
 * TODO: Implement destroyByUserId()
 * 
 * Destroy all sessions untuk user tertentu
 * 
 * @param {number} userId - User ID
 * @returns {number} Jumlah sessions yang dihapus
 * 
 * HINTS:
 * - Filter out sessions dengan userId tersebut
 * - Count berapa yang dihapus
 * - Save
 */
function destroyByUserId(userId) {
    // TODO: Implement
    throw new Error('destroyByUserId() not implemented yet');
}

// TODO: Uncomment setelah load() diimplementasi
// Load sessions saat module di-import
// load();

// TODO: Setup periodic cleanup (setiap 1 jam)
// setInterval(() => {
//     cleanup();
// }, 60 * 60 * 1000);

module.exports = {
    load,
    save,
    create,
    findById,
    destroy,
    cleanup,
    getAll,
    destroyByUserId
};
