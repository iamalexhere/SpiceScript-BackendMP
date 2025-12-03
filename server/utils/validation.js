/**
 * Validation Utilities
 * 
 * File ini berisi fungsi-fungsi untuk validasi input dari user:
 * - Validasi form sign up
 * - Validasi form sign in
 * - Validasi form create/edit recipe
 * - Helper functions untuk validasi email, string, dll
 */

/**
 * Validasi email format menggunakan regex
 * 
 * @param {string} email - Email yang akan divalidasi
 * @returns {boolean} true jika valid, false jika tidak
 */
function validateEmail(email) {
    // Regex untuk email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validasi password strength
 * 
 * Requirements:
 * - Minimal 6 karakter
 * - TODO: Bisa ditambahkan requirements lain (uppercase, number, special char)
 * 
 * @param {string} password - Password yang akan divalidasi
 * @returns {Object} { valid: boolean, message: string }
 */
function validatePassword(password) {
    if (!password || password.length < 6) {
        return {
            valid: false,
            message: 'Password harus minimal 6 karakter'
        };
    }

    // TODO: Tambahkan validasi tambahan jika diperlukan
    // Contoh: harus ada uppercase, number, special character

    return { valid: true, message: '' };
}

/**
 * Validasi username
 * 
 * Requirements:
 * - Minimal 3 karakter
 * - Maksimal 20 karakter
 * - Hanya alphanumeric dan underscore
 * 
 * @param {string} username - Username yang akan divalidasi
 * @returns {Object} { valid: boolean, message: string }
 */
function validateUsername(username) {
    if (!username || username.length < 3) {
        return {
            valid: false,
            message: 'Username harus minimal 3 karakter'
        };
    }

    if (username.length > 20) {
        return {
            valid: false,
            message: 'Username maksimal 20 karakter'
        };
    }

    // Hanya alphanumeric dan underscore
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return {
            valid: false,
            message: 'Username hanya boleh huruf, angka, dan underscore'
        };
    }

    return { valid: true, message: '' };
}

/**
 * Validasi data sign up
 * 
 * @param {Object} data - Data dari form sign up
 * @param {string} data.username - Username
 * @param {string} data.email - Email
 * @param {string} data.password - Password
 * @param {string} data.confirmPassword - Konfirmasi password
 * @returns {Object} { valid: boolean, errors: Object }
 */
function validateSignUp(data) {
    const errors = {};

    // Validasi username
    const usernameCheck = validateUsername(data.username);
    if (!usernameCheck.valid) {
        errors.username = usernameCheck.message;
    }

    // Validasi email
    if (!data.email) {
        errors.email = 'Email wajib diisi';
    } else if (!validateEmail(data.email)) {
        errors.email = 'Format email tidak valid';
    }

    // Validasi password
    const passwordCheck = validatePassword(data.password);
    if (!passwordCheck.valid) {
        errors.password = passwordCheck.message;
    }

    // Validasi confirm password
    if (!data.confirmPassword) {
        errors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Password tidak cocok';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Validasi data sign in
 * 
 * @param {Object} data - Data dari form sign in
 * @param {string} data.email - Email atau username
 * @param {string} data.password - Password
 * @returns {Object} { valid: boolean, errors: Object }
 */
function validateSignIn(data) {
    const errors = {};

    // Validasi email/username
    if (!data.email) {
        errors.email = 'Email atau username wajib diisi';
    }

    // Validasi password
    if (!data.password) {
        errors.password = 'Password wajib diisi';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Validasi data recipe
 * 
 * @param {Object} data - Data dari form create/edit recipe
 * @param {string} data.recipeName - Nama resep
 * @param {string} data.description - Deskripsi resep
 * @param {string} data.ingredients - Bahan-bahan
 * @param {string} data.directions - Instruksi memasak
 * @returns {Object} { valid: boolean, errors: Object }
 */
function validateRecipe(data) {
    const errors = {};

    // Validasi recipe name
    if (!data.recipeName || data.recipeName.trim() === '') {
        errors.recipeName = 'Nama resep wajib diisi';
    } else if (data.recipeName.length < 3) {
        errors.recipeName = 'Nama resep minimal 3 karakter';
    }

    // Validasi description
    if (!data.description || data.description.trim() === '') {
        errors.description = 'Deskripsi resep wajib diisi';
    }

    // Validasi ingredients
    if (!data.ingredients || data.ingredients.trim() === '') {
        errors.ingredients = 'Bahan-bahan wajib diisi';
    }

    // Validasi directions
    if (!data.directions || data.directions.trim() === '') {
        errors.directions = 'Instruksi memasak wajib diisi';
    }

    // imagePath is optional - akan diset default jika kosong

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
    validateSignUp,
    validateSignIn,
    validateRecipe
};
