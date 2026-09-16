/* ============================================================
   THE STORY OF HER — INTERACTIONS
   This file is intentionally plain JavaScript so it can be edited
   from GitHub on a phone. No build step or framework is required.
   ============================================================ */

/* ============================================================
   ADD YOUR GIRLFRIEND'S PHOTOS HERE
   ------------------------------------------------------------
   1. Upload each photo into the images/ folder.
   2. Change the image path below to match the file name.
   3. Copy one full object to add another exhibit.
   ============================================================ */
const gallery = [
  {
    image: "images/photo1.jpg",
    title: "Her Smile",
    date: "September 2026",
    description: "A moment I never want to forget.",
  },
  {
    image: "images/photo2.jpg",
    title: "A Beautiful Moment",
    date: "September 2026",
    description: "Proof that the ordinary can be extraordinary.",
  },
  {
    image: "images/photo3.jpg",
    title: "The Light She Carries",
    date: "A day worth keeping",
    description: "Some people make every room feel warmer.",
  },
];

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const openingStage = $("#opening-stage");
const museumApp = $("#museum-app");
const book = $("#book");
const petalField = $("#petal-field");
const viewer = $("#viewer");
let currentArtwork = 0;
let toastTimer;
let openingInProgress = false;

/* Render the museum exhibit cards from the single gallery list above. */
function renderGallery() {
  const grid = $("#gallery-grid");
  if (!grid) return;

  grid.innerHTML = gallery
    .map(
      (item, index) => `
        <button class="artwork-card reveal" type="button" data-artwork-index="${index}" aria-label="Open ${item.title}">
          <div class="art-frame">
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
          </div>
          <div class="art-caption">
            <div class="art-caption-top"><span>Exhibit ${String(index + 1).padStart(3, "0")}</span><span>↗</span></div>
            <h3>${item.title}</h3>
            <p>Photograph · ${item.date}</p>
          </div>
        </button>
      `,
    )
    .join("");

  $$(".artwork-card").forEach((card) => {
    card.addEventListener("click", () => openViewer(Number(card.dataset.artworkIndex)));
  });

  $$("img").forEach(prepareImageFallback);
  observeReveals();
}

function prepareImageFallback(image) {
  if (image.dataset.fallbackReady) return;
  image.dataset.fallbackReady = "true";
  image.addEventListener("error", () => {
    image.closest(".art-frame, .polaroid-image, .viewer-media")?.classList.add("has-image-fallback");
    image.style.display = "none";
  });
}

