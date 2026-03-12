const NAV = `<nav>
  <div class="nav-inner">
    <a href="index.html" class="logo">jojjan<span>.</span>johansson</a>
    <ul class="nav-links">
      <li><a href="index.html">Start</a></li>
      <li><a href="projekt.html">Projekt</a></li>
      <li><a href="treserva.html">Treserva</a></li>
      <li><a href="matilda.html">Matilda</a></li>
      <li><a href="pix.html">PIX</a></li>
      <li><a href="webben.html">Webben</a></li>
    </ul>
    <button class="nav-toggle" aria-label="Meny">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="2" y1="5"  x2="18" y2="5"/>
        <line x1="2" y1="10" x2="18" y2="10"/>
        <line x1="2" y1="15" x2="18" y2="15"/>
      </svg>
    </button>
  </div>
</nav>`;

const FOOTER = `<footer><p>© 2025 Jojjan Johansson</p></footer>`;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nav').innerHTML    = NAV;
  document.getElementById('footer').innerHTML = FOOTER;

  // Markera aktiv länk
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop() || 'index.html';
    a.classList.toggle('active', href === page);
  });

  // Mobilmeny
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  document.addEventListener('click', e => { if (!e.target.closest('nav')) links.classList.remove('open'); });
});
