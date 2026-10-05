// =====================================
// PROFILE
// =====================================

const profileForm =
    document.getElementById("profileForm");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");


// =====================================
// LOAD SAVED PROFILE
// =====================================

const savedName =
    localStorage.getItem("profileName");

const savedEmail =
    localStorage.getItem("profileEmail");


if (savedName) {
    profileName.value = savedName;
}

if (savedEmail) {
    profileEmail.value = savedEmail;
}


// =====================================
// SAVE PROFILE
// =====================================

profileForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        profileName.value.trim();

    const email =
        profileEmail.value.trim();


    localStorage.setItem(
        "profileName",
        name
    );

    localStorage.setItem(
        "profileEmail",
        email
    );


    alert(
        "Profile updated successfully!"
    );

});
// =====================================
// PROFILE PHOTO
// =====================================

const profilePhoto =
    document.getElementById("profilePhoto");

const profileImage =
    document.getElementById("profileImage");


// Load saved image

const savedPhoto =
    localStorage.getItem("profilePhoto");

if (savedPhoto) {

    profileImage.src =
        savedPhoto;

}


// Select new image

profilePhoto.addEventListener(
    "change",
    function() {

        const file =
            this.files[0];

        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                const imageData =
                    event.target.result;

                profileImage.src =
                    imageData;


                localStorage.setItem(
                    "profilePhoto",
                    imageData
                );

            };


        reader.readAsDataURL(file);

    }
);
// =====================================
// PURCHASE DOWNLOAD
// =====================================

const purchaseDownloads =
    document.querySelectorAll(".purchase-download");


purchaseDownloads.forEach(function(button) {

    button.addEventListener("click", function() {

        const imagePath =
            button.getAttribute("data-image");

        const fileName =
            button.getAttribute("data-name");


        const downloadLink =
            document.createElement("a");

        downloadLink.href =
            imagePath;

        downloadLink.download =
            fileName;


        document.body.appendChild(
            downloadLink
        );

        downloadLink.click();

        document.body.removeChild(
            downloadLink
        );


        alert(
            "Photo downloaded successfully!"
        );

    });

});