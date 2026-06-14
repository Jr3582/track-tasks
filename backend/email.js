const emailInput = document.getElementById("emailInput");
const emailValidationMsg = document.getElementById("emailValidationMsg");

if(emailInput){
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
}