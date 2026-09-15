// =====================================
// ADD OR EDIT PHOTOS HERE
// Add an image path like "images/photo1.jpg" to any object.
// If image is blank, the museum gradient artwork remains visible.
// =====================================
const gallery = [
  { image: "", title: "Her Smile", date: "September 2026", description: "A moment I never want to forget.", color: "linear-gradient(145deg,#f7c3d2,#ad687f)" },
  { image: "", title: "The Way She Laughs", date: "A favorite afternoon", description: "The sound that makes every room warmer.", color: "linear-gradient(145deg,#e9d2b4,#aa7180)" },
  { image: "", title: "Softly, Herself", date: "Collected with love", description: "Proof that the quiet moments are the most beautiful.", color: "linear-gradient(145deg,#c0d4cf,#7c9b93)" }
];

const scrapbookMemories = [
  { title: "A little sunshine", date: "the good days", caption: "You make everywhere feel like home.", color: "linear-gradient(145deg,#efd3b2,#d48b9f)", tilt: "-3deg" },
  { title: "Our kind of magic", date: "just us", caption: "Somewhere between a laugh and a look.", color: "linear-gradient(145deg,#c3d7cd,#8ca699)", tilt: "2deg" },
  { title: "Still my favorite", date: "always", caption: "I would choose this life with you again.", color: "linear-gradient(145deg,#d9c2d8,#9a748e)", tilt: "-2deg" },
  { title: "The little things", date: "every day", caption: "The details are where the love lives.", color: "linear-gradient(145deg,#f1c8c3,#c98088)", tilt: "3deg" }
];

const loveReasons = [
  ["Your smile", "It arrives before you do, and somehow makes everything feel possible."],
  ["Your laugh", "The most beautiful kind of interruption. I hope I get to hear it forever."],
  ["Your kindness", "You notice the things other people miss. That is one of your superpowers."],
  ["Your little habits", "All the tiny, wonderfully-you details I would recognize anywhere."],
  ["The way you talk", "I could listen to your stories, your thoughts, and your sleepy voice for hours."],
  ["Our memories", "Every chapter with you is my favorite chapter so far."]
];

const timelineMemories = [
  ["The beginning", "Where it all started", "The first page of a story I already knew I wanted to keep."],
  ["The first memory", "A day worth keeping", "Some moments become landmarks. This one is one of mine."],
  ["More moments", "And then, more us", "The ordinary became extraordinary because I got to share it with you."],
  ["Today", "Still choosing you", "The best part is that our favorite memories are still ahead of us."]
];

const screens = ["opening", "welcome", "contents", "gallery", "memories", "things", "archive", "letter", "garden", "finale"];
let currentPhoto = 0;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function showScreen(id) {
  const target = id === "opening" ? "opening" : id;
  if (id === "opening") $("#bookIntro").classList.remove("opening");
  $$(".screen").forEach((screen) => screen.classList.remove("active-screen"));
  const screen = $("#" + target) || $("#museum");
  screen.classList.add("active-screen");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "welcome") { $("#museum").classList.add("active-screen"); }
  if (id === "finale") createFireflies();
}

function createPetals(amount = 18) {
  const layer = $("#petalLayer");
  for (let i = 0; i < amount; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = `${-10 - Math.random() * 20}%`;
    petal.style.animationDuration = `${5 + Math.random() * 5}s`;
    petal.style.animationDelay = `${Math.random() * 2}s`;
    petal.style.transform = `rotate(${Math.random() * 180}deg)`;
    layer.appendChild(petal);
    setTimeout(() => petal.remove(), 11000);
  }
}

function createFireflies() {
  const layer = $("#fireflyLayer");
  if (layer.children.length) return;
  for (let i = 0; i < 20; i++) {
    const dot = document.createElement("span");
    dot.className = "firefly";
    dot.style.left = `${5 + Math.random() * 90}%`;
    dot.style.top = `${10 + Math.random() * 75}%`;
    dot.style.animationDelay = `${Math.random() * 2}s`;
    layer.appendChild(dot);
  }
}

function renderGallery() {
  $("#galleryGrid").innerHTML = gallery.map((item, index) => `
    <article class="exhibit-card" data-photo="${index}" tabindex="0" aria-label="View ${item.title}">
      <div class="art-image" style="--art-bg:${item.color}">${item.image ? `<img src="${item.image}" alt="${item.title}">` : ""}</div>
      <div class="exhibit-meta"><span class="eyebrow">Exhibit ${String(index + 1).padStart(3, "0")}</span><h3>${item.title}</h3><p>${item.date}</p><p>${item.description}</p></div>
    </article>`).join("");
  $$(".exhibit-card").forEach((card) => { card.addEventListener("click", () => openViewer(Number(card.dataset.photo))); card.addEventListener("keydown", (e) => { if (e.key === "Enter") openViewer(Number(card.dataset.photo)); }); });
}

