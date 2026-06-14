const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("usernameInput");
const loginErrorMsg = document.getElementById("loginErrorMsg");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    let user = {
        username: usernameInput.value,
        password: passwordInput.value
    };

    const response = await fetch("http://localhost:5056/Users/login", {
        method: "Post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    const responseJSON = await response.json();
    if(!response.ok) {
        loginErrorMsg.classList.remove("hidden");
        loginErrorMsg.textContent = "Invalid username or password!";
    } else {
        localStorage.setItem("token", responseJSON.token);
        loginErrorMsg.classList.add("hidden");
        window.location.href = "index.html";
    }

})