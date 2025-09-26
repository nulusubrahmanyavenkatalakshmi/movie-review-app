// ====== SIGN UP ======
document.getElementById("signupBtn")?.addEventListener("click", function () {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !password) { alert("Please fill all fields!"); return; }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if(users.find(u => u.email === email)) { alert("Email already registered!"); return; }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    window.location.href = "signin.html";
});

// ====== SIGN IN ======
document.getElementById("signinBtn")?.addEventListener("click", function () {
    const email = document.getElementById("signinEmail").value.trim();
    const password = document.getElementById("signinPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if(user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "index.html";
    } else { alert("Invalid email or password!"); }
});
