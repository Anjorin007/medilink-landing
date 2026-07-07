/* ============================================================
   MEDILINK LANDING PAGE — SCRIPTS
   ============================================================ */

/* ---- NAV SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- HAMBURGER ---- */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => navMobile.classList.toggle('open'));
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

/* ---- REVEAL ON SCROLL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.querySelectorAll('.reveal')]
        : [];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- COUNTER ANIMATION ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / 1800, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

/* ---- AURORA BLOBS ---- */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let animId, W, H;

const blobs = [
  { x: 0.15, y: 0.3,  r: 0.55, color: '23,165,137',  speed: 0.00018, phase: 0.0  },
  { x: 0.75, y: 0.65, r: 0.50, color: '26,82,118',   speed: 0.00013, phase: 2.1  },
  { x: 0.50, y: 0.85, r: 0.45, color: '23,165,137',  speed: 0.00021, phase: 4.3  },
  { x: 0.85, y: 0.20, r: 0.40, color: '13,33,55',    speed: 0.00016, phase: 1.5  },
];

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

function drawAurora(ts) {
  ctx.clearRect(0, 0, W, H);

  blobs.forEach(b => {
    const ox = Math.sin(ts * b.speed * 1.0 + b.phase) * 0.12;
    const oy = Math.cos(ts * b.speed * 0.7 + b.phase) * 0.10;
    const cx = (b.x + ox) * W;
    const cy = (b.y + oy) * H;
    const radius = b.r * Math.max(W, H);

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0,   `rgba(${b.color}, 0.18)`);
    grad.addColorStop(0.4, `rgba(${b.color}, 0.08)`);
    grad.addColorStop(1,   `rgba(${b.color}, 0)`);

    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, radius * 0.65, ts * 0.00004 + b.phase, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  });
}

function animate(ts) {
  drawAurora(ts);
  animId = requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  cancelAnimationFrame(animId);
  resize();
  animId = requestAnimationFrame(animate);
}, { passive: true });

resize();
animId = requestAnimationFrame(animate);

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours...';
  setTimeout(() => {
    formSuccess.classList.add('show');
    contactForm.reset();
    btn.disabled = false;
    btn.innerHTML = 'Envoyer le message <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1200);
});

/* ---- PHONE CAROUSEL DOTS ---- */
(function() {
  const showcase = document.querySelector('.phones-showcase');
  const dots     = document.querySelectorAll('.carousel-dot');
  if (!showcase || !dots.length) return;

  function updateDots() {
    const slides = showcase.querySelectorAll('.phone-wrap');
    let closest = 0, minDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetLeft - showcase.scrollLeft - showcase.offsetWidth / 2 + slide.offsetWidth / 2);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === closest));
  }

  showcase.addEventListener('scroll', updateDots, { passive: true });
  updateDots();

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx    = parseInt(dot.dataset.index);
      const slides = showcase.querySelectorAll('.phone-wrap');
      if (slides[idx]) {
        showcase.scrollTo({ left: slides[idx].offsetLeft, behavior: 'smooth' });
      }
    });
  });
})();

/* ---- ACTIVE NAV LINK ---- */
const sections     = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-links a');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinksList.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.style.color      = active ? '#0D2137' : '';
        link.style.fontWeight = active ? '700'     : '';
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });
sections.forEach(s => activeObserver.observe(s));
