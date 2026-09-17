// =====================================
// GALLERY FILTER
// =====================================

const filterButtons =
    document.querySelectorAll(".filter-btn");

const photoItems =
    document.querySelectorAll(".photo-item");


filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active from all buttons
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        // Add active to clicked button
        button.classList.add("active");

        // Get selected filter
        const filter =
            button.getAttribute("data-filter");


        // Check photos
        photoItems.forEach(function(photo) {

            const category =
                photo.getAttribute("data-category");

            const type =
                photo.getAttribute("data-type");


            // Show matching photos
            if (
                filter === "all" ||
                filter === category ||
                filter === type
            ) {

                photo.style.display = "block";

            } else {

                photo.style.display = "none";

            }

        });

    });

});


// =====================================
// LIGHTBOX
// =====================================

const galleryImages =
    document.querySelectorAll(".gallery-img");

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxClose =
    document.getElementById("lightboxClose");

const lightboxNext =
    document.getElementById("lightboxNext");

const lightboxPrev =
    document.getElementById("lightboxPrev");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const lightboxDescription =
    document.getElementById("lightboxDescription");


let currentImage = 0;


// =====================================
// OPEN LIGHTBOX
// =====================================

galleryImages.forEach(function(photo, index) {

    photo.addEventListener("click", function() {

        currentImage = index;

        showImage(currentImage);

        lightbox.classList.add("show");

    });

});


// =====================================
// SHOW IMAGE
// =====================================

function showImage(index) {

    const photo =
        galleryImages[index];


    // Show image
    lightboxImage.src =
        photo.src;

    lightboxImage.alt =
        photo.alt;


    // Get photo card
    const card =
        photo.closest(".photo-card");


    // Get title
    const title =
        card.querySelector("h5");


    // Get description
    const description =
        card.querySelector("p");


    // Show title
    lightboxTitle.textContent =
        title.textContent;


    // Show description
    lightboxDescription.textContent =
        description.textContent;

}


// =====================================
// CLOSE LIGHTBOX
// =====================================

lightboxClose.addEventListener("click", function() {

    lightbox.classList.remove("show");

});


// =====================================
// NEXT PHOTO
// =====================================

lightboxNext.addEventListener("click", function() {

    currentImage++;


    if (
        currentImage >= galleryImages.length
    ) {

        currentImage = 0;

    }


    showImage(currentImage);

});


// =====================================
// PREVIOUS PHOTO
// =====================================

lightboxPrev.addEventListener("click", function() {

    currentImage--;


    if (currentImage < 0) {

        currentImage =
            galleryImages.length - 1;

    }


    showImage(currentImage);

});


// =====================================
// CLOSE BY BACKGROUND
// =====================================

lightbox.addEventListener("click", function(event) {

    if (event.target === lightbox) {

        lightbox.classList.remove("show");

    }

});


// =====================================
// ESC KEY
// =====================================

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        lightbox.classList.remove("show");

    }

});
//=========================
// AI STUDIO
// =========================

const imageUpload =
    document.getElementById("imageUpload");

const previewImage =
    document.getElementById("previewImage");

const previewText =
    document.getElementById("previewText");

const enhanceBtn =
    document.getElementById("enhanceBtn");

const brightnessBtn =
    document.getElementById("brightnessBtn");

const grayscaleBtn =
    document.getElementById("grayscaleBtn");

const resetBtn =
    document.getElementById("resetBtn");


// Upload Image

imageUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = function (event) {

            previewImage.src = event.target.result;

            previewImage.style.display = "block";

            previewText.style.display = "none";

            previewImage.style.filter = "none";

        };

        reader.readAsDataURL(file);
    }

});


// AI Enhance

enhanceBtn.addEventListener("click", function () {

    if (previewImage.src) {

        previewImage.style.filter =
            "brightness(1.1) contrast(1.15) saturate(1.2)";

    }

});


// Brightness

brightnessBtn.addEventListener("click", function () {

    if (previewImage.src) {

        previewImage.style.filter =
            "brightness(1.4)";

    }

});


// Black & White

grayscaleBtn.addEventListener("click", function () {

    if (previewImage.src) {

        previewImage.style.filter =
            "grayscale(1)";

    }

});


// Reset

resetBtn.addEventListener("click", function () {

    previewImage.style.filter = "none";

});
// =====================================
// BUY PHOTO MODAL
// =====================================

const buyButtons =
    document.querySelectorAll(".buy-btn");

const buyModal =
    document.getElementById("buyModal");

const buyClose =
    document.getElementById("buyClose");

const buyPhotoName =
    document.getElementById("buyPhotoName");

const buyPhotoPrice =
    document.getElementById("buyPhotoPrice");

const confirmBuy =
    document.getElementById("confirmBuy");


// Open modal

buyButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const photoName =
            button.getAttribute("data-photo");

        const price =
            button.getAttribute("data-price");

        buyPhotoName.textContent =
            photoName;

        buyPhotoPrice.textContent =
            price;

        buyModal.classList.add("show");

    });

});


// Close modal

buyClose.addEventListener("click", function() {

    buyModal.classList.remove("show");

});


// Close by background

buyModal.addEventListener("click", function(event) {

    if (event.target === buyModal) {

        buyModal.classList.remove("show");

    }

});


// Continue Purchase

confirmBuy.addEventListener("click", function() {

    const photoName = buyPhotoName.textContent;
    const price = buyPhotoPrice.textContent;
    window.location.href = "Checkout.html" + "?photo" + encodeURIComponent(photoName) + 
    "&price" +
    encodeURIComponent(price);

});
// =====================================
// PHOTO DOWNLOAD
// =====================================

const downloadButtons =
    document.querySelectorAll(".download-btn");


downloadButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Get image path
        const imagePath =
            button.getAttribute("data-image");

        // Get download file name
        const fileName =
            button.getAttribute("data-name");


        // Create temporary link
        const downloadLink =
            document.createElement("a");

        downloadLink.href = imagePath;

        downloadLink.download = fileName;

        document.body.appendChild(downloadLink);

        // Start download
        downloadLink.click();

        // Remove temporary link
        document.body.removeChild(downloadLink);


        // Show message
        showDownloadMessage(
            "Photo downloaded successfully!"
        );

    });

});


// =====================================
// DOWNLOAD MESSAGE
// =====================================

function showDownloadMessage(message) {

    const messageBox =
        document.createElement("div");

    messageBox.className =
        "download-message";

    messageBox.textContent =
        message;


    document.body.appendChild(messageBox);


    // Show message
    setTimeout(function() {

        messageBox.classList.add("show");

    }, 50);


    // Hide message
    setTimeout(function() {

        messageBox.classList.remove("show");

    }, 2500);


    // Remove message
    setTimeout(function() {

        messageBox.remove();

    }, 3000);

}