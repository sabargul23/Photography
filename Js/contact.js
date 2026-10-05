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