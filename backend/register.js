const registerForm = document.getElementById("registerForm");
const registerErrorMsg = document.getElementById("registerErrorMsg");

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

    if(response.status === 409) {
        registerErrorMsg.classList.remove("hidden");
        registerErrorMsg.textContent = "Email already in use!";
    } else if(!response.ok) {
        registerErrorMsg.classList.remove("hidden");
        registerErrorMsg.textContent = "Something went wrong, please try again!"
    } else {
        window.location.href = "login.html";
    }

})