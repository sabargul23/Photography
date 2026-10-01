// =====================================
// REGISTER FORM
// =====================================

const registerForm =
    document.getElementById("registerForm");


registerForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("registerName").value;

    const email =
        document.getElementById("registerEmail").value;

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check password

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }


    // Check password length

    if (password.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;

    }


    alert(
        "Account created successfully!\n\n" +
        "Welcome, " + name + "!"
    );


    // Go to Login

    window.location.href = "login.html";

});