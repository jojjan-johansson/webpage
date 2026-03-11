/* ─── Standardinnehåll ─── */
const DEFAULT_CONTENT = {
  index: {
    eyebrow:  'Portfolio',
    title:    'Välkommen',
    subtitle: 'En presentation av mina projekt och digitala arbeten.',
    content:  'Här hittar du information om de digitala produkter och system jag arbetat med.\n\nAnvänd navigeringen ovan för att utforska de olika projekten.',
    image:    null,
    video:    null
  },
  projekt: {
    eyebrow:  'Översikt',
    title:    'Projekt',
    subtitle: 'Utforska mina projekt och digitala produkter.',
    content:  'Nedan hittar du en sammanfattning av de projekt jag har arbetat med.\n\nKlicka på ett projekt för att läsa mer.',
    image:    null,
    video:    null
  },
  treserva: {
    eyebrow:  'Mobilapplikation',
    title:    'Treserva Mobil-app',
    subtitle: 'En mobilapp anpassad för Treserva-systemet.',
    content:  'Beskriv appen här — vad den gör, vilka funktioner den har och vilken nytta den ger användarna.\n\nLägg till mer information via admin-panelen.',
    image:    null,
    video:    null
  },
  matilda: {
    eyebrow:  'Projekt',
    title:    'Matilda',
    subtitle: 'Information om Matilda-projektet.',
    content:  'Beskriv Matilda-projektet här — syfte, funktionalitet och teknisk lösning.\n\nAnpassa texten via admin-panelen.',
    image:    null,
    video:    null
  },
  pix: {
    eyebrow:  'Projekt',
    title:    'PIX',
    subtitle: 'Information om PIX-projektet.',
    content:  'Beskriv PIX-projektet här — vad det är, hur det fungerar och vilket värde det skapar.\n\nAnpassa texten via admin-panelen.',
    image:    null,
    video:    null
  },
  webben: {
    eyebrow:  'Webb',
    title:    'Webben',
    subtitle: 'Information om webbutvecklingen.',
    content:  'Beskriv webbarbetet här — tekniker, design och de digitala lösningar som skapats.\n\nAnpassa texten via admin-panelen.',
    image:    null,
    video:    null
  }
};

/* ─── Hämta innehåll från localStorage ─── */
function getContent() {
  try {
    const stored = JSON.parse(localStorage.getItem('siteContent') || '{}');
    const merged = {};
    for (const key of Object.keys(DEFAULT_CONTENT)) {
      merged[key] = { ...DEFAULT_CONTENT[key], ...(stored[key] || {}) };
    }
    return merged;
  } catch {
    return { ...DEFAULT_CONTENT };
  }
}

/* ─── YouTube embed-URL ─── */
function youtubeEmbed(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?\s]+)/,
    /youtube\.com\/embed\/([^?\s]+)/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return null;
}

/* ─── Populera sidans element ─── */
function loadPage(pageKey) {
  const c = getContent()[pageKey];
  if (!c) return;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '';
  };

  set('page-eyebrow', c.eyebrow);
  set('page-title',   c.title);
  set('page-subtitle',c.subtitle);

  const body = document.getElementById('page-content');
  if (body) {
    const paras = (c.content || '').split('\n\n').filter(p => p.trim());
    body.innerHTML = paras
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('') || '<p></p>';
  }

  const imgWrap = document.getElementById('page-image-wrap');
  const imgCon  = document.getElementById('page-image-container');
  if (imgWrap && imgCon) {
    if (c.image) {
      imgCon.innerHTML = `<img src="${c.image}" alt="${c.title}">`;
      imgWrap.style.display = '';
    } else {
      imgWrap.style.display = 'none';
    }
  }

  const vidWrap = document.getElementById('page-video-wrap');
  const vidCon  = document.getElementById('page-video-container');
  if (vidWrap && vidCon) {
    const embed = youtubeEmbed(c.video);
    if (embed) {
      vidCon.innerHTML = `<iframe src="${embed}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      vidWrap.style.display = '';
    } else {
      vidWrap.style.display = 'none';
    }
  }
}

/* ─── Navigation: markera aktiv länk ─── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const match = href === page || (page === '' && href === 'index.html');
    a.classList.toggle('active', match);
  });
}

/* ─── Mobilmeny ─── */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
  document.addEventListener('click', e => {
    if (!e.target.closest('nav')) links.classList.remove('open');
  });
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileNav();
});
