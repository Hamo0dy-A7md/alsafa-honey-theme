/* =========================================================
   Markaz Al Safa Honey — home page motion
   Bees, product-card sparkles & tilt, scroll reveal, open/closed status.
   ========================================================= */
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd = (a, b) => a + Math.random() * (b - a);

/* Fast, random, wandering bee flight inside each hero */
function beeFlight(hero) {
  const bees = [...hero.querySelectorAll('.as-bee')];
  if (!bees.length || reduceMotion()) return;
  let W = 0, H = 0;
  const measure = () => { W = hero.clientWidth; H = hero.clientHeight; };
  const box = hero.getBoundingClientRect();
  const state = bees.map((el) => {
    const r = el.getBoundingClientRect();
    return { el, w: r.width || 40, x: r.left - box.left, y: r.top - box.top, vx: rnd(-1, 1), vy: rnd(-1, 1),
             max: 200, t: rnd(0, 6), face: 1, hidden: getComputedStyle(el).display === 'none' };
  });
  hero.classList.add('as-bees-live');
  measure();
  const newTarget = (b) => {
    const s = Math.random();
    b.tx = s < 0.4 ? rnd(0, W * 0.28) : s < 0.8 ? rnd(W * 0.7, W - b.w) : rnd(0, W - b.w);
    b.ty = rnd(H * 0.08, H * 0.85);
    b.max = rnd(170, 300);
    b.retarget = rnd(0.6, 1.8);
  };
  state.forEach(newTarget);
  let last = performance.now(), running = true;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    for (const b of state) {
      if (b.hidden) continue;
      b.t += dt; b.retarget -= dt;
      const dx = b.tx - b.x, dy = b.ty - b.y, dist = Math.hypot(dx, dy) || 1;
      if (dist < 30 || b.retarget <= 0) newTarget(b);
      b.vx += (dx / dist) * 520 * dt + Math.sin(b.t * 9) * 260 * dt;
      b.vy += (dy / dist) * 520 * dt + Math.cos(b.t * 7.3) * 260 * dt;
      const sp = Math.hypot(b.vx, b.vy);
      if (sp > b.max) { b.vx *= b.max / sp; b.vy *= b.max / sp; }
      b.x = Math.max(0, Math.min(W - b.w, b.x + b.vx * dt));
      b.y = Math.max(0, Math.min(H - b.w, b.y + b.vy * dt));
      if (Math.abs(b.vx) > 25) b.face = b.vx > 0 ? 1 : -1;
      const tilt = Math.max(-25, Math.min(25, (b.vy / b.max) * 25)) * b.face;
      b.el.style.transform = `translate(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px) scaleX(${b.face}) rotate(${tilt.toFixed(1)}deg)`;
    }
    if (running) requestAnimationFrame(frame);
  };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    else if (!e.isIntersecting) running = false;
  }).observe(hero);
  window.addEventListener('resize', () => {
    measure();
    state.forEach((b) => { b.hidden = getComputedStyle(b.el).display === 'none'; });
  });
  requestAnimationFrame(frame);
}

/* Sparkles: random start, size, speed and wavy path; new path every loop */
function randomSpark(el, first) {
  const s = el.style;
  s.setProperty('--l', `${rnd(12, 88)}%`);
  s.setProperty('--b', `${rnd(4, 40)}%`);
  s.setProperty('--s', `${rnd(3, 7).toFixed(1)}px`);
  s.setProperty('--d', `${rnd(1.8, 3.4).toFixed(2)}s`);
  if (first) s.setProperty('--dl', `${rnd(0, 1.8).toFixed(2)}s`);
  s.setProperty('--h', `${rnd(80, 170)}px`);
  s.setProperty('--x1', `${rnd(-28, 28)}px`);
  s.setProperty('--x2', `${rnd(-40, 40)}px`);
  s.setProperty('--x3', `${rnd(-55, 55)}px`);
}

function productCards() {
  document.querySelectorAll('.as-p-sparks i').forEach((i) => randomSpark(i, true));
  document.addEventListener('animationiteration', (e) => {
    if (e.target.matches && e.target.matches('.as-p-sparks i')) randomSpark(e.target);
  });
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reduceMotion()) return;
  document.querySelectorAll('.as-product-grid').forEach((grid) => {
    grid.addEventListener('pointermove', (e) => {
      const card = e.target.closest('.as-product');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
      card.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
    });
    grid.addEventListener('pointerout', (e) => {
      const card = e.target.closest('.as-product');
      if (card && !card.contains(e.relatedTarget)) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
    });
  });
}

/* Fade sections in as they scroll into view */
function reveal() {
  const els = document.querySelectorAll('.as-reveal');
  if (reduceMotion() || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 60}ms`; io.observe(el); });
}

/* Open / closed now (Saudi time): 8:30–14:00 and 16:30–22:30 */
const SHIFTS = [[8 * 60 + 30, 14 * 60], [16 * 60 + 30, 22 * 60 + 30]];
function openStatus() {
  document.querySelectorAll('[data-as-open-status]').forEach((el) => {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      const mins = (+parts.find((p) => p.type === 'hour').value % 24) * 60 + +parts.find((p) => p.type === 'minute').value;
      const open = SHIFTS.some(([a, b]) => mins >= a && mins < b);
      el.className = 'as-open-status ' + (open ? 'is-open' : 'is-closed');
      el.textContent = open ? el.dataset.open : el.dataset.closed;
    } catch (_) { el.textContent = ''; }
  });
}

export default function initAlSafa() {
  document.querySelectorAll('.as-hero').forEach(beeFlight);
  productCards();
  reveal();
  openStatus();
  setInterval(openStatus, 60000);
}
