/**
 * Sign In - Frontend Integration with Backend API
 * 
 * Connects to POST /api/auth/signin
 */

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const signInBtn = document.getElementById("signInBtn");

    const checkFormValidity = () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Enable button jika field tidak kosong
        if (email && password) {
            signInBtn.classList.remove("disabled-btn");
            signInBtn.disabled = false;
        } else {
            signInBtn.classList.add("disabled-btn");
            signInBtn.disabled = true;
        }
    };

    emailInput.addEventListener("input", checkFormValidity);
    passwordInput.addEventListener("input", checkFormValidity);

    // Handle form submission
    signInBtn.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Disable button during request
        signInBtn.disabled = true;
        signInBtn.textContent = 'SIGNING IN...';

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important: Include cookies
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Success! Cookie akan di-set otomatis oleh browser
                alert(`Welcome back, ${data.user.username}!`);
                window.location.href = '/catalog';
            } else {
                // Handle errors
                const errorMessage = data.message || 'Sign in failed. Please check your credentials.';
                alert(errorMessage);

                // Re-enable button
                signInBtn.disabled = false;
                signInBtn.textContent = 'LOG IN';
            }
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Network error. Please check your connection and try again.');

            // Re-enable button
            signInBtn.disabled = false;
            signInBtn.textContent = 'LOG IN';
        }
    });

    // Allow Enter key to submit
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !signInBtn.disabled) {
            signInBtn.click();
        }
    });
});