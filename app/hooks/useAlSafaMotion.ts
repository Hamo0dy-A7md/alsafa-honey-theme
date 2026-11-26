/**
 * Markaz Al Safa Honey — motion for the home blocks.
 * Every effect works on refs, cleans up after itself and respects reduced motion.
 */
import { useEffect, useState, type RefObject } from 'react';
import { ALSAFA_SHIFTS } from '../lib/alsafaText';

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const motionAllowed = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fast, random, wandering flight for every `.as-bee` inside the hero. */
export function useBeeFlight(heroRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !motionAllowed()) return;
    const bees = Array.from(hero.querySelectorAll<SVGSVGElement>('.as-bee'));
    if (!bees.length) return;

    let W = hero.clientWidth;
    let H = hero.clientHeight;
    const box = hero.getBoundingClientRect();
    type Bee = {
      el: SVGSVGElement; w: number; x: number; y: number; vx: number; vy: number;
      tx: number; ty: number; max: number; t: number; face: number; retarget: number; hidden: boolean;
    };
    const state: Bee[] = bees.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        el, w: r.width || 40, x: r.left - box.left, y: r.top - box.top, vx: 0, vy: 0,
        tx: 0, ty: 0, max: 200, t: rnd(0, 6), face: 1, retarget: 0,
        hidden: getComputedStyle(el).display === 'none',
      };
    });
    const newTarget = (b: Bee) => {
      const s = Math.random();
      b.tx = s < 0.4 ? rnd(0, W * 0.28) : s < 0.8 ? rnd(W * 0.7, W - b.w) : rnd(0, W - b.w);
      b.ty = rnd(H * 0.08, H * 0.85);
      b.max = rnd(170, 300);
      b.retarget = rnd(0.6, 1.8);
    };
    state.forEach(newTarget);
    hero.classList.add('as-bees-live');

    let raf = 0;
    let last = performance.now();
    let visible = true;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const b of state) {
        if (b.hidden) continue;
        b.t += dt;
        b.retarget -= dt;
        const dx = b.tx - b.x;
        const dy = b.ty - b.y;
        const dist = Math.hypot(dx, dy) || 1;
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
      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) {
        visible = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(hero);
    const onResize = () => {
      W = hero.clientWidth;
      H = hero.clientHeight;
      state.forEach((b) => { b.hidden = getComputedStyle(b.el).display === 'none'; });
    };
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      hero.classList.remove('as-bees-live');
      bees.forEach((el) => { el.style.transform = ''; });
    };
  }, [heroRef]);
}

function randomSpark(el: HTMLElement, first: boolean) {
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

/** Random wavy sparkles and a mouse-following 3D tilt for the product cards in `gridRef`. */
export function useProductCardMotion(gridRef: RefObject<HTMLElement | null>, count: number) {
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.querySelectorAll<HTMLElement>('.as-p-sparks i').forEach((i) => randomSpark(i, true));
    const onIteration = (e: AnimationEvent) => {
      const t = e.target as HTMLElement;
      if (t.matches('.as-p-sparks i')) randomSpark(t, false);
    };
    grid.addEventListener('animationiteration', onIteration);

    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && motionAllowed();
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.as-product');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
      card.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
    };
    const onOut = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.as-product');
      if (card && !card.contains(e.relatedTarget as Node | null)) {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      }
    };
    if (canTilt) {
      grid.addEventListener('pointermove', onMove);
      grid.addEventListener('pointerout', onOut);
    }
    return () => {
      grid.removeEventListener('animationiteration', onIteration);
      grid.removeEventListener('pointermove', onMove);
      grid.removeEventListener('pointerout', onOut);
    };
  }, [gridRef, count]);
}

/** Adds `is-in` to every `.as-reveal` inside `rootRef` as it scrolls into view. */
export function useReveal(rootRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('.as-reveal'));
    if (!motionAllowed() || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 60}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef, ...deps]);
}

/** Whether the shop is open right now (Saudi time). `null` until it runs in the browser. */
export function useOpenNow(): boolean | null {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => {
      try {
        const parts = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false,
        }).formatToParts(new Date());
        const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24;
        const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
        const mins = h * 60 + m;
        setOpen(ALSAFA_SHIFTS.some(([a, b]) => mins >= a && mins < b));
      } catch {
        setOpen(null);
      }
    };
    check();
    const id = window.setInterval(check, 60000);
    return () => window.clearInterval(id);
  }, []);
  return open;
}
