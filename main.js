// Mobile menu
const toggle = document.querySelector('.nav-toggle');
if (toggle) {
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
  };
  toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}

// Reveal on scroll
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

// Copy email
document.querySelectorAll('[data-copy]').forEach(btn => {
  const note = btn.parentElement.querySelector('.copied');
  let timer;
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); } catch { return; }
    note.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => note.classList.remove('show'), 1600);
  });
});

// Screen galleries
document.querySelectorAll('.gallery').forEach(gallery => {
  const track = gallery.querySelector('.gallery-track');
  const nav = gallery.querySelector('.gallery-nav');
  const prev = gallery.querySelector('[data-dir="-1"]');
  const next = gallery.querySelector('[data-dir="1"]');
  const step = () => {
    const items = track.children;
    return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth;
  };
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    nav.hidden = max <= 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  };
  [prev, next].forEach(btn => btn.addEventListener('click', () => {
    track.scrollBy({ left: step() * Number(btn.dataset.dir), behavior: 'smooth' });
  }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
});
