/* =====================================================
   GAYA INFO — Pont CMS ↔ Site  (gaya-cms-bridge.js)
   À inclure sur TOUTES les pages du site + le CMS
   ===================================================== */

const GAYA_KEY = 'gaya_articles';

/* ── Lire tous les articles ───────────────────────── */
function gayaGetAll() {
  try { return JSON.parse(localStorage.getItem(GAYA_KEY) || '[]'); }
  catch(e) { return []; }
}

/* ── Lire uniquement les publiés ──────────────────── */
function gayaGetPublished() {
  return gayaGetAll().filter(a => a.status === 'published');
}

/* ── Lire les publiés d'une catégorie ─────────────── */
function gayaGetByCategory(cat) {
  return gayaGetPublished().filter(a =>
    a.category && a.category.toLowerCase() === cat.toLowerCase()
  );
}

/* ── Sauvegarder la liste complète ───────────────── */
function gayaSaveAll(list) {
  localStorage.setItem(GAYA_KEY, JSON.stringify(list));
}

/* ── Mapper les rubriques CMS → clés internes site ─ */
const GAYA_CAT_MAP = {
  'Actualités':   'actualite',
  'Société':      'societe',
  'Économie':     'economie',
  'Religion':     'religion',
  'Sport':        'sport',
  'Faits divers': 'faitsdivers',
  'Multimédia':   'multimedia',
  'Politique':    'politique',
  'Santé':        'sante',
  'Éducation':    'education',
};

/* ── Icône FA selon rubrique ─────────────────────── */
const GAYA_ICONS = {
  'Actualités':   'fa-newspaper',
  'Société':      'fa-users',
  'Économie':     'fa-chart-line',
  'Religion':     'fa-mosque',
  'Sport':        'fa-futbol',
  'Faits divers': 'fa-triangle-exclamation',
  'Multimédia':   'fa-photo-film',
  'Politique':    'fa-landmark',
  'Santé':        'fa-heart-pulse',
  'Éducation':    'fa-graduation-cap',
};

/* ── Emoji selon rubrique ────────────────────────── */
const GAYA_EMOJIS = {
  'Actualités':   '📰',
  'Société':      '👥',
  'Économie':     '📈',
  'Religion':     '🕌',
  'Sport':        '⚽',
  'Faits divers': '🚨',
  'Multimédia':   '🎬',
  'Politique':    '🏛️',
  'Santé':        '🏥',
  'Éducation':    '🎓',
};

/* ── Construire la card HTML pour les pages catégorie */
function gayaBuildEpisodeCard(a) {
  const icon = GAYA_ICONS[a.category] || 'fa-newspaper';
  return `
    <div class="episode-card cms-article">
      <div class="episode-thumb">
        <span class="ep-icon"><i class="fa-solid ${icon}"></i></span>
        ${a.breaking ? '<span class="ep-num-badge" style="background:#c8102e;">🔴 BREAKING</span>' : ''}
      </div>
      <div class="episode-info">
        <h3 class="episode-title">${a.title}</h3>
        <p class="episode-excerpt" style="font-size:13px;color:#666;margin:4px 0 8px;">${a.excerpt || ''}</p>
        <div class="episode-meta">
          <span><i class="fa-regular fa-calendar"></i> ${a.date}</span>
          <span><i class="fa-regular fa-user"></i> ${a.author || 'Rédaction'}</span>
        </div>
      </div>
    </div>`;
}

/* ── Injecter les articles CMS dans une page catégorie */
function gayaInjectInPage(categoryLabel) {
  const articles = gayaGetByCategory(categoryLabel);
  if (!articles.length) return;

  const grid = document.getElementById('episodes-grid');
  const list = document.getElementById('episodes-list');

  if (grid) {
    const cmsBlock = document.createElement('div');
    cmsBlock.innerHTML = `
      <div class="section-title-bar" style="margin-bottom:12px;">
        <h2><i class="fa-solid fa-rss" style="color:#c8102e;"></i> Dernières publications</h2>
      </div>
      <div style="display:grid;gap:16px;">
        ${articles.slice(0, 4).map(gayaBuildEpisodeCard).join('')}
      </div>`;
    grid.parentNode.insertBefore(cmsBlock, grid);
  }
}

/* ── Injecter sur la page Actualités (actualites.html) */
function gayaInjectActualites() {
  const published = gayaGetPublished();
  if (!published.length) return;

  // Convertir au format attendu par allArticles
  const converted = published.map(a => ({
    cat: GAYA_CAT_MAP[a.category] || 'actualite',
    label: a.category,
    title: a.title,
    excerpt: a.excerpt || '',
    date: a.date,
    author: a.author || 'Rédaction',
    breaking: a.breaking || false,
  }));

  // Insérer en tête de allArticles si elle existe
  if (typeof allArticles !== 'undefined') {
    converted.forEach(a => allArticles.unshift(a));
    if (typeof renderArticles === 'function') renderArticles();
    if (typeof renderTrending === 'function') renderTrending();
  }
}
