// ============================================
// Cyber Shield Login
// ============================================

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const passwordToggle =
    document.getElementById("passwordToggle");

const errorMessage =
    document.getElementById("errorMessage");

const successMessage =
    document.getElementById("successMessage");

const loginBtn =
    document.getElementById("loginBtn");

const loginBtnText =
    document.getElementById("loginBtnText");


// ============================================
// Password Show / Hide
// ============================================

passwordToggle.addEventListener("click", () => {

    const isPassword =
        passwordInput.type === "password";

    passwordInput.type =
        isPassword ? "text" : "password";


    passwordToggle.innerHTML = isPassword

        ? '<i class="fa-regular fa-eye-slash"></i>'

        : '<i class="fa-regular fa-eye"></i>';

});


// ============================================
// Login Form
// ============================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Hide previous messages

    errorMessage.style.display = "none";
    successMessage.style.display = "none";


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    // Basic validation

    if (!email || !password) {

        showError("Please enter email and password.");

        return;

    }


    // Loading state

    loginBtn.disabled = true;

    loginBtnText.textContent = "Signing In...";


    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/login",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email,
                    password

                })

            }
        );


        const data = await response.json();


        // ====================================
        // Login Failed
        // ====================================

        if (!response.ok || !data.success) {

            showError(
                data.message ||
                "Login failed. Please check your credentials."
            );

            resetButton();

            return;

        }


        // ====================================
        // Login Successful
        // ====================================

        localStorage.setItem(
            "cyberShieldToken",
            data.token
        );


        localStorage.setItem(
            "cyberShieldUser",
            JSON.stringify(data.user)
        );


        successMessage.textContent =
            "Login successful! Redirecting...";

        successMessage.style.display = "block";


        loginBtnText.textContent =
            "Success";


        // Redirect

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1000);


    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to connect to Cyber Shield server."
        );

        resetButton();

    }

});


// ============================================
// Show Error
// ============================================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.style.display = "block";

}


// ============================================
// Reset Button
// ============================================

function resetButton() {

    loginBtn.disabled = false;

    loginBtnText.textContent = "Sign In";

}