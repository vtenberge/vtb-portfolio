/* Soft cursor blob that trails the pointer + sparkle trail. */
(function () {
  if (typeof window === 'undefined') return;
  if (matchMedia('(hover: none)').matches) {
    document.body.classList.add('no-blob');
    return;
  }

  function mount() {
    if (document.body.classList.contains('no-blob')) return;
    if (document.querySelector('.cursor-blob')) return;

    const blob = document.createElement('div');
    blob.className = 'cursor-blob';
    document.body.appendChild(blob);

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let bx = mx, by = my;
    let dx = mx, dy = my;
    let lastSparkle = 0;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      const now = performance.now();
      if (now - lastSparkle > 60) {
        lastSparkle = now;
        spawnSparkle(mx, my);
      }
    }, { passive: true });

    function spawnSparkle(x, y) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      const jitterX = (Math.random() - 0.5) * 18;
      const jitterY = (Math.random() - 0.5) * 18;
      s.style.left = (x + jitterX) + 'px';
      s.style.top  = (y + jitterY) + 'px';
      s.style.setProperty('--sparkle-size', (3 + Math.random() * 4) + 'px');
      s.style.setProperty('--sparkle-rot', (Math.random() * 360) + 'deg');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }

    function tick() {
      bx += (mx - bx) * 0.12;
      by += (my - by) * 0.12;
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;
      blob.style.transform = `translate(${bx}px, ${by}px) translate(-50%, -50%)`;
      dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest('a, button, .hoverable')) {
        blob.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest('a, button, .hoverable')) {
        blob.classList.remove('hover');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  const obs = new MutationObserver(() => {
    if (!document.body.classList.contains('no-blob')) mount();
    else {
      document.querySelectorAll('.cursor-blob, .cursor-dot, .sparkle').forEach(n => n.remove());
    }
  });
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();

// ── Rotating status (e.g. "currently sipping coffee") ─────────────────────
(function () {
  const STATUSES = [
    "sipping coffee",
    "rethinking microservices",
    "drawing boxes on whiteboards",
    "writing the boring docs",
    "biking through the polder",
    "scribbling architecture",
    "saying no to one more meeting",
    "open to good ideas",
  ];

  function mount() {
    const el = document.querySelector('[data-rotating-status]');
    if (!el) return;
    let i = 0;
    function step() {
      el.style.opacity = 0;
      el.style.transform = 'translateY(4px)';
      setTimeout(() => {
        i = (i + 1) % STATUSES.length;
        el.textContent = STATUSES[i];
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, 280);
    }
    el.textContent = STATUSES[0];
    el.style.transition = 'opacity .3s ease, transform .3s ease';
    setInterval(step, 3200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else { mount(); }
})();

// ── Confetti on click of [data-confetti] ──────────────────────────────────
(function () {
  const COLORS = ['var(--accent)', 'var(--accent-2, var(--accent))', 'var(--ink)', '#ff7a59', '#5b9dff', '#c8e23a', '#e85aa6'];

  function burst(x, y, amount = 32) {
    for (let i = 0; i < amount; i++) {
      const p = document.createElement('div');
      p.className = 'confetto';
      const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.4;
      const speed = 80 + Math.random() * 200;
      const tx = Math.cos(angle) * speed;
      const ty = Math.sin(angle) * speed - 80;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.setProperty('--tx', tx + 'px');
      p.style.setProperty('--ty', ty + 'px');
      p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      p.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      p.style.width = (5 + Math.random() * 6) + 'px';
      p.style.height = (8 + Math.random() * 8) + 'px';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  function onClick(e) {
    const t = e.target.closest('[data-confetti]');
    if (!t) return;
    const r = t.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2);
  }

  document.addEventListener('click', onClick);
  // expose for the brand-mark double-click etc.
  window.__burst = burst;
})();

// ── Konami-ish: triple-click the brand mark = confetti everywhere ─────────
(function () {
  function mount() {
    const mark = document.querySelector('.brand-mark');
    if (!mark || !window.__burst) return;
    let clicks = 0;
    let timer;
    mark.addEventListener('click', (e) => {
      e.preventDefault();
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => clicks = 0, 600);
      if (clicks >= 3) {
        clicks = 0;
        const w = window.innerWidth, h = window.innerHeight;
        window.__burst(w / 2, h / 3, 80);
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else { mount(); }
})();
