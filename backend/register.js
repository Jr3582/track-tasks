let validEmail = false;
let validUsername = false;


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
        validEmail = false;
        validateForm();
        return;
    }
    emailErrorMsg.classList.remove("opacity-100");
    emailErrorMsg.classList.add("opacity-0");
    emailInput.classList.remove("border-red-600");
    emailInput.classList.add("border-green-600");

    const response = await authFetch(`http://localhost:5056/Users/checkEmail?email=${emailInput.value}`);
    const message = await response.text();
    if(!response.ok) {
        emailErrorMsg.textContent = message;
        emailErrorMsg.classList.remove("opacity-0");
        emailErrorMsg.classList.add("opacity-100");
        emailInput.classList.remove("border-green-600");
        emailInput.classList.add("border-red-600");
        validEmail = false;
        validateForm();
    } else {
        emailErrorMsg.classList.remove("opacity-100");
        emailErrorMsg.classList.add("opacity-0");
        validEmail = true;
        validateForm();
    }
})

usernameInput.addEventListener("blur", async function() {
    if (!usernameInput.value) return;
    const response = await authFetch(`http://localhost:5056/Users/check?username=${usernameInput.value}`);
    const message = await response.text();
    if(!response.ok) {
        usernameErrorMsg.classList.remove("opacity-0");
        usernameErrorMsg.classList.add("opacity-100");
        usernameErrorMsg.textContent = message;
        usernameInput.classList.remove("border-green-600");
        usernameInput.classList.add("border-red-600");
        validUsername = false;
        validateForm();
    } else {
        usernameErrorMsg.classList.remove("opacity-100");
        usernameErrorMsg.classList.add("opacity-0");
        usernameInput.classList.remove("border-red-600");
        usernameInput.classList.add("border-green-600");
        validUsername = true;
        validateForm();
    }
})

function validateForm() {
    if(validEmail && validUsername && validPass && validConfirmPass) {
        registerUserBtn.disabled = false;
        registerUserBtn.classList.remove("bg-gray-300/50");
        registerUserBtn.classList.add("bg-green-600");
    } else {
        registerUserBtn.disabled = true;
        registerUserBtn.classList.remove("bg-green-600");
        registerUserBtn.classList.add("bg-gray-300/50");
    }
}