/* ================================================
   GAYA INFO TV — Script principal (VERSION FIX)
   ================================================ */

// ── Clé CMS ──────────────────────────
const GAYA_STORAGE_KEY = 'gaya_articles';

function loadCMSArticles() {
  try {
    return JSON.parse(localStorage.getItem(GAYA_STORAGE_KEY) || '[]')
      .filter(a => a.status === 'published');
  } catch(e) { return []; }
}

// ── HEADER SCROLL ───────────────────
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// ── DATE ────────────────────────────
const dateEl = document.getElementById('current-date');
if (dateEl) {
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString('fr-SN', opts);
}

// ── MENU MOBILE (FIX PRINCIPAL) ─────
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');

// Overlay
let navOverlay = document.querySelector('.nav-overlay');
if (!navOverlay) {
  navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);
}

let navOpen = false;

function openNav() {
  if (!mainNav || !hamburger) return;

  navOpen = true;
  mainNav.classList.add('open');
  hamburger.classList.add('open');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  if (!mainNav || !hamburger) return;

  navOpen = false;
  mainNav.classList.remove('open');
  hamburger.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Click hamburger
if (hamburger && mainNav) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navOpen ? closeNav() : openNav();
  });
}

// Click overlay
navOverlay.addEventListener('click', closeNav);

// ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});

// Click outside
document.addEventListener('click', (e) => {
  if (!navOpen) return;
  if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
    closeNav();
  }
});

// Close on link click
document.querySelectorAll('.main-nav a:not(.dropdown-trigger)').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) closeNav();
  });
});

// Dropdown mobile
document.querySelectorAll('.nav-dropdown .dropdown-trigger').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      e.stopPropagation();
      trigger.closest('.nav-dropdown').classList.toggle('open');
    }
  });
});

// Resize fix
window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && navOpen) closeNav();
});

// ── SEARCH ──────────────────────────
const searchToggle = document.getElementById('search-toggle');
const searchBar    = document.getElementById('search-bar');
const searchClose  = document.getElementById('search-close');

if (searchToggle && searchBar) {
  searchToggle.addEventListener('click', () => {
    searchBar.classList.toggle('open');
    if (searchBar.classList.contains('open')) {
      searchBar.querySelector('input')?.focus();
    }
  });
}

if (searchClose && searchBar) {
  searchClose.addEventListener('click', () => {
    searchBar.classList.remove('open');
  });
}

// ── HERO SLIDER ─────────────────────
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');
let slideInterval;

function goToSlide(n) {
  if (!slides.length) return;

  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  currentSlide = (n + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function changeSlide(dir) {
  clearInterval(slideInterval);
  goToSlide(currentSlide + dir);
  startSlideAuto();
}

function startSlideAuto() {
  slideInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 6000);
}

if (slides.length > 0) startSlideAuto();

// ── ARTICLES ────────────────────────
const articles = [
  { category: 'Politique', title: 'Sommet régional...', excerpt: 'Une réunion historique...', date: '21 Avr 2025', icon: 'fa-landmark' },
  { category: 'Sport', title: 'Finale nationale...', excerpt: 'Un match intense...', date: '20 Avr 2025', icon: 'fa-futbol' },
  { category: 'Santé', title: 'Campagne nationale...', excerpt: 'Les équipes médicales...', date: '19 Avr 2025', icon: 'fa-syringe' },
  { category: 'Économie', title: 'Croissance locale...', excerpt: 'Le tissu économique...', date: '18 Avr 2025', icon: 'fa-chart-line' }
];

function renderArticles() {
  const grid = document.getElementById('articles-grid');
  if (!grid) return;

  const cmsArticles = loadCMSArticles();
  const combined = cmsArticles.length > 0
    ? [...cmsArticles, ...articles].slice(0, 8)
    : articles;

  grid.innerHTML = combined.map(a => `
    <article class="article-card">
      <div class="article-card-img">
        <span class="placeholder-icon"><i class="fa-solid ${a.icon || 'fa-newspaper'}"></i></span>
      </div>
      <div class="article-card-body">
        <div class="article-category">${a.category || ''}</div>
        <h3 class="article-title">${a.title}</h3>
        <p class="article-excerpt">${a.excerpt}</p>
        <div class="article-meta">${a.date}</div>
      </div>
    </article>
  `).join('');
}

renderArticles();
setInterval(renderArticles, 30000);

// ── NEWSLETTER ─────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  if (!input?.value) return;

  alert('Merci pour votre inscription !');
  input.value = '';
}

// ── LIVE YOUTUBE ───────────────────
async function checkLive() {
  const container = document.getElementById("live-content");
  if (!container) return;

  container.innerHTML = `<p style="text-align:center;color:#aaa;">Live indisponible pour le moment</p>`;
}

checkLive();

// ── TOAST ──────────────────────────
function showToast(e) {
  alert("Bientôt disponible");
}
