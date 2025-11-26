document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const tosCheckbox = document.getElementById("tos");
    const signUpBtn = document.getElementById("signUpBtn");

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const checkFormValidity = () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        const isTosChecked = tosCheckbox.checked;

        if (!password || !isValidEmail(email) || !isTosChecked) {
            signUpBtn.classList.add("disabled-btn");
            signUpBtn.disabled = true;
        } else {
            signUpBtn.classList.remove("disabled-btn");
            signUpBtn.disabled = false;
        }
    };

    emailInput.addEventListener("input", checkFormValidity);
    passwordInput.addEventListener("input", checkFormValidity);
    tosCheckbox.addEventListener("change", checkFormValidity); // Listener untuk checkbox

    signUpBtn.addEventListener("click", () => {
        localStorage.setItem("userEmail", emailInput.value);
        window.location.href = "/catalog";
    });
});