/* ─── Admin JS ─── */

const PASS_KEY    = 'adminPassword';
const CONTENT_KEY = 'siteContent';
const DEFAULT_PASS = 'admin123';

/* Kopiera DEFAULT_CONTENT från main.js – inbakad här för oberoende */
const DEFAULT_CONTENT = {
  index:    { eyebrow:'Portfolio',        title:'Välkommen',          subtitle:'En presentation av mina projekt och digitala arbeten.',       content:'Här hittar du information om de digitala produkter och system jag arbetat med.\n\nAnvänd navigeringen ovan för att utforska de olika projekten.', image:null, video:null },
  projekt:  { eyebrow:'Översikt',         title:'Projekt',            subtitle:'Utforska mina projekt och digitala produkter.',                content:'Nedan hittar du en sammanfattning av de projekt jag har arbetat med.\n\nKlicka på ett projekt för att läsa mer.', image:null, video:null },
  treserva: { eyebrow:'Mobilapplikation', title:'Treserva Mobil-app', subtitle:'En mobilapp anpassad för Treserva-systemet.',                  content:'Beskriv appen här — vad den gör, vilka funktioner den har och vilken nytta den ger användarna.\n\nLägg till mer information via admin-panelen.', image:null, video:null },
  matilda:  { eyebrow:'Projekt',          title:'Matilda',            subtitle:'Information om Matilda-projektet.',                            content:'Beskriv Matilda-projektet här — syfte, funktionalitet och teknisk lösning.\n\nAnpassa texten via admin-panelen.', image:null, video:null },
  pix:      { eyebrow:'Projekt',          title:'PIX',                subtitle:'Information om PIX-projektet.',                               content:'Beskriv PIX-projektet här — vad det är, hur det fungerar och vilket värde det skapar.\n\nAnpassa texten via admin-panelen.', image:null, video:null },
  webben:   { eyebrow:'Webb',             title:'Webben',             subtitle:'Information om webbutvecklingen.',                            content:'Beskriv webbarbetet här — tekniker, design och de digitala lösningar som skapats.\n\nAnpassa texten via admin-panelen.', image:null, video:null }
};

const PAGE_META = {
  index:    { label:'Startsida',        icon:'🏠' },
  projekt:  { label:'Projekt',          icon:'📁' },
  treserva: { label:'Treserva Mobil-app', icon:'📱' },
  matilda:  { label:'Matilda',          icon:'✨' },
  pix:      { label:'PIX',              icon:'🎨' },
  webben:   { label:'Webben',           icon:'🌐' }
};

/* ─── Hjälpfunktioner ─── */
const getPass    = ()  => localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
const isLoggedIn = ()  => sessionStorage.getItem('adminOK') === '1';

function getContent() {
  try {
    const raw = JSON.parse(localStorage.getItem(CONTENT_KEY) || '{}');
    const out = {};
    for (const k of Object.keys(DEFAULT_CONTENT)) {
      out[k] = { ...DEFAULT_CONTENT[k], ...(raw[k] || {}) };
    }
    return out;
  } catch { return structuredClone(DEFAULT_CONTENT); }
}

function saveContent(obj) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(obj));
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

/* ─── Toast ─── */
function toast(msg, ms = 2600) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast'; el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), ms);
}

