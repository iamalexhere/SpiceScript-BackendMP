/**
 * Konfigurasi Aplikasi SpiceScript
 * 
 * File ini berisi semua konfigurasi penting untuk aplikasi, termasuk:
 * - Pengaturan server (port, host)
 * - Pengaturan session (expiration, cookie name)
 * - Path file data
 * - Pengaturan cookies (security attributes)
 * - Password hashing configuration
 */

const path = require('path');

const config = {
    // ============= SERVER SETTINGS =============
    // Pengaturan dasar server HTTP
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },

    // ============= SESSION SETTINGS =============
    // Konfigurasi untuk session management
    session: {
        // Session expiration dalam milidetik (24 jam)
        maxAge: 30 * 60 * 1000, // 86400000 ms = 24 hours
    },

    // ============= COOKIE SETTINGS =============
    // Pengaturan cookie untuk keamanan
    cookie: {
        httpOnly: true,      // XSS protection - cookie tidak bisa diakses via JavaScript
        sameSite: 'Strict',  // CSRF protection - cookie hanya dikirim untuk same-site requests
        secure: false,       // Set true jika menggunakan HTTPS di production
        path: '/'           // Cookie berlaku untuk semua paths
    },

    // ============= DATA FILES PATHS =============
    // Path ke file-file JSON untuk storage
    dataFiles: {
        users: path.join(__dirname, '../data/users.json'),
        recipes: path.join(__dirname, '../data/recipes.json'),
        sessions: path.join(__dirname, '../data/sessions.json')
    },

    // ============= PASSWORD HASHING =============
    // Konfigurasi untuk password hashing menggunakan PBKDF2
    crypto: {
        iterations: 100000,     // Jumlah iterasi untuk PBKDF2
        keyLength: 64,          // Panjang hash dalam bytes
        digest: 'sha512'        // Algoritma hashing
    }
};

module.exports = config;
