// =====================================
// CHECKOUT FORM
// =====================================

const checkoutForm =
    document.getElementById("checkoutForm");


checkoutForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("fullName").value;

    const email =
        document.getElementById("email").value;

    const country =
        document.getElementById("country").value;

    const payment =
        document.getElementById("payment").value;


    if (
        name === "" ||
        email === "" ||
        country === "" ||
        payment === ""
    ) {

        alert("Please complete all fields.");

        return;

    }


    alert(
        "Thank you, " +
        name +
        "!\n\n" +
        "Your order has been received."
    );

});