/* ─── Bygger admin-UI ─── */
function buildUI() {
  const content = getContent();
  const pageKeys = Object.keys(PAGE_META);

  /* Tabs */
  const tabsEl = document.getElementById('admin-tabs');
  tabsEl.innerHTML = pageKeys.map((k, i) =>
    `<button class="tab${i === 0 ? ' active' : ''}" data-tab="${k}">${PAGE_META[k].icon} ${PAGE_META[k].label}</button>`
  ).join('') + `<button class="tab" data-tab="settings">⚙️ Inställningar</button>`;

  /* Panels */
  const panelsEl = document.getElementById('admin-panels');
  panelsEl.innerHTML = pageKeys.map((k, i) => `
    <div class="tab-panel acard${i === 0 ? ' active' : ''}" id="panel-${k}">
      <div class="acard-title">${PAGE_META[k].icon} ${PAGE_META[k].label}</div>
      <div class="acard-subtitle">Redigera sidans innehåll</div>

      <div class="form-group">
        <label class="form-label">Etikett (liten text ovanför titeln)</label>
        <input type="text" class="form-input" id="${k}-eyebrow" value="${escHtml(content[k].eyebrow)}">
      </div>
      <div class="form-group">
        <label class="form-label">Huvudtitel</label>
        <input type="text" class="form-input" id="${k}-title" value="${escHtml(content[k].title)}">
      </div>
      <div class="form-group">
        <label class="form-label">Undertitel</label>
        <input type="text" class="form-input" id="${k}-subtitle" value="${escHtml(content[k].subtitle)}">
      </div>
      <div class="form-group">
        <label class="form-label">Brödtext (dubbelt radbryt = nytt stycke)</label>
        <textarea class="form-textarea" id="${k}-content">${escHtml(content[k].content)}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Bild</label>
        <div class="upload-area" id="${k}-upload-area">
          <input type="file" accept="image/*" onchange="handleImage('${k}', this)">
          <div class="upload-icon">🖼️</div>
          <div class="upload-text">Klicka för att ladda upp bild<br><small>JPG, PNG, GIF, WebP — max 3 MB</small></div>
        </div>
        <div class="image-preview" id="${k}-img-preview" style="display:${content[k].image ? '' : 'none'}">
          ${content[k].image ? `<img src="${content[k].image}" alt="Förhandsvisning">` : ''}
        </div>
        ${content[k].image ? `<button class="btn btn-danger" style="margin-top:0.5rem; font-size:0.78rem; padding:0.35rem 0.75rem;" onclick="removeImage('${k}')">Ta bort bild</button>` : ''}
      </div>

      <div class="form-group">
        <label class="form-label">Video (YouTube-länk)</label>
        <input type="text" class="form-input" id="${k}-video"
          placeholder="https://www.youtube.com/watch?v=..."
          value="${escHtml(content[k].video || '')}">
      </div>

      <div class="save-row">
        <button class="btn btn-primary" onclick="savePage('${k}')">Spara ändringar</button>
      </div>
    </div>
  `).join('') + `
    <div class="tab-panel acard" id="panel-settings">
      <div class="acard-title">⚙️ Inställningar</div>
      <div class="acard-subtitle">Byt adminlösenord</div>

      <div class="form-group">
        <label class="form-label">Nuvarande lösenord</label>
        <input type="password" class="form-input" id="cur-pass" autocomplete="current-password">
      </div>
      <div class="form-group">
        <label class="form-label">Nytt lösenord</label>
        <input type="password" class="form-input" id="new-pass" autocomplete="new-password">
      </div>
      <div class="form-group">
        <label class="form-label">Bekräfta nytt lösenord</label>
        <input type="password" class="form-input" id="conf-pass" autocomplete="new-password">
      </div>
      <div class="save-row">
        <button class="btn btn-secondary" onclick="logout()">Logga ut</button>
        <button class="btn btn-primary" onclick="changePass()">Byt lösenord</button>
      </div>

      <div class="divider"></div>

      <div class="acard-title">Återställ innehåll</div>
      <div class="acard-subtitle" style="margin-bottom:1rem">
        Tar bort allt anpassat innehåll och återgår till standardtexterna.
      </div>
      <button class="btn btn-danger" onclick="resetAll()">Återställ allt till standard</button>
    </div>
  `;

  /* Tab-klick */
  document.querySelectorAll('.tab[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`panel-${btn.dataset.tab}`)?.classList.add('active');
    });
  });
}

/* ─── Bildhantering ─── */
function handleImage(k, input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) { toast('Bilden är för stor. Max 3 MB.'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const b64 = e.target.result;
    document.getElementById(`${k}-upload-area`).dataset.img = b64;
    const prev = document.getElementById(`${k}-img-preview`);
    prev.innerHTML = `<img src="${b64}" alt="Förhandsvisning">`;
    prev.style.display = '';
    toast('Bild vald — kom ihåg att spara.');
  };
  reader.readAsDataURL(file);
}

function removeImage(k) {
  if (!confirm('Ta bort bilden?')) return;
  const c = getContent();
  c[k].image = null;
  saveContent(c);
  buildUI();
  toast('Bild borttagen.');
}

/* ─── Spara sida ─── */
function savePage(k) {
  const c = getContent();
  c[k].eyebrow  = document.getElementById(`${k}-eyebrow`).value.trim();
  c[k].title    = document.getElementById(`${k}-title`).value.trim();
  c[k].subtitle = document.getElementById(`${k}-subtitle`).value.trim();
  c[k].content  = document.getElementById(`${k}-content`).value.trim();
  c[k].video    = document.getElementById(`${k}-video`).value.trim();

  const imgData = document.getElementById(`${k}-upload-area`)?.dataset?.img;
  if (imgData) c[k].image = imgData;

  saveContent(c);
  toast('Ändringar sparade!');
}

/* ─── Byt lösenord ─── */
function changePass() {
  const cur  = document.getElementById('cur-pass').value;
  const nw   = document.getElementById('new-pass').value;
  const conf = document.getElementById('conf-pass').value;
  if (cur !== getPass())          { toast('Fel nuvarande lösenord.'); return; }
  if (nw.length < 4)              { toast('Lösenordet måste vara minst 4 tecken.'); return; }
  if (nw !== conf)                { toast('Lösenorden matchar inte.'); return; }
  localStorage.setItem(PASS_KEY, nw);
  ['cur-pass','new-pass','conf-pass'].forEach(id => document.getElementById(id).value = '');
  toast('Lösenord bytt!');
}

/* ─── Återställ ─── */
function resetAll() {
  if (!confirm('Är du säker? Allt anpassat innehåll och alla bilder tas bort.')) return;
  localStorage.removeItem(CONTENT_KEY);
  buildUI();
  toast('Innehåll återställt till standard.');
}

/* ─── Logga ut ─── */
function logout() {
  sessionStorage.removeItem('adminOK');
  window.location.reload();
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  const loginWrap  = document.getElementById('login-wrap');
  const adminWrap  = document.getElementById('admin-wrap');

  if (isLoggedIn()) {
    loginWrap.style.display = 'none';
    adminWrap.style.display = '';
    buildUI();
  } else {
    loginWrap.style.display = '';
    adminWrap.style.display = 'none';
  }

  document.getElementById('login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const pw = document.getElementById('login-password').value;
    if (pw === getPass()) {
      sessionStorage.setItem('adminOK', '1');
      loginWrap.style.display = 'none';
      adminWrap.style.display = '';
      buildUI();
    } else {
      document.getElementById('login-error').textContent = 'Fel lösenord. Försök igen.';
    }
  });
});
