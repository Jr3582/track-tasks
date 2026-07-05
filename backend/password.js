function showPassword() {
    if(confirmPasswordInput && passwordInput) {
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
    } else {
        if(passwordInput.type === "password") {
            passwordInput.type = "text";
            showPassBtn.classList.remove("fa-eye-slash");
            showPassBtn.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";
            showPassBtn.classList.remove("fa-eye");
            showPassBtn.classList.add("fa-eye-slash");
        }
    }
}

if(passwordInput){
    passwordInput.addEventListener("input", function() {
        //REGEX
        const oneUpper = /[A-Z]+/;
        const hasTwoSpecial = /([^a-zA-Z0-9].*){2,}/;
        const hasOneNumber = /[0-9]+/;

        //PASSWORD VALIDATION LOGIC
        if(passwordInput.value.length < 8) {
            passwordValidationMsg.classList.remove("opacity-0");
            passwordValidationMsg.classList.add("opacity-100");
            passwordInput.classList.remove("border-green-600");
            passwordInput.classList.add("border-red-600");
            passwordValidationMsg.textContent = "Password too short!";
            validPass = false;
        } else if(!oneUpper.test(passwordInput.value)) {
            passwordValidationMsg.classList.remove("opacity-0");
            passwordValidationMsg.classList.add("opacity-100");
            passwordInput.classList.remove("border-green-600");
            passwordInput.classList.add("border-red-600");
            passwordValidationMsg.textContent = "Please include at least 1 uppercase letter!"
            validPass = false;
        } else if(!hasTwoSpecial.test(passwordInput.value)) {
            passwordValidationMsg.classList.remove("opacity-0");
            passwordValidationMsg.classList.add("opacity-100");
            passwordInput.classList.remove("border-green-600");
            passwordInput.classList.add("border-red-600");
            passwordValidationMsg.textContent = "Please include at least 2 special characters!"
            validPass = false;
        } else if(!hasOneNumber.test(passwordInput.value)) {
            passwordValidationMsg.classList.remove("opacity-0");
            passwordValidationMsg.classList.add("opacity-100");
            passwordInput.classList.remove("border-green-600");
            passwordInput.classList.add("border-red-600");
            passwordValidationMsg.textContent = "Please include at least 1 number";
            validPass = false;
        } else {
            passwordValidationMsg.classList.add("opacity-0");
            passwordInput.classList.add("border-green-600");
            passwordInput.classList.remove("border-red-600");
            passwordInput.classList.add("border-green-600");
            validPass = true;
        }
    })
}

if(confirmPasswordInput){
    confirmPasswordInput.addEventListener("input", function() {
        if(confirmPasswordInput.value != passwordInput.value) {
            confirmPassMsg.classList.remove("opacity-0");
            confirmPassMsg.classList.add("opacity-100");
            confirmPasswordInput.classList.remove("border-green-600");
            confirmPasswordInput.classList.add("border-red-600");
            confirmPassMsg.textContent = "Passwords do not match!";
            confirmPass = false;
        } else {
            confirmPassMsg.classList.remove("opacity-100");
            confirmPassMsg.classList.add("opacity-0");
            confirmPasswordInput.classList.remove("border-red-600");
            confirmPasswordInput.classList.add("border-green-600");
            confirmPass = true;
        }
    })
}