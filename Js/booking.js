document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    const eventDateInput = document.getElementById("eventDate");
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    eventDateInput.min = localToday;

    const photographerWhatsApp = "YOUR_WHATSAPP_NUMBER";

    const bookingForm = document.getElementById("bookingRequestForm");

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const eventType = document.getElementById("eventType").value;
        const eventDate = document.getElementById("eventDate").value;
        const location = document.getElementById("eventLocation").value.trim();
        const packageType = document.getElementById("servicePackage").value;
        const details = document.getElementById("eventDetails").value.trim();

        if (!bookingForm.checkValidity()) {
            bookingForm.reportValidity();
            return;
        }

        if (photographerWhatsApp === "YOUR_WHATSAPP_NUMBER") {
            alert(
                "Please add your WhatsApp number in booking.js first."
            );
            return;
        }

        const message =
            " PHOTOGRAPHY BOOKING REQUEST\n\n" +

 //Customer: ${name}
 //Customer Phone: ${phone}
 //Event: ${eventType}
 //Event Date: ${eventDate}
 //Location: ${location}
 //Package: ${packageType}

 //Additional Details:
//${details || "No additional details provided."};


       // const whatsappURL =
            "https://wa.me/" +
            photographerWhatsApp +
            "?text=" +
            encodeURIComponent(message);

        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
});

// Sample photo galleries for each service
    const sampleGalleries = {
        wedding: {
            title: "Wedding Photography",
            event: "Wedding",
            photos: [
                {
                    src: "Image/wedding1.jpg",
                    title: "Wedding Moments",
                    description: "Beautiful memories of a special day."
                },
                {
                    src: "Image/wedding4.jpg",
                    title: "Elegant Portrait",
                    description: "A timeless photography style."
                },
                {
                    src: "Image/wedding.jpg",
                    title: "Classic Portrait",
                    description: "Portrait photography inspiration."
                }
            ]
        },

        graduation: {
            title: "Graduation Photography",
            event: "Graduation",
            photos: [
                {
                    src: "Image/geration.jpg",
                    title: "Graduation Portrait",
                    description: "Celebrate your achievement."
                },
                {
                    src: "Image/geration2.jpg",
                    title: "Outdoor Portrait",
                    description: "Natural light and beautiful backgrounds."
                },
                {
                    src: "Image/geration3.jpg",
                    title: "Memorable Moments",
                    description: "Create lasting memories."
                }
            ]
        },

        engagement: {
            title: "Engagement Photography",
            event: "Engagement",
            photos: [
                {
                    src: "Image/perty.jpg",
                    title: "Romantic Moments",
                    description: "A special beginning."
                },
                {
                    src: "Image/perty2.jpg",
                    title: "Couple Portrait Style",
                    description: "Portrait photography inspiration."
                },
                {
                    src: "Image/wedding3.jpg",
                    title: "Outdoor Memories",
                    description: "Natural scenery and soft light."
                }
            ]
        },

        birthday: {
            title: "Birthday & Party Photography",
            event: "Birthday",
            photos: [
                {
                    src: "Image/birthday.jpg",
                    title: "Celebration Moments",
                    description: "Capture happy memories."
                },
                {
                    src: "Image/birthday3.jpg",
                    title: "Event Details",
                    description: "Beautiful details and decorations."
                },
                {
                    src: "Image/perty.jpg",
                    title: "Party Portraits",
                    description: "Portraits to remember."
                }
            ]
        }
    };

    const samplesSection = document.getElementById("samplesSection");
    const samplesTitle = document.getElementById("samplesTitle");
    const samplesGrid = document.getElementById("samplesGrid");
    const bookThisEvent = document.getElementById("bookThisEvent");

    document.querySelectorAll("[data-gallery]").forEach(button => {
        button.addEventListener("click", function () {
            const gallery = sampleGalleries[this.dataset.gallery];

            if (!gallery) return;

            samplesTitle.textContent = gallery.title;
            samplesGrid.replaceChildren();

            gallery.photos.forEach(photo => {
                const column = document.createElement("div");
                column.className = "col-md-6 col-lg-4";

                const card = document.createElement("article");
                card.className = "sample-card";

                const img = document.createElement("img");
                img.src = photo.src;
                img.alt = photo.title;
                img.loading = "lazy";
                img.addEventListener("error", function () {
                    this.alt = "Sample image unavailable: " + photo.title;
                });

                const title = document.createElement("h3");
                title.textContent = photo.title;

                const description = document.createElement("p");
                description.textContent = photo.description;

                card.append(img, title, description);
                column.appendChild(card);
                samplesGrid.appendChild(column);
            });

            // Keep the chosen event for the booking form
            document.getElementById("eventType").value = gallery.event;

            samplesSection.hidden = false;
            samplesSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    bookThisEvent.addEventListener("click", function () {
        document.getElementById("bookingForm").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });