// ============================================
// CYBER SHIELD REGISTER
// ============================================


const registerForm =
    document.getElementById("registerForm");


const fullName =
    document.getElementById("fullName");


const email =
    document.getElementById("registerEmail");


const password =
    document.getElementById("registerPassword");


const confirmPassword =
    document.getElementById("confirmPassword");


const terms =
    document.getElementById("terms");


const registerBtn =
    document.getElementById("registerBtn");


const registerBtnText =
    document.getElementById("registerBtnText");


const errorBox =
    document.getElementById("registerError");


const successBox =
    document.getElementById("registerSuccess");


const passwordStrength =
    document.getElementById("passwordStrength");


const strengthText =
    document.getElementById("strengthText");


// ============================================
// Password Show / Hide
// ============================================


function setupPasswordToggle(
    input,
    button
) {

    button.addEventListener("click", () => {

        const isPassword =
            input.type === "password";


        input.type =
            isPassword ? "text" : "password";


        button.innerHTML = isPassword

            ? '<i class="fa-regular fa-eye-slash"></i>'

            : '<i class="fa-regular fa-eye"></i>';

    });

}


setupPasswordToggle(
    password,
    document.getElementById(
        "registerPasswordToggle"
    )
);


setupPasswordToggle(
    confirmPassword,
    document.getElementById(
        "confirmPasswordToggle"
    )
);


// ============================================
// Password Strength
// ============================================


password.addEventListener(
    "input",
    () => {

        const value =
            password.value;


        const bars =
            document.querySelectorAll(
                ".strength-bars span"
            );


        let score = 0;


        if (value.length >= 8)
            score++;


        if (/[A-Z]/.test(value))
            score++;


        if (/[0-9]/.test(value))
            score++;


        if (/[^A-Za-z0-9]/.test(value))
            score++;


        bars.forEach(
            (bar, index) => {

                bar.style.background =
                    index < score
                        ? "#00e5ff"
                        : "#26313d";

            }
        );


        if (!value) {

            strengthText.textContent =
                "Enter a password";

        }

        else if (score <= 1) {

            strengthText.textContent =
                "Weak password";

        }

        else if (score === 2) {

            strengthText.textContent =
                "Medium password";

        }

        else if (score === 3) {

            strengthText.textContent =
                "Strong password";

        }

        else {

            strengthText.textContent =
                "Very strong password";

        }

    }
);


// ============================================
// Register
// ============================================


registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        hideMessages();


        const nameValue =
            fullName.value.trim();


        const emailValue =
            email.value.trim();


        const passwordValue =
            password.value;


        const confirmValue =
            confirmPassword.value;


        // ================================
        // Frontend Validation
        // ================================


        if (!nameValue) {

            showError(
                "Please enter your full name."
            );

            return;

        }


        if (!emailValue) {

            showError(
                "Please enter your email address."
            );

            return;

        }


        if (!passwordValue) {

            showError(
                "Please enter a password."
            );

            return;

        }


        if (passwordValue !== confirmValue) {

            showError(
                "Passwords do not match."
            );

            return;

        }


        if (!terms.checked) {

            showError(
                "Please accept the Terms of Service and Privacy Policy."
            );

            return;

        }


        // ================================
        // Loading
        // ================================


        registerBtn.disabled = true;

        registerBtnText.textContent =
            "Creating Account...";


        try {


            // ================================
            // API Request
            // ================================


            const response =
                await fetch(
                    "http://localhost:8080/api/auth/register",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            fullName:
                                nameValue,

                            email:
                                emailValue,

                            password:
                                passwordValue,

                            confirmPassword:
                                confirmValue

                        })

                    }
                );


            const data =
                await response.json();


            console.log(
                "Register Response:",
                data
            );


            // ================================
            // Error
            // ================================


            if (
                !response.ok ||
                !data.success
            ) {

                showError(
                    data.message ||
                    "Registration failed."
                );


                resetButton();

                return;

            }


            // ================================
            // Success
            // ================================


            showSuccess(
                "Registration successful! Redirecting to login..."
            );


            registerBtnText.textContent =
                "Account Created";


            // Redirect to Login

            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1500
            );


        }

        catch (error) {

            console.error(
                "Registration Error:",
                error
            );


            showError(
                "Unable to connect to Cyber Shield server."
            );


            resetButton();

        }

    }
);


// ============================================
// Messages
// ============================================


function showError(message) {

    errorBox.textContent =
        message;

    errorBox.style.display =
        "block";

}


function showSuccess(message) {

    successBox.textContent =
        message;

    successBox.style.display =
        "block";

}


function hideMessages() {

    errorBox.style.display =
        "none";

    successBox.style.display =
        "none";

}


function resetButton() {

    registerBtn.disabled =
        false;

    registerBtnText.textContent =
        "Create Account";

}