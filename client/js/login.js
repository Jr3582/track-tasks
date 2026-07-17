const loginForm = document.getElementById("loginForm");
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

    if(!response.ok) {
        loginErrorMsg.classList.remove("hidden");
        loginErrorMsg.textContent = "Invalid username or password!";
    } else {
        const responseJSON = await response.json();
        localStorage.setItem("token", responseJSON.token);

        const projsRes = await fetch("http://localhost:5056/Projects", {
            headers: { "Authorization": `Bearer ${responseJSON.token}` }
        });
        const projs = await projsRes.json();
        if(projs.length > 0) {
            const prevDir = localStorage.getItem("previousDirectory");
            const prevDirValid = prevDir && projs.some(p => p.id == prevDir);
            if(!prevDirValid) {
                const firstProj = projs.sort((a, b) => a.id - b.id)[0];
                localStorage.setItem("previousDirectory", firstProj.id);
                localStorage.setItem("previousDirectoryTitle", firstProj.title);
            }
        }

        loginErrorMsg.classList.add("hidden");
        window.location.href = "index.html";
    }

})