function renderScrapbook() {
  $("#scrapbook").innerHTML = scrapbookMemories.map((item) => `<article class="polaroid" style="--tilt:${item.tilt}"><div class="art-image" style="--art-bg:${item.color}"></div><p>${item.caption}</p><small>${item.title} · ${item.date}</small></article>`).join("");
  $$(".polaroid").forEach((card) => card.addEventListener("click", () => card.classList.toggle("lifted")));
}

function renderReasons() {
  $("#loveCards").innerHTML = loveReasons.map((item) => `<article class="love-card"><button aria-expanded="false"><span class="card-plus">+</span><h3>${item[0]}</h3><p>${item[1]}</p></button></article>`).join("");
  $$(".love-card button").forEach((button) => button.addEventListener("click", () => { const card = button.parentElement; const open = card.classList.toggle("open"); button.setAttribute("aria-expanded", open); }));
}

function renderTimeline() {
  $("#timeline").innerHTML = timelineMemories.map((item) => `<article class="timeline-item"><time>${item[0]}</time><h3>${item[1]}</h3><p>${item[2]}</p></article>`).join("");
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }), { threshold: .2 });
  $$(".timeline-item").forEach((item) => observer.observe(item));
}

function openViewer(index) {
  currentPhoto = index; updateViewer(); $("#viewer").classList.add("visible"); $("#viewer").setAttribute("aria-hidden", "false"); document.body.classList.add("no-scroll");
}
function updateViewer() {
  const item = gallery[currentPhoto];
  $("#viewerImage").style.background = item.color;
  $("#viewerImage").innerHTML = item.image ? `<img src="${item.image}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover">` : "";
  $("#viewerExhibit").textContent = `Exhibit ${String(currentPhoto + 1).padStart(3, "0")}`;
  $("#viewerTitle").textContent = item.title; $("#viewerDate").textContent = item.date; $("#viewerDescription").textContent = item.description; $("#viewerCount").textContent = `${currentPhoto + 1} / ${gallery.length}`;
}
function closeViewer() { $("#viewer").classList.remove("visible"); $("#viewer").setAttribute("aria-hidden", "true"); document.body.classList.remove("no-scroll"); }

$("#openBook").addEventListener("click", () => { $("#bookIntro").classList.add("opening"); createPetals(26); setTimeout(() => showScreen("welcome"), 1250); });
$$('[data-go]').forEach((button) => button.addEventListener("click", () => showScreen(button.dataset.go)));
$("#menuToggle").addEventListener("click", () => showScreen("contents"));
$("#menuToggleContents").addEventListener("click", () => showScreen("contents"));
$("#closeViewer").addEventListener("click", closeViewer); $("#viewer").addEventListener("click", (e) => { if (e.target.id === "viewer") closeViewer(); });
$("#prevPhoto").addEventListener("click", () => { currentPhoto = (currentPhoto - 1 + gallery.length) % gallery.length; updateViewer(); });
$("#nextPhoto").addEventListener("click", () => { currentPhoto = (currentPhoto + 1) % gallery.length; updateViewer(); });
$("#unfoldLetter").addEventListener("click", (e) => { $("#letterPaper").classList.toggle("unfolded"); e.currentTarget.textContent = $("#letterPaper").classList.contains("unfolded") ? "Keep this letter close" : "Unfold the letter"; createPetals(12); });
$("#secretTrigger").addEventListener("click", () => { $("#secretRoom").classList.add("visible"); $("#secretRoom").setAttribute("aria-hidden", "false"); createPetals(16); });
$("#closeSecret").addEventListener("click", () => { $("#secretRoom").classList.remove("visible"); $("#secretRoom").setAttribute("aria-hidden", "true"); });

function createGarden() {
  const garden = $("#lilyGarden");
  ["secretly, I adore you.", "you are my favorite bloom.", "I would find you in every garden."].forEach((message, index) => {
    const flower = document.createElement("button"); flower.className = "garden-lily"; flower.style.left = index === 0 ? "8%" : index === 1 ? "36%" : "70%"; flower.setAttribute("aria-label", "Discover garden message");
    flower.innerHTML = `<span class="stem"></span><span class="flower lily"><i></i><i></i><i></i><i></i><i></i><b></b></span>`;
    flower.addEventListener("click", () => { $("#gardenMessage").textContent = message; createPetals(5); }); garden.appendChild(flower);
  });
}

renderGallery(); renderScrapbook(); renderReasons(); renderTimeline(); createGarden();
