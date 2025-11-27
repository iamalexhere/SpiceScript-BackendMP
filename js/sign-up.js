/**
 * Sign Up - Frontend Integration with Backend API
 * 
 * Connects to POST /api/auth/signup
 */

document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const tosCheckbox = document.getElementById("tos");
    const signUpBtn = document.getElementById("signUpBtn");

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const isValidUsername = (username) => {
        // 3-20 characters, alphanumeric + underscore
        const re = /^[a-zA-Z0-9_]{3,20}$/;
        return re.test(username);
    };

    const checkFormValidity = () => {
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const isTosChecked = tosCheckbox.checked;

        // Enable button jika semua validasi passed
        if (isValidUsername(username) &&
            isValidEmail(email) &&
            password.length >= 6 &&
            password === confirmPassword &&
            isTosChecked) {
            signUpBtn.classList.remove("disabled-btn");
            signUpBtn.disabled = false;
        } else {
            signUpBtn.classList.add("disabled-btn");
            signUpBtn.disabled = true;
        }
    };

    // Add event listeners
    usernameInput.addEventListener("input", checkFormValidity);
    emailInput.addEventListener("input", checkFormValidity);
    passwordInput.addEventListener("input", checkFormValidity);
    confirmPasswordInput.addEventListener("input", checkFormValidity);
    tosCheckbox.addEventListener("change", checkFormValidity);

    // Handle form submission
    signUpBtn.addEventListener("click", async () => {
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Disable button during request
        signUpBtn.disabled = true;
        signUpBtn.textContent = 'CREATING ACCOUNT...';

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important: Include cookies
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Success! Cookie akan di-set otomatis oleh browser
                alert('Account created successfully! Welcome to SpiceScript!');
                window.location.href = '/catalog';
            } else {
                // Handle errors
                const errorMessage = data.error?.message || 'Sign up failed. Please try again.';
                alert(errorMessage);

                // Re-enable button
                signUpBtn.disabled = false;
                signUpBtn.textContent = 'CREATE ACCOUNT';
            }
        } catch (error) {
            console.error('Sign up error:', error);
            alert('Network error. Please check your connection and try again.');

            // Re-enable button
            signUpBtn.disabled = false;
            signUpBtn.textContent = 'CREATE ACCOUNT';
        }
    });
});