 "use strict";

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. انتخاب عناصر صفحه
    // ==========================================

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
    const heroPhotoCount = document.getElementById("heroPhotoCount");

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxCategory = document.getElementById("lightboxCategory");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const lightboxDownload = document.getElementById("lightboxDownload");
    const lightboxFavorite = document.getElementById("lightboxFavorite");

    // ==========================================
    // 2. وضعیت گالری
    // ==========================================

    let activeCategory = "all";
    let activeAccess = "all";
    let activeOrientation = "all";
    let onlyFavorites = false;

    let currentCard = null;
    let previousFocus = null;

    const FAVORITES_KEY = "shirzadFavorites";
    let favorites = new Set();

    // خواندن علاقه‌مندی‌های ذخیره‌شده
    try {
        const saved = JSON.parse(
            localStorage.getItem(FAVORITES_KEY) || "[]"
        );

        if (Array.isArray(saved)) {
            favorites = new Set(saved);
        }
    } catch (error) {
        favorites = new Set();
    }

    // ==========================================
    // 3. توابع کمکی
    // ==========================================

    function getImage(card) {
        return card.querySelector(".photo-img");
    }

    function getId(card) {
        const image = getImage(card);
        return image ? image.getAttribute("src") : "";
    }

    function isPaid(card) {
        return card.dataset.access === "paid";
    }

    function saveFavorites() {
        try {
            localStorage.setItem(
                FAVORITES_KEY,
                JSON.stringify([...favorites])
            );
        } catch (error) {
            console.warn("Could not save favorites.", error);
        }
    }

    function toggleFavorite(card) {
        const id = getId(card);

        if (!id) return;

        if (favorites.has(id)) {
            favorites.delete(id);
        } else {
            favorites.add(id);
        }

        saveFavorites();
        updateFavoriteUI();
        applyFilters();
    }

    // ==========================================
    // 4. نمایش وضعیت علاقه‌مندی‌ها
    // ==========================================

    function updateFavoriteUI() {
        cards.forEach(card => {
            const button = card.querySelector(".favorite-btn");

            if (!button) return;

            const icon = button.querySelector("i");
            const saved = favorites.has(getId(card));

            button.classList.toggle("is-favorite", saved);
            button.setAttribute("aria-pressed", String(saved));

            if (icon) {
                icon.className = saved
                    ? "bi bi-heart-fill"
                    : "bi bi-heart";
            }
        });
        if (favCount) {
            favCount.textContent = favorites.size;
        }

        if (topFavCount) {
            topFavCount.textContent = favorites.size;
        }

        if (currentCard && lightboxFavorite) {
            const saved = favorites.has(getId(currentCard));
            const icon = saved
                ? "bi bi-heart-fill"
                : "bi bi-heart";

            lightboxFavorite.classList.toggle("is-favorite", saved);
            lightboxFavorite.setAttribute(
                "aria-pressed",
                String(saved)
            );

            lightboxFavorite.innerHTML = `<i class="${icon}"></i>`;
        }
    }

    // ==========================================
    // 5. فیلتر، جستجو و تعداد عکس‌ها
    // ==========================================

    function applyFilters() {
        const query = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        cards.forEach(card => {
            const title = (card.dataset.title || "").toLowerCase();
            const category = (card.dataset.category || "").toLowerCase();
            const access = card.dataset.access || "free";
            const orientation = card.dataset.orientation || "horizontal";

            const matchesCategory =
                activeCategory === "all" ||
                category === activeCategory;

            const matchesAccess =
                activeAccess === "all" ||
                access === activeAccess;

            const matchesOrientation =
                activeOrientation === "all" ||
                orientation === activeOrientation;

            const matchesSearch =
                title.includes(query) ||
                category.includes(query);

            const matchesFavorite =
                !onlyFavorites || favorites.has(getId(card));

            const show =
                matchesCategory &&
                matchesAccess &&
                matchesOrientation &&
                matchesSearch &&
                matchesFavorite;

            card.hidden = !show;

            if (show) {
                visibleCount++;
            }
        });

        if (emptyState) {
            emptyState.hidden = visibleCount > 0;
        }

        if (heroPhotoCount) {
            heroPhotoCount.textContent =
                String(visibleCount).padStart(2, "0");
        }

        updateFavoriteUI();
    }

    // ==========================================
    // 6. دکمه‌های فیلتر
    // ==========================================

    function updateFilterButtons() {
        filterButtons.forEach(button => {
            const group = button.dataset.filterGroup || "category";
            const value = button.dataset.filter || "all";

            let active = false;

            if (group === "category") {
                active = value === activeCategory;
            } else if (group === "access") {
                active = value === activeAccess;
            } else if (group === "orientation") {
                active = value === activeOrientation;
            }

            button.classList.toggle("active", active);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const group = button.dataset.filterGroup || "category";
            const value = button.dataset.filter || "all";

            if (group === "category") {
                activeCategory = value;
            } else if (group === "access") {
                activeAccess = value === activeAccess ? "all" : value;
            } else if (group === "orientation") {
                activeOrientation =
                    value === activeOrientation ? "all" : value;
            }

            onlyFavorites = false;

            if (favoritesToggle) {
                favoritesToggle.classList.remove("active");
            }

            if (topFavorites) {
                topFavorites.classList.remove("active");
            }
           updateFilterButtons();
            applyFilters();
        });
    });

    // ==========================================
    // 7. علاقه‌مندی‌ها
    // ==========================================

    function toggleFavoritesView() {
        onlyFavorites = !onlyFavorites;

        if (favoritesToggle) {
            favoritesToggle.classList.toggle("active", onlyFavorites);
        }

        if (topFavorites) {
            topFavorites.classList.toggle("active", onlyFavorites);
        }

        applyFilters();
    }

    if (favoritesToggle) {
        favoritesToggle.addEventListener(
            "click",
            toggleFavoritesView
        );
    }

    if (topFavorites) {
        topFavorites.addEventListener("click", () => {
            if (!onlyFavorites) {
                toggleFavoritesView();
            }

            document.getElementById("gallery")?.scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    cards.forEach(card => {
        const favoriteButton = card.querySelector(".favorite-btn");
        const image = getImage(card);
        const openButton = card.querySelector(".image-open");

        if (favoriteButton) {
            favoriteButton.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                toggleFavorite(card);
            });
        }

        if (openButton) {
            openButton.addEventListener("click", () => {
                openLightbox(card);
            });
        }

        if (image) {
            image.addEventListener("click", () => {
                openLightbox(card);
            });
        }
    });

    // ==========================================
    // 8. جستجوی عکس‌ها
    // ==========================================

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            if (clearSearch) {
                clearSearch.style.display =
                    searchInput.value ? "block" : "none";
            }

            applyFilters();
        });
    }

    if (clearSearch) {
        clearSearch.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
                searchInput.focus();
            }

            clearSearch.style.display = "none";
            applyFilters();
        });
    }

    const searchFocus = document.getElementById("searchFocus");

    if (searchFocus) {
        searchFocus.addEventListener("click", () => {
            searchInput?.focus();

            document.getElementById("gallery")?.scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    // ==========================================
    // 9. بازنشانی فیلترها
    // ==========================================

    function resetAllFilters() {
        activeCategory = "all";
        activeAccess = "all";
        activeOrientation = "all";
        onlyFavorites = false;

        if (searchInput) {
            searchInput.value = "";
        }

        if (clearSearch) {
            clearSearch.style.display = "none";
        }

        if (favoritesToggle) {
            favoritesToggle.classList.remove("active");
        }

        if (topFavorites) {
            topFavorites.classList.remove("active");
        }

        updateFilterButtons();
        applyFilters();
    }

    if (resetGallery) {
        resetGallery.addEventListener("click", resetAllFilters);
    }

    // ==========================================
    // 10. نمایش بزرگ عکس (Lightbox)
    // ==========================================

    function openLightbox(card) {
        if (!lightbox) return;

        previousFocus = document.activeElement;
        currentCard = card;

        showCard(card);

        lightbox.classList.add("show");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        lightboxClose?.focus();
    }

    function showCard(card) {
        currentCard = card;
    const image = getImage(card);

        if (!image) return;

        if (lightboxImage) {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
        }

        if (lightboxTitle) {
            lightboxTitle.textContent =
                card.dataset.title || image.alt || "Photography";
        }

        if (lightboxCategory) {
            lightboxCategory.textContent =
                (card.dataset.category || "photo").toUpperCase() +
                " PHOTOGRAPHY";
        }

       
        if (lightboxDownload) {
            if (isPaid(card)) {
                lightboxDownload.href = createChecklistURL(card);
                lightboxDownload.removeAttribute("download");
                lightboxDownload.setAttribute(
                    "aria-label",
                    "Continue to Premium Checklist"
                );
            } else {
                lightboxDownload.href = image.getAttribute("src");
                lightboxDownload.download =
                    makeFilename(card.dataset.title || "photo") + ".jpg";

                lightboxDownload.setAttribute(
                    "aria-label",
                    "Download photo"
                );
            }
        }

        updateFavoriteUI();
    }

    function getVisibleCards() {
        return cards.filter(card => !card.hidden);
    }

    function moveLightbox(direction) {
        const visible = getVisibleCards();

        if (!visible.length || !currentCard) return;

        let index = visible.indexOf(currentCard);

        if (index < 0) index = 0;

        index =
            (index + direction + visible.length) % visible.length;

        showCard(visible[index]);
    }

    function closeLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove("show");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }

        currentCard = null;
    }

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener("click", () => {
            moveLightbox(-1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener("click", () => {
            moveLightbox(1);
        });
    }

    if (lightbox) {
        lightbox.addEventListener("click", event => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    if (lightboxFavorite) {
        lightboxFavorite.addEventListener("click", () => {
            if (currentCard) {
                toggleFavorite(currentCard);
            }
        });
    }

    document.addEventListener("keydown", event => {
        if (!lightbox?.classList.contains("show")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            moveLightbox(1);
        }

        if (event.key === "ArrowLeft") {
            moveLightbox(-1);
        }
    });



    function makeFilename(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "photo";
    }

    function createChecklistURL(card) {
        const image = getImage(card);

        const params = new URLSearchParams({
            title: card.dataset.title || "Premium Photo",
            image: image ? image.getAttribute("src") : "",
            category: card.dataset.category || "photo"
        });

        return "checklist.html?" + params.toString();
    }
   
    cards.forEach(card => {
        const downloadButton = card.querySelector(".download-icon");

        if (!downloadButton) return;

        if (isPaid(card)) {
            downloadButton.removeAttribute("download");
            downloadButton.href = createChecklistURL(card);

            downloadButton.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();

                window.location.href = createChecklistURL(card);
            });
        }
    });

    // ==========================================
    // 12. منوی موبایل
    // ==========================================

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const opened = navLinks.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(opened)
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ==========================================
    // 13. شروع گالری
    // ==========================================

    updateFilterButtons();
    updateFavoriteUI();
    applyFilters();
});