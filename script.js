// ── Clé partagée avec le CMS ──────────────────────────
const GAYA_STORAGE_KEY = 'gaya_articles';

function loadCMSArticles() {
  try {
    return JSON.parse(localStorage.getItem(GAYA_STORAGE_KEY) || '[]')
      .filter(a => a.status === 'published');
  } catch(e) { return []; }
}

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
        ${a.breaking ? '<span style="background:#c8102e;color:#fff;padding:2px 8px;border-radius:4px;display:inline-block;margin-bottom:4px;font-size:11px;font-weight:700;">🔴 BREAKING</span>' : ''}
        <div class="article-category">${a.category || a.cat || ''}</div>
        <h3 class="article-title">${a.title}</h3>
        <p class="article-excerpt">${a.excerpt}</p>
        <div class="article-meta">
          <i class="fa-regular fa-calendar"></i>
          <span>${a.date}</span>
          ${a.author ? `<span style="margin-left:8px;color:#888;font-size:12px;"><i class="fa-solid fa-user" style="font-size:10px;"></i> ${a.author}</span>` : ''}
        </div>
      </div>
    </article>
  `).join('');
}

setInterval(renderArticles, 30000);

/* ================================================
   GAYA INFO TV — Script principal
   ================================================ */

// ---- HEADER SCROLL ----
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// ---- DATE COURANTE ----
const dateEl = document.getElementById('current-date');
if (dateEl) {
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString('fr-SN', opts);
}

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');

// Overlay créé une seule fois
const navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
document.body.appendChild(navOverlay);

let navOpen = false;

function openNav() {
  navOpen = true;
  mainNav.classList.add('open');
  hamburger.classList.add('open');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navOpen = false;
  mainNav.classList.remove('open');
  hamburger.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', function(e) {
  e.stopPropagation();
  navOpen ? closeNav() : openNav();
});

navOverlay.addEventListener('click', closeNav);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeNav();
});

// Dropdown mobile : toggle au clic
document.querySelectorAll('.nav-dropdown .dropdown-trigger').forEach(function(trigger) {
  trigger.addEventListener('click', function(e) {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      e.stopPropagation();
      trigger.closest('.nav-dropdown').classList.toggle('open');
    }
  });
});

// Fermer nav au clic sur un lien (pas dropdown trigger)
document.querySelectorAll('.main-nav a:not(.dropdown-trigger)').forEach(function(link) {
  link.addEventListener('click', function() {
    if (window.innerWidth <= 900) closeNav();
  });
});
// ===== SAFE DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== HEADER SCROLL EFFECT =====
  const header = document.getElementById('site-header');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // ===== MOBILE NAV =====
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  let navOpen = false;

  function openNav() {
    if (!mainNav || !hamburger) return;

    mainNav.classList.add('open');
    hamburger.classList.add('active');
    navOpen = true;

    // empêche scroll arrière sur mobile
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!mainNav || !hamburger) return;

    mainNav.classList.remove('open');
    hamburger.classList.remove('active');
    navOpen = false;

    document.body.style.overflow = '';
  }

  // CLICK HAMBURGER
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navOpen ? closeNav() : openNav();
    });
  }

  // CLICK EN DEHORS → ferme menu
  document.addEventListener('click', (e) => {
    if (!navOpen || !mainNav) return;

    if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
      closeNav();
    }
  });

  // CLICK SUR UN LIEN → ferme menu (mobile UX)
  const navLinks = document.querySelectorAll('#main-nav a');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  // ===== RESIZE FIX (important mobile ↔ desktop) =====
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navOpen) {
      closeNav();
    }
  });

});
// ---- SEARCH ----
const searchToggle = document.getElementById('search-toggle');
const searchBar    = document.getElementById('search-bar');
const searchClose  = document.getElementById('search-close');

if (searchToggle) searchToggle.addEventListener('click', function() {
  searchBar.classList.toggle('open');
  if (searchBar.classList.contains('open')) searchBar.querySelector('input')?.focus();
});

if (searchClose) searchClose.addEventListener('click', function() {
  searchBar.classList.remove('open');
});

// ---- HERO SLIDER ----
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');
let slideInterval;

function goToSlide(n) {
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
  slideInterval = setInterval(function() { goToSlide(currentSlide + 1); }, 6000);
}

if (slides.length > 0) startSlideAuto();

// ---- ARTICLES DATA ----
const articles = [
  { category: 'Politique', title: 'Sommet régional : les dirigeants africains tracent la feuille de route 2030', excerpt: 'Une réunion historique pour définir les grandes orientations de développement du continent.', date: '21 Avr 2025', icon: 'fa-landmark' },
  { category: 'Sport',     title: 'Finale nationale de football : Saint-Louis en liesse après la victoire',      excerpt: 'Un match intense qui restera dans les annales du football sénégalais.',               date: '20 Avr 2025', icon: 'fa-futbol' },
  { category: 'Santé',     title: 'Campagne nationale de vaccination : des milliers de personnes mobilisées',    excerpt: 'Les équipes médicales parcourent les zones rurales pour atteindre les communautés.',  date: '19 Avr 2025', icon: 'fa-syringe' },
  { category: 'Économie',  title: 'Croissance du marché local : les entrepreneurs de Dagana voient grand',       excerpt: 'Le tissu économique régional se diversifie grâce aux initiatives des jeunes.',         date: '18 Avr 2025', icon: 'fa-chart-line' }
];

const societéArticles = [
  { category: 'Société', title: "Éducation : l'inauguration de trois nouvelles salles de classe à Gaé",  date: '20 Avr 2025', icon: 'fa-graduation-cap' },
  { category: 'Société', title: 'Solidarité : la communauté se mobilise pour les familles sinistrées',    date: '19 Avr 2025', icon: 'fa-hands-holding-heart' },
  { category: 'Société', title: "Agriculture : la saison des pluies s'annonce prometteuse pour la vallée",date: '17 Avr 2025', icon: 'fa-seedling' }
];

const popularArticles = [
  'Résultats des élections locales : les chiffres définitifs',
  'Nouveau pont sur le fleuve Sénégal : les travaux avancent',
  'Festival culturel de Dagana : programme complet dévoilé',
  'Santé : nouveau centre médical ouvert à la population',
  'École : les résultats du BFEM régional publiés'
];

function renderSociete() {
  const list = document.getElementById('societe-list');
  if (!list) return;
  list.innerHTML = societéArticles.map(a => `
    <div class="article-list-item">
      <div class="article-list-thumb"><span class="ph"><i class="fa-solid ${a.icon}"></i></span></div>
      <div class="article-list-content">
        <div class="article-list-cat">${a.category}</div>
        <h4 class="article-list-title">${a.title}</h4>
        <span class="article-list-date">${a.date}</span>
      </div>
    </div>
  `).join('');
}

function renderPopular() {
  const list = document.getElementById('popular-list');
  if (!list) return;
  list.innerHTML = popularArticles.map(title => `<li><a href="#">${title}</a></li>`).join('');
}

renderArticles();
renderSociete();
renderPopular();

// ---- NEWSLETTER ----
function subscribeNewsletter(e) {
  e.preventDefault();
  const form  = e.target;
  const input = form.querySelector('input[type="email"]');
  const msgEl = document.getElementById('newsletter-msg');
  if (!input?.value) return;
  if (msgEl) { msgEl.style.display = 'block'; msgEl.textContent = '✓ Merci ! Vous recevrez nos actualités par e-mail.'; msgEl.style.color = '#1a7c4f'; }
  input.value = '';
  const btn = form.querySelector('button');
  if (btn) btn.textContent = '✓ Inscrit !';
}

// ---- LIVE YOUTUBE ----
const API_KEY    = "AIzaSyAC3UxazZqeCVZ_ZvDb2Ft8Z27mLDelERk";
const CHANNEL_ID = "UCZjbs0MGrC3IeKfjuuO1BgA";

async function checkLive() {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    const container = document.getElementById("live-content");
    const titleEl   = document.getElementById("live-title");
    if (!container) return;
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      const title   = data.items[0].snippet.title;
      container.innerHTML = `<a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="live-link-btn"><i class="fa-brands fa-youtube"></i> Regarder le live en direct</a>`;
      if (titleEl) titleEl.textContent = title;
    } else {
      container.innerHTML = `<p style="text-align:center;padding:1.5rem;color:#aaa;"><i class="fa-solid fa-circle-xmark"></i><br>Aucun live en ce moment.<br>Revenez plus tard !</p>`;
      if (titleEl) titleEl.textContent = "Pas de live pour le moment";
    }
  } catch(e) {
    const c = document.getElementById("live-content");
    if (c) c.innerHTML = `<p style="text-align:center;color:#aaa;padding:1rem;">Impossible de vérifier le live.</p>`;
  }
}

checkLive();
setInterval(checkLive, 120000);

// ---- TOAST ----
let toastTimer = null;

function showToast(event, iconClass) {
  const toast = document.getElementById('toast-soon');
  if (!toast) return;
  const icon = toast.querySelector('.toast-soon-icon i');
  if (iconClass && icon) icon.className = iconClass;
  const x = event.clientX, y = event.clientY;
  const toastW = 260, margin = 12;
  const left = (x + toastW + margin > window.innerWidth) ? x - toastW - margin : x + margin;
  toast.style.left = left + 'px';
  toast.style.top  = (y + margin) + 'px';
  toast.style.bottom = 'auto';
  toast.style.transformOrigin = (left < x) ? 'top right' : 'top left';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 3000);
}

function hideToast() {
  const toast = document.getElementById('toast-soon');
  if (toast) toast.classList.remove('show');
}

// Bouton Radio
const btnRadio = document.querySelector('.btn-radio');
if (btnRadio) {
  btnRadio.addEventListener('click', function(e) {
    e.preventDefault();
    showToast(e, 'fa-solid fa-radio');
  });
}

// Liens footer "#"
document.querySelectorAll('.footer-col a[href="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    showToast(e, 'fa-solid fa-radio');
  });
});
