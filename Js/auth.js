"use strict";

const USERS_KEY = "shirzad_demo_users_v1";

// PBKDF2 is used for this learning demo.
// Real authentication should use a secure backend.
const PBKDF2_ITERATIONS = 310000;

function getUsers() {
    try {
        const value = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function showMessage(id, message, type = "error") {
    const element = document.getElementById(id);
    if (!element) return;

    element.textContent = message;
    element.className = "message " + type;
}

function validPassword(password) {
    return password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);
}

function bytesToHex(bytes) {
    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function hexToBytes(hex) {
    if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) {
        throw new Error("Invalid stored salt or hash.");
    }

    const bytes = new Uint8Array(hex.length / 2);

    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }

    return bytes;
}

async function derivePasswordHash(password, salt) {
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256"
        },
        keyMaterial,
        256
    );

    return new Uint8Array(derivedBits);
}

async function createPasswordRecord(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await derivePasswordHash(password, salt);

    return {
        salt: bytesToHex(salt),
        hash: bytesToHex(hash),
        iterations: PBKDF2_ITERATIONS,
        algorithm: "PBKDF2-SHA-256"
    };
}

async function verifyPassword(password, record) {
    if (
        !record ||
        record.algorithm !== "PBKDF2-SHA-256" ||
        !Number.isInteger(record.iterations) ||
        record.iterations < 100000 ||
        record.iterations > 1000000
    ) {
        return false;
    }

    const salt = hexToBytes(record.salt);
    const expectedHash = hexToBytes(record.hash);

    const actualHash = await derivePasswordHash(password, salt);

    if (actualHash.length !== expectedHash.length) return false;

    let difference = 0;

    for (let i = 0; i < actualHash.length; i++) {
        difference |= actualHash[i] ^ expectedHash[i];
    }

    return difference === 0;
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show or hide passwords
document.querySelectorAll("[data-toggle]").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.toggle);
        if (!input) return;

        const showing = input.type === "password";
        input.type = showing ? "text" : "password";
        button.textContent = showing ? "Hide" : "Show";
    });
});

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async event => {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail")
            .value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmation = document.getElementById("confirmPassword").value;

        if (!name || !email || !password || !confirmation) {
            return showMessage("registerMessage", "Please complete all fields.");
        }
        if (!emailIsValid(email)) {
            return showMessage("registerMessage", "Enter a valid email address.");
        }

        if (!validPassword(password)) {
            return showMessage(
                "registerMessage",
                "Use 8+ characters with uppercase, lowercase, a number and a symbol."
            );
        }

        if (password !== confirmation) {
            return showMessage("registerMessage", "Passwords do not match.");
        }

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            return showMessage(
                "registerMessage",
                "An account with this email already exists."
            );
        }

        const submitButton = registerForm.querySelector("button[type='submit']");
        submitButton.disabled = true;

        try {
            const passwordRecord = await createPasswordRecord(password);

            users.push({
                id: crypto.randomUUID(),
                name,
                email,
                passwordRecord,
                createdAt: new Date().toISOString()
            });

            saveUsers(users);
            registerForm.reset();

            showMessage(
                "registerMessage",
                "Account created for this browser. You can now log in.",
                "success"
            );

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);
        } catch (error) {
            showMessage(
                "registerMessage",
                "Secure browser features are unavailable. Try running this site on localhost."
            );
        } finally {
            submitButton.disabled = false;
        }
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const user = getUsers().find(item => item.email === email);

        if (!user) {
            return showMessage("loginMessage", "Email or password is incorrect.");
        }

        try {
            const valid = await verifyPassword(password, user.passwordRecord);

            if (!valid) {
                return showMessage("loginMessage", "Email or password is incorrect.");
            }

            sessionStorage.setItem("shirzad_demo_logged_in", user.id);
            sessionStorage.setItem("shirzad_demo_name", user.name);

            showMessage("loginMessage", "Login successful!", "success");

            setTimeout(() => {
                window.location.href = "gallery.html";
            }, 700);
        } catch {
            showMessage("loginMessage", "Could not verify this password.");
        }
    });
}

// FORGOT PASSWORD — demonstration only, no email verification!
const resetForm = document.getElementById("resetForm");

if (resetForm) {
    resetForm.addEventListener("submit", async event => {
        event.preventDefault();

        const email = document.getElementById("resetEmail")
            .value.trim().toLowerCase();
        const password = document.getElementById("newPassword").value;
        const confirmation = document.getElementById("confirmNewPassword").value;

        if (!emailIsValid(email)) {
            return showMessage("resetMessage", "Enter a valid email address.");
        }

        if (!validPassword(password)) {
            return showMessage(
                "resetMessage",
                "Use 8+ characters with uppercase, lowercase, a number and a symbol."
            );
        }

        if (password !== confirmation) {
            return showMessage("resetMessage", "Passwords do not match.");
        }

        const users = getUsers();
        const index = users.findIndex(user => user.email === email);
        if (index === -1) {
            return showMessage(
                "resetMessage",
                "No account was found for this email in this browser."
            );
        }

        const submitButton = resetForm.querySelector("button[type='submit']");
        submitButton.disabled = true;

        try {
            users[index].passwordRecord = await createPasswordRecord(password);
            saveUsers(users);
            resetForm.reset();

            showMessage(
                "resetMessage",
                "Password changed in this demo. Return to Login.",
                "success"
            );
        } catch {
            showMessage("resetMessage", "Could not update the password.");
        } finally {
            submitButton.disabled = false;
        }
    });
}