 document.addEventListener("DOMContentLoaded", () => {
    const cards = [...document.querySelectorAll(".photo-card")];
    const filterButtons = [...document.querySelectorAll(".filter-btn")];

    const searchInput = document.getElementById("photoSearch");
    const clearSearch = document.getElementById("clearSearch");
    const favoritesToggle = document.getElementById("favoritesToggle");
    const topFavorites = document.getElementById("topFavorites");
    const favCount = document.getElementById("favCount");
    const topFavCount = document.getElementById("topFavCount");
    const emptyState = document.getElementById("emptyState");
    const resetGallery = document.getElementById("resetGallery");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxCategory = document.getElementById("lightboxCategory");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const lightboxDownload = document.getElementById("lightboxDownload");
    const lightboxFavorite = document.getElementById("lightboxFavorite");

    let activeCategory = "all";
    let onlyFavorites = false;
    let currentCard = null;
    let previousFocus = null;
    let favorites = new Set();

    try {
        const saved = JSON.parse(localStorage.getItem("shirzadFavorites") || "[]");
        if (Array.isArray(saved)) favorites = new Set(saved);
    } catch (error) {
        favorites = new Set();
    }

    const getId = card => card.querySelector(".photo-img").getAttribute("src");
    const getImage = card => card.querySelector(".photo-img");

    function saveFavorites() {
        try {
            localStorage.setItem("shirzadFavorites", JSON.stringify([...favorites]));
        } catch (error) {
            // The gallery still works if browser storage is unavailable.
        }
    }

    function updateFavoriteUI() {
        cards.forEach(card => {
            const button = card.querySelector(".favorite-btn");
            const icon = button.querySelector("i");
            const saved = favorites.has(getId(card));

            button.classList.toggle("is-favorite", saved);
            button.setAttribute("aria-pressed", String(saved));
            icon.className = saved ? "bi bi-heart-fill" : "bi bi-heart";
        });

        favCount.textContent = favorites.size;
        topFavCount.textContent = favorites.size;

        if (currentCard) {
            const saved = favorites.has(getId(currentCard));
            lightboxFavorite.classList.toggle("is-favorite", saved);
            lightboxFavorite.innerHTML = saved
                ? '<i class="bi bi-heart-fill"></i>'
                : '<i class="bi bi-heart"></i>';
        }
    }

    function applyFilters() {
        const query = searchInput.value.trim().toLowerCase();
        let visible = 0;

        cards.forEach(card => {
            const title = card.dataset.title.toLowerCase();
            const category = card.dataset.category.toLowerCase();

            const matchesCategory =
                activeCategory === "all" || category === activeCategory;

            const matchesSearch =
                title.includes(query) || category.includes(query);

            const matchesFavorite =
                !onlyFavorites || favorites.has(getId(card));

            const show = matchesCategory && matchesSearch && matchesFavorite;
            card.hidden = !show;

            if (show) visible++;
        });

        emptyState.hidden = visible > 0;
        document.getElementById("heroPhotoCount").textContent =
            String(cards.length).padStart(2, "0");

        updateFavoriteUI();
    }
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.filter;
            onlyFavorites = false;
            favoritesToggle.classList.remove("active");
            topFavorites.classList.remove("active");

            filterButtons.forEach(item =>
                item.classList.toggle("active", item === button)
            );

            applyFilters();
        });
    });

    function toggleFavoritesView() {
        onlyFavorites = !onlyFavorites;
        favoritesToggle.classList.toggle("active", onlyFavorites);
        topFavorites.classList.toggle("active", onlyFavorites);
        applyFilters();
    }

    favoritesToggle.addEventListener("click", toggleFavoritesView);
    topFavorites.addEventListener("click", () => {
        if (!onlyFavorites) toggleFavoritesView();
        document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
    });

    cards.forEach(card => {
        const favoriteButton = card.querySelector(".favorite-btn");

        favoriteButton.addEventListener("click", () => {
            const id = getId(card);
            favorites.has(id) ? favorites.delete(id) : favorites.add(id);
            saveFavorites();
            applyFilters();
        });

        card.querySelector(".image-open").addEventListener("click", () => openLightbox(card));
        getImage(card).addEventListener("click", () => openLightbox(card));
    });

    searchInput.addEventListener("input", () => {
        clearSearch.style.display = searchInput.value ? "block" : "none";
        applyFilters();
    });

    clearSearch.addEventListener("click", () => {
        searchInput.value = "";
        clearSearch.style.display = "none";
        applyFilters();
        searchInput.focus();
    });

    document.getElementById("searchFocus").addEventListener("click", () => {
        searchInput.focus();
        document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
    });

    resetGallery.addEventListener("click", () => {
        activeCategory = "all";
        onlyFavorites = false;
        searchInput.value = "";
        clearSearch.style.display = "none";
        favoritesToggle.classList.remove("active");
        topFavorites.classList.remove("active");

        filterButtons.forEach(button =>
            button.classList.toggle("active", button.dataset.filter === "all")
        );

        applyFilters();
    });

    function getVisibleCards() {
        return cards.filter(card => !card.hidden);
    }

    function openLightbox(card) {
        previousFocus = document.activeElement;
        currentCard = card;
        showCard(card);

        lightbox.classList.add("show");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        lightboxClose.focus();
    }

    function showCard(card) {
        currentCard = card;
        const img = getImage(card);

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = card.dataset.title;
        lightboxCategory.textContent = card.dataset.category.toUpperCase() + " PHOTOGRAPHY";

        lightboxDownload.href = img.src;
        lightboxDownload.download =
            card.dataset.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".jpg";

        updateFavoriteUI();
    }

    function moveLightbox(direction) {
        const visible = getVisibleCards();
        if (!visible.length) return;

        let index = visible.indexOf(currentCard);
        if (index < 0) index = 0;

        index = (index + direction + visible.length) % visible.length;
        showCard(visible[index]);
    }

    function closeLightbox() {
        lightbox.classList.remove("show");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }
    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", () => moveLightbox(-1));
    lightboxNext.addEventListener("click", () => moveLightbox(1));

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeLightbox();
    });

    lightboxFavorite.addEventListener("click", () => {
        if (!currentCard) return;

        const id = getId(currentCard);
        favorites.has(id) ? favorites.delete(id) : favorites.add(id);

        saveFavorites();
        applyFilters();
    });

    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("show")) return;

        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") moveLightbox(1);
        if (event.key === "ArrowLeft") moveLightbox(-1);
    });

    menuToggle.addEventListener("click", () => {
        const opened = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(opened));
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => navLinks.classList.remove("open"));
    });

    updateFavoriteUI();
    applyFilters();
});