function createPetals(amount = 24) {
  if (!petalField) return;
  petalField.innerHTML = "";
  for (let index = 0; index < amount; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${Math.round(Math.random() * 160 - 80)}px`);
    petal.style.animationDuration = `${4.5 + Math.random() * 4}s`;
    petal.style.animationDelay = `${Math.random() * 1.8}s`;
    petal.style.transform = `rotate(${Math.round(Math.random() * 180)}deg)`;
    petalField.appendChild(petal);
  }
  window.setTimeout(() => { petalField.innerHTML = ""; }, 10000);
}

function openMuseum() {
  if (openingInProgress || !openingStage || openingStage.classList.contains("is-hidden")) return;
  openingInProgress = true;
  book.setAttribute("aria-label", "Opening book");
  $("#open-book")?.setAttribute("disabled", "true");
  book.classList.add("is-opening");
  createPetals(32);
  window.setTimeout(() => {
    book.classList.add("is-zooming");
    openingStage.classList.add("is-leaving");
  }, 2100);
  window.setTimeout(() => {
    openingStage.classList.add("is-hidden");
    museumApp.classList.remove("is-hidden");
    museumApp.classList.add("is-entering");
    window.scrollTo({ top: 0, behavior: "instant" });
    observeReveals();
    window.requestAnimationFrame(() => museumApp.classList.remove("is-entering"));
  }, 3900);
}

function closeMuseum() {
  museumApp.classList.add("is-hidden");
  openingStage.classList.remove("is-hidden");
  openingStage.classList.remove("is-leaving");
  book.classList.remove("is-opening");
  book.classList.remove("is-zooming");
  book.setAttribute("aria-label", "Closed book");
  $("#open-book")?.removeAttribute("disabled");
  openingInProgress = false;
  window.scrollTo({ top: 0, behavior: "instant" });
  createPetals(20);
}

$("#open-book")?.addEventListener("click", openMuseum);
book?.addEventListener("click", openMuseum);
$("#close-book")?.addEventListener("click", closeMuseum);

/* Mobile menu */
const menuToggle = $("#menu-toggle");
const chapterMenu = $("#chapter-menu");
menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  chapterMenu.classList.toggle("is-open", !isOpen);
});

$$(".chapter-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    chapterMenu.classList.remove("is-open");
  });
});

/* Gallery fullscreen viewer */
function updateViewer(index) {
  currentArtwork = (index + gallery.length) % gallery.length;
  const item = gallery[currentArtwork];
  const image = $("#viewer-image");
  const media = $(".viewer-media");

  $("#viewer-exhibit").textContent = `EXHIBIT ${String(currentArtwork + 1).padStart(3, "0")}`;
  $("#viewer-title").textContent = item.title;
  $("#viewer-date").textContent = `Photograph · ${item.date}`;
  $("#viewer-description").textContent = item.description;
  $("#viewer-count").textContent = `${String(currentArtwork + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`;
  image.alt = item.title;
  image.classList.remove("is-loaded");
  media.classList.remove("has-image");
  image.style.display = "block";
  image.src = item.image;
  image.onload = () => { image.classList.add("is-loaded"); media.classList.add("has-image"); };
  image.onerror = () => { image.style.display = "none"; media.classList.remove("has-image"); };
}

function openViewer(index) {
  updateViewer(index);
  viewer.classList.add("is-open");
  viewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  $("#viewer-close")?.focus();
}

function closeViewer() {
  viewer.classList.remove("is-open");
  viewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

$("#viewer-close")?.addEventListener("click", closeViewer);
$("[data-close-viewer]")?.addEventListener("click", closeViewer);
$("#viewer-prev")?.addEventListener("click", () => updateViewer(currentArtwork - 1));
$("#viewer-next")?.addEventListener("click", () => updateViewer(currentArtwork + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (viewer.classList.contains("is-open")) closeViewer();
    if (chapterMenu.classList.contains("is-open")) menuToggle.click();
  }
  if (viewer.classList.contains("is-open") && event.key === "ArrowRight") updateViewer(currentArtwork + 1);
  if (viewer.classList.contains("is-open") && event.key === "ArrowLeft") updateViewer(currentArtwork - 1);
});

/* Love cards */
$$(".love-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("is-open"));
});

/* Letter unfold */
$("#open-letter")?.addEventListener("click", () => {
  const card = $("#letter-card");
  const isOpen = card.classList.toggle("is-open");
  $("#open-letter").setAttribute("aria-expanded", String(isOpen));
  if (isOpen) createPetals(12);
});

/* Lily garden messages */
$$(".garden-lily").forEach((lily) => {
  lily.addEventListener("click", () => {
    const message = $("#garden-message");
    message.querySelector("p").innerHTML = lily.dataset.message;
    message.classList.add("is-active");
    $$(".garden-lily").forEach((other) => other.classList.remove("is-chosen"));
    lily.classList.add("is-chosen");
  });
});

/* The tiny secret door */
$("#secret-trigger")?.addEventListener("click", () => {
  $("#secret-room").classList.add("is-found");
  $("#secret-room").scrollIntoView({ behavior: "smooth", block: "center" });
  createPetals(18);
  showToast("You found the secret room.");
});

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

/* Lightweight scroll entrance observer, safe to remove or simplify. */
let revealObserver;
function observeReveals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $$(".reveal").forEach((element) => element.classList.add("is-visible"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  $$(".reveal:not(.is-visible)").forEach((element) => revealObserver.observe(element));
}

renderGallery();
observeReveals();
