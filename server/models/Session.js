/**
 * Session Model - IMPLEMENT
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

const fs = require('fs')
const config = require('../config/config')
const { generateSessionId } = require('../utils/crypto')

// Path ke file sessions.json
const SESSIONS_FILE = config.dataFiles.sessions

// In-memory sessions storage
let sessions = []

/**
 * Implement load()
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
    //Check file exists
    if (!fs.existsSync(SESSIONS_FILE)) {
        sessions = []
        return sessions
    }

    try {
        //Read dan parse JSON
        const content = fs.readFileSync(SESSIONS_FILE, 'utf-8')
        sessions = JSON.parse(content)
    } catch (error) {
        console.error('gagal load sessions')
        sessions = []
    }
    //Call cleanup() setelah load
    cleanup()
    //Set ke variable sessions (implicit by modifying global 'sessions' array)
    return sessions
}

/**
 * Implement save()
 *
 * Save sessions ke file JSON
 *
 * @param {Array} sessionsToSave - Array of session objects (optional, default ke in-memory sessions)
 */
function save(sessionsToSave = sessions) {
    //Use sessionsToSave parameter atau default ke global sessions variable
    try {
        const jsonString = JSON.stringify(sessionsToSave, null, 2)
        fs.writeFileSync(SESSIONS_FILE, jsonString)
    } catch (error) {
        console.error('gagal save sessions')
    }
}

/**
 * Implement create()
 *
 * Create session baru
 *
 * @param {number} userId - User ID
 * @returns {string} Session ID
 */
function create(userId) {
    //Generate sessionId dengan generateSessionId()
    const sessionId = generateSessionId()

    //Calculate expiresAt: new Date(Date.now() + config.session.maxAge)
    const expiresAt = new Date(Date.now() + config.session.maxAge)

    //Create session object dengan sessionId, userId, createdAt, expiresAt
    const newSession = {
        sessionId: sessionId,
        userId: userId,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
    }

    //Push ke sessions array
    sessions.push(newSession)
    //Call save()
    save(sessions)
    //Return sessionId
    return sessionId
}

/**
 * Implement findById()
 *
 * Find session by ID
 *
 * @param {string} sessionId - Session ID
 * @returns {Object|null} Session object atau null jika tidak found/expired
 */
function findById(sessionId) {
    //Find session dalam sessions array
    const session = sessions.find((s) => s.sessionId === sessionId)

    if (!session) {
        return null
    }

    //Check apakah expired: new Date(session.expiresAt) < new Date()
    if (new Date(session.expiresAt) < new Date()) {
        //Jika expired, call destroy(sessionId) dan return null
        destroy(sessionId)
        return null
    }

    //Return session jika valid
    return session
}

/**
 * Implement destroy()
 *
 * Destroy/delete session
 *
 * @param {string} sessionId - Session ID yang akan dihapus
 * @returns {boolean} true jika berhasil delete, false jika tidak found
 */
function destroy(sessionId) {
    //Store initial length
    const initialLength = sessions.length
    //Filter out session dengan sessionId tersebut
    sessions = sessions.filter((s) => s.sessionId !== sessionId)

    //Call save()
    if (sessions.length < initialLength) {
        save()
        //Return true jika length berkurang, false jika tidak
        return true
    }

    return false
}

/**
 * Implement cleanup()
 *
 * Cleanup expired sessions
 *
 * @returns {number} Jumlah sessions yang dihapus
 */
function cleanup() {
    //Get current time: new Date()
    const initialLength = sessions.length
    const now = new Date()
    //Filter sessions yang belum expired
    const activeSessions = sessions.filter((s) => new Date(s.expiresAt) > now)

    //Count berapa yang dihapus
    const removedCount = initialLength - activeSessions.length

    if (removedCount > 0) {
        sessions = activeSessions
        //Call save() jika ada yang dihapus
        save()
        //Log ke console
        console.log(`removed ${removedCount} expired sessions`)
    }

    return removedCount
}

/**
 * Implement getAll()
 *
 * Get all active sessions
 *
 * @returns {Array} Array of active sessions
 */
function getAll() {
    //Call cleanup() dulu
    cleanup()
    //Return sessions array
    return sessions
}

/**
 * Implement destroyByUserId()
 *
 * Destroy all sessions untuk user tertentu
 *
 * @param {number} userId - User ID
 * @returns {number} Jumlah sessions yang dihapus
 */
function destroyByUserId(userId) {
    //Filter out sessions dengan userId tersebut
    const initialLength = sessions.length
    sessions = sessions.filter((s) => s.userId !== userId)

    //Count berapa yang dihapus
    const removedCount = initialLength - sessions.length

    //Save
    if (removedCount > 0) {
        save()
    }

    return removedCount
}

//load session saat module diimport
load()

//periodic cleanup setiap 1 jam
setInterval(() => {
    cleanup()
}, 60 * 60 * 1000)

module.exports = {
    load,
    save,
    create,
    findById,
    destroy,
    cleanup,
    getAll,
    destroyByUserId,
}
