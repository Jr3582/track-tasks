const showPassBtn = document.getElementById("showPassBtn");
const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const passwordValidationMsg = document.getElementById("passwordValidationMsg");
const confirmPassMsg = document.getElementById("confirmPassValidationMsg");
const emailInput = document.getElementById("emailInput");
const emailValidationMsg = document.getElementById("emailValidationMsg");

function showPassword() {
    if(passwordInput.type === "password" && confirmPasswordInput.type === "password") {
        passwordInput.type = "text";
        confirmPasswordInput.type = "text";
        showPassBtn.classList.remove("fa-eye-slash");
        showPassBtn.classList.add("fa-eye");
    } else {
        passwordInput.type = "password";
        confirmPasswordInput.type = "password";
        showPassBtn.classList.remove("fa-eye");
        showPassBtn.classList.add("fa-eye-slash");
    }
}

emailInput.addEventListener("input", function() {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if(!emailRegex.test(emailInput.value)) {
        emailValidationMsg.classList.remove("hidden");
        emailValidationMsg.textContent = "Invalid email format!";
        emailInput.classList.remove("border-green-600");
        emailInput.classList.add("border-red-600");
    } else {
        emailValidationMsg.classList.add("hidden");
        emailInput.classList.remove("border-red-600");
        emailInput.classList.add("border-green-600");
    }
})

passwordInput.addEventListener("input", function() {
    //REGEX
    const oneUpper = /[A-Z]+/;
    const hasTwoSpecial = /([^a-zA-Z0-9].*){2,}/;
    const hasOneNumber = /[0-9]+/;

    //PASSWORD VALIDATION LOGIC
    if(passwordInput.value.length < 8) {
        passwordValidationMsg.classList.remove("hidden");
        passwordValidationMsg.textContent = "Password too short!";
    } else if(!oneUpper.test(passwordInput.value)) {
        passwordValidationMsg.classList.remove("hidden");
        passwordValidationMsg.textContent = "Please include at least 1 uppercase letter!"
    } else if(!hasTwoSpecial.test(passwordInput.value)) {
        passwordValidationMsg.classList.remove("hidden");
        passwordValidationMsg.textContent = "Please include at least 2 special characters!"
    } else if(!hasOneNumber.test(passwordInput.value)) {
        passwordValidationMsg.classList.remove("hidden");
        passwordValidationMsg.textContent = "Please include at least 1 number";
    } else {
        passwordValidationMsg.classList.add("hidden");
        passwordInput.classList.add("border-green-600");
    }
})

confirmPasswordInput.addEventListener("input", function() {
    if(confirmPasswordInput.value != passwordInput.value) {
        confirmPassMsg.classList.remove("hidden");
        confirmPasswordInput.classList.remove("border-green-600");
        confirmPasswordInput.classList.add("border-red-600");
        confirmPassMsg.textContent = "Passwords do not match!";
    } else {
        confirmPassMsg.classList.add("hidden");
        confirmPasswordInput.classList.remove("border-red-600");
        confirmPasswordInput.classList.add("border-green-600");
    }
})