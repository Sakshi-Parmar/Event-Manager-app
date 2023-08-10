document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("https://reqres.in/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                localStorage.setItem("token", token);

                window.location.href = "dashboard.html";
            } else {
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});
