document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const signInBtn = document.getElementById("signInBtn");

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const checkFormValidity = () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!password || !isValidEmail(email)) {
            signInBtn.classList.add("disabled-btn");
            signInBtn.disabled = true;
        } else {
            signInBtn.classList.remove("disabled-btn");
            signInBtn.disabled = false;
        }
    };

    emailInput.addEventListener("input", checkFormValidity);
    passwordInput.addEventListener("input", checkFormValidity);

    signInBtn.addEventListener("click", () => {
        localStorage.setItem("userEmail", emailInput.value);
        window.location.href = "catalog.html";
    });
});