const paidModal = document.getElementById("paidModal");
const closePaidModal = document.getElementById("closePaidModal");
const confirmPayment = document.getElementById("confirmPayment");
const confirmDownload = document.getElementById("confirmDownload");

let selectedPaidImage = null;

let activeCategory = "all";
let activeAccess = "all";
let activeOrientation = "all";

const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".photo-card");
const searchInput = document.getElementById("photoSearch");
const clearSearch = document.getElementById("clearSearch");
const emptyState = document.getElementById("emptyState");

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
        const category = card.dataset.category || "";
        const title = card.dataset.title || "";
        const access = card.dataset.access || "free";
        const orientation = card.dataset.orientation || "horizontal";

        const matchesCategory =
            activeCategory === "all" || category === activeCategory;

        const matchesAccess =
            activeAccess === "all" || access === activeAccess;

        const matchesOrientation =
            activeOrientation === "all" ||
            orientation === activeOrientation;

        const matchesSearch =
            title.toLowerCase().includes(query) ||
            category.toLowerCase().includes(query);

        const shouldShow =
            matchesCategory &&
            matchesAccess &&
            matchesOrientation &&
            matchesSearch;

        card.hidden = !shouldShow;

        if (shouldShow) visibleCount++;
    });

    emptyState.hidden = visibleCount > 0;

    const countElement = document.getElementById("heroPhotoCount");
    if (countElement) {
        countElement.textContent = String(visibleCount).padStart(2, "0");
    }
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const group = button.dataset.filterGroup;
        const value = button.dataset.filter;

        if (group === "category") {
            activeCategory = value;
        } else if (group === "access") {
            activeAccess = activeAccess === value ? "all" : value;
        } else if (group === "orientation") {
            activeOrientation =
                activeOrientation === value ? "all" : value;
        }

        filterButtons.forEach(item => {
            const itemGroup = item.dataset.filterGroup;
            const itemValue = item.dataset.filter;

            const isActive =
                (itemGroup === "category" &&
                    itemValue === activeCategory) ||
                (itemGroup === "access" &&
                    itemValue === activeAccess) ||
                (itemGroup === "orientation" &&
                    itemValue === activeOrientation);

            item.classList.toggle("active", isActive);
        });

        applyFilters();
    });
});

searchInput.addEventListener("input", () => {
    clearSearch.style.display =
        searchInput.value ? "block" : "none";

    applyFilters();
});

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
    applyFilters();
});

// کلیک روی آیکن دانلود عکس پولی
document.querySelectorAll(".photo-card").forEach(card => {
    const paidBadge = card.querySelector(".paid-badge");
    const downloadButton = card.querySelector(".download-icon");

    if (paidBadge && downloadButton) {
        downloadButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            selectedPaidImage = card.querySelector(".photo-img")?.src;

            confirmPayment.checked = false;
            confirmDownload.disabled = true;
            paidModal.classList.add("show");
        });
    }
});

// فعال‌شدن دکمه پس از انتخاب Checkbox
confirmPayment.addEventListener("change", function () {
    confirmDownload.disabled = !this.checked;
});

// بستن پنجره
closePaidModal.addEventListener("click", function () {
    paidModal.classList.remove("show");
});

// کلیک بیرون پنجره
paidModal.addEventListener("click", function (event) {
    if (event.target === paidModal) {
        paidModal.classList.remove("show");
    }
});



