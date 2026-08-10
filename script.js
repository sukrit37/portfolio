/* =============================================================
   SUKRIT SHARMA — CYBER PORTFOLIO
   JavaScript: Cyber Rain · Scroll Animations · Tab Switching
   · Typewriter Effect · Nav Behavior
   ============================================================= */

/* ── 1. CYBER RAIN (Matrix) ─────────────────────────────────── */
(function initCyberRain() {
  const canvas = document.getElementById('cyber-rain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, cols, drops;

  // Characters to rain — mix of katakana, latin, digits, symbols
  const chars =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>{}[]~;:?!/\\|';

  const FONT_SIZE = 14;
  const COLOR_HEAD = '#ffffff';   // brightest — leading character
  const COLOR_TRAIL_1 = '#00ff41';
  const COLOR_TRAIL_2 = '#00cc33';
  const COLOR_FADE = '#004d14';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cols  = Math.floor(W / FONT_SIZE);
    drops = Array.from({ length: cols }, () => Math.random() * -100);
  }

  window.addEventListener('resize', resize);
  resize();

  function rain() {
    // Fade background (creates trail)
    ctx.fillStyle = 'rgba(5, 5, 9, 0.055)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const y = drops[i] * FONT_SIZE;
      const char = chars[Math.floor(Math.random() * chars.length)];

      // Head character (bright white)
      ctx.fillStyle = COLOR_HEAD;
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = 8;
      ctx.fillText(char, i * FONT_SIZE, y);

      // Second character (bright green)
      const prevChar = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = COLOR_TRAIL_1;
      ctx.shadowBlur = 4;
      ctx.fillText(prevChar, i * FONT_SIZE, y - FONT_SIZE);

      // Fade deeper
      ctx.fillStyle = COLOR_TRAIL_2;
      ctx.shadowBlur = 0;
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * FONT_SIZE, y - FONT_SIZE * 2);

      ctx.fillStyle = COLOR_FADE;
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * FONT_SIZE, y - FONT_SIZE * 3);

      // Reset drop or advance
      if (y > H && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5 + Math.random() * 0.5; // slight speed variation
    }

    ctx.shadowBlur = 0;
  }

  let animId;
  function loop() {
    rain();
    animId = requestAnimationFrame(loop);
  }
  loop();

  // Pause when tab not visible (perf)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
})();


/* ── 2. SCROLL REVEAL ────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger siblings
          const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
          siblings.forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.07}s`;
          });
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach(el => io.observe(el));
})();


/* ── 3. NAVIGATION ───────────────────────────────────────────── */
(function initNav() {
  const nav      = document.getElementById('nav');
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const links    = document.querySelectorAll('.nav-link');

  // Hamburger toggle
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();


/* ── 4. EXPERIENCE TABS ──────────────────────────────────────── */
(function initTabs() {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b   => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(`tab-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
})();


/* ── 5. TYPEWRITER EFFECT ────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter-cmd');
  if (!el) return;

  const commands = [
    'whoami',
    'cat skills.txt',
    'git log --oneline',
    'python train_model.py',
    'docker ps',
    'ssh sukrit@nexus.io',
    'curl -X GET /api/projects',
    'sudo make_impact',
  ];

  let cmdIdx  = 0;
  let charIdx = 0;
  let deleting = false;
  let paused   = false;

  el.textContent = '';

  function type() {
    const current = commands[cmdIdx];

    if (paused) {
      paused = false;
      setTimeout(type, 1800);
      return;
    }

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        paused   = true;
        setTimeout(type, 20);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        cmdIdx   = (cmdIdx + 1) % commands.length;
      }
    }

    setTimeout(type, deleting ? 40 : 90);
  }

  // Start after hero animations settle
  setTimeout(type, 2500);
})();


/* ── 6. CONTACT FORM ─────────────────────────────────────────── */
function handleFormSubmit(event) {
  event.preventDefault();
  const btn    = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');
  const form   = document.getElementById('contact-form');

  btn.disabled    = true;
  btn.textContent = '⟳ SENDING...';

  // Simulate sending (replace with actual backend/mailto)
  setTimeout(() => {
    status.style.display = 'block';
    status.textContent   = '✓ Message sent! I\'ll get back to you soon.';
    btn.textContent      = '✓ SENT';
    btn.style.background = '#004d14';

    // Reset after 4s
    setTimeout(() => {
      form.reset();
      status.style.display = 'none';
      btn.textContent      = '⟶ SEND MESSAGE';
      btn.style.background = '';
      btn.disabled         = false;
    }, 4000);
  }, 1200);
}


/* ── 7. CURSOR TRAIL EFFECT ──────────────────────────────────── */
(function initCursorTrail() {
  const trail = [];
  const MAX   = 10;

  for (let i = 0; i < MAX; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      pointer-events: none;
      border-radius: 50%;
      z-index: 99998;
      transition: opacity 0.3s ease;
      background: rgba(0, 255, 65, ${0.6 - i * 0.05});
      width: ${6 - i * 0.4}px;
      height: ${6 - i * 0.4}px;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateTrail() {
    let prevX = mouseX, prevY = mouseY;
    trail.forEach((dot, i) => {
      const speed = 0.25 - i * 0.015;
      dot.x += (prevX - dot.x) * speed;
      dot.y += (prevY - dot.y) * speed;
      dot.el.style.left = `${dot.x - 3}px`;
      dot.el.style.top  = `${dot.y - 3}px`;
      prevX = dot.x;
      prevY = dot.y;
    });
    requestAnimationFrame(animateTrail);
  }

  animateTrail();
})();


/* ── 8. GLITCH EFFECT on hero name (subtle) ──────────────────── */
(function initGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  setInterval(() => {
    if (Math.random() < 0.08) { // 8% chance every interval
      name.style.animation = 'glitch 0.15s steps(1) 1';
      setTimeout(() => { name.style.animation = ''; }, 200);
    }
  }, 3000);
})();
