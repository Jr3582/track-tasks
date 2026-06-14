const showPassBtn = document.getElementById("showPassBtn");
const passwordInput = document.getElementById("passwordInput");

function showPassword() {
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