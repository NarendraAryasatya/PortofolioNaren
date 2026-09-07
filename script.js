
// =========================
// NAVBAR ACTIVE LINK
// =========================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", function () {

    let current = "";

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach(function (link) {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }

    });

});


// =========================
// PROJECT LIVE PREVIEW MODAL
// =========================

const projectModal = document.getElementById("projectModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalIframe = document.getElementById("modalIframe");
const modalLoader = document.getElementById("modalLoader");
const openPreviewBtns = document.querySelectorAll(".open-preview-btn");

function openModal(url) {
    if (!projectModal) return;
    if (modalLoader) modalLoader.classList.remove("hidden");
    if (modalIframe) {
        modalIframe.src = url;
        modalIframe.onload = function () {
            if (modalLoader) modalLoader.classList.add("hidden");
        };
    }
    projectModal.classList.add("active");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove("active");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    setTimeout(() => {
        if (modalIframe && !projectModal.classList.contains("active")) {
            modalIframe.src = "";
        }
    }, 300);
}

openPreviewBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        const url = this.getAttribute("data-url") || "projects/atlas-clock/index.html";
        openModal(url);
    });
});

if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
}

if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeModal);
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && projectModal && projectModal.classList.contains("active")) {
        closeModal();
    }
});