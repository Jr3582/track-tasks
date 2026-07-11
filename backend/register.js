let validEmail = false;
let validUsername = false;
let validConfirmPass = false;


registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    let user = {
        email: emailInput.value,
        username: usernameInput.value,
        password: passwordInput.value
    };
    
    const response = await fetch("http://localhost:5056/Users/register", {
        method: "Post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
        
    window.location.href = "login.html";

})

emailInput.addEventListener("blur", async function() {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(emailInput.value)) {
        emailErrorMsg.classList.remove("opacity-0");
        emailErrorMsg.classList.add("opacity-100");
        emailErrorMsg.textContent = "Invalid email format!";
        emailInput.classList.remove("border-green-600");
        emailInput.classList.add("border-red-600");
        validateForm();
        return;
    }
    emailErrorMsg.classList.remove("opacity-100");
    emailErrorMsg.classList.add("opacity-0");
    emailInput.classList.remove("border-red-600");
    emailInput.classList.add("border-green-600");

    const response = await authFetch(`http://localhost:5056/Users/check?email=${emailInput.value}`);
    const message = await response.text();
    if(!response.ok) {
        emailErrorMsg.textContent = message;
        emailErrorMsg.classList.remove("opacity-0");
        emailErrorMsg.classList.add("opacity-100");
        emailInput.classList.remove("border-green-600");
        emailInput.classList.add("border-red-600");
        validateForm();
    } else {
        emailErrorMsg.classList.remove("opacity-100");
        emailErrorMsg.classList.add("opacity-0");
        validateForm();
    }
})

usernameInput.addEventListener("blur", async function() {
    const response = await authFetch(`http://localhost:5056/Users/check?username=${usernameInput.value}`);
    const message = await response.text();
    if(!response.ok) {
        usernameErrorMsg.classList.remove("opacity-0");
        usernameErrorMsg.classList.add("opacity-100");
        usernameErrorMsg.textContent = message;
        validateForm();
    } else {
        usernameErrorMsg.classList.remove("opacity-100");
        usernameErrorMsg.classList.add("opacity-0");
        validateForm();
    }
})

function validateForm() {
    if(validEmail && validUsername && validPass && validConfirmPass) {
        registerUserBtn.disabled = false;
    } else {
        registerUserBtn.disabled = true;
    }
}