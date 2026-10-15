// =====================================
// CONTACT FORM
// =====================================

const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("contactName").value;

    const email =
        document.getElementById("contactEmail").value;

    const subject =
        document.getElementById("contactSubject").value;

    const message =
        document.getElementById("contactMessage").value;


    if (
        name === "" ||
        email === "" ||
        subject === "" ||
        message === ""
    ) {

        alert("Please complete all fields.");

        return;

    }


    alert(
        "Thank you, " +
        name +
        "!\n\n" +
        "Your message has been received."
    );


    contactForm.reset();

});

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactStatus");

    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("contactName")
            .value.trim();

        const email = document.getElementById("contactEmail")
            .value.trim();

        const message = document.getElementById("contactMessage")
            .value.trim();

        if (!name || !email || !message) {
            contactStatus.textContent = "Please fill in all fields.";
            return;
        }

        const contact = {
            name: name,
            email: email,
            message: message,
            date: new Date().toISOString()
        };

        try {
            const savedContacts = JSON.parse(
                localStorage.getItem("shirzadContacts") || "[]"
            );

            savedContacts.push(contact);

            localStorage.setItem(
                "shirzadContacts",
                JSON.stringify(savedContacts)
            );

            contactStatus.textContent =
                "Your message has been saved successfully!";

            contactForm.reset();

        } catch (error) {
            contactStatus.textContent =
                "Could not save your message in this browser.";
        }
    });
});