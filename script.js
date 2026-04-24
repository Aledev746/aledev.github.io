/* ================================================
   PORTFOLIO — CYBERPUNK TERMINAL + WebGL ENGINE
   ================================================ */
(function () {
  'use strict';

  // ================================================
  // TERMINAL BOOT SEQUENCE
  // ================================================
  const overlay = document.getElementById('terminal-overlay');
  const termLog = document.getElementById('terminal-log');
  const termBody = document.getElementById('terminal-body');
  const cursorLine = document.getElementById('terminal-cursor-line');
  const mainContent = document.getElementById('main-content');

  const bootScript = [
    { type: 'sep', text: '══════════════════════════════════════════════════════', delay: 0 },
    { type: 'white', text: '  ALEDEV PORTFOLIO OS  v2.6.1 — Kernel 6.1.0-cybersec', delay: 80 },
    { type: 'sep', text: '══════════════════════════════════════════════════════', delay: 80 },
    { type: 'dim', text: '', delay: 60 },
    { type: 'info', text: '[BOOT] Initializing system firmware...', delay: 120 },
    { type: 'ok', text: '[  OK  ] Loaded /boot/aledev-kernel.conf', delay: 200 },
    { type: 'ok', text: '[  OK  ] Initialized memory subsystem  [16384 MB]', delay: 180 },
    { type: 'ok', text: '[  OK  ] CPU cores detected              [8 cores @ 3.8GHz]', delay: 160 },
    { type: 'dim', text: '', delay: 60 },
    { type: 'info', text: '[BOOT] Loading hardware drivers...', delay: 100 },
    { type: 'ok', text: '[  OK  ] GPU driver loaded               [WebGL 2.0]', delay: 220 },
    { type: 'ok', text: '[  OK  ] Network interface up            [eth0 :: 127.0.0.1]', delay: 190 },
    { type: 'ok', text: '[  OK  ] Input devices registered        [kbd/mouse]', delay: 150 },
    { type: 'dim', text: '', delay: 60 },
    { type: 'info', text: '[BOOT] Mounting filesystems...', delay: 100 },
    { type: 'ok', text: '[  OK  ] /dev/portfolio    mounted  [ext4]', delay: 200 },
    { type: 'ok', text: '[  OK  ] /dev/skills       mounted  [r+w]', delay: 160 },
    { type: 'ok', text: '[  OK  ] /dev/projects     mounted  [r+w]', delay: 170 },
    { type: 'dim', text: '', delay: 60 },
    { type: 'info', text: '[BOOT] Starting system services...', delay: 100 },
    { type: 'ok', text: '[  OK  ] Started aledev-nginx.service', delay: 230 },
    { type: 'ok', text: '[  OK  ] Started brain-process.service', delay: 210 },
    { type: 'ok', text: '[  OK  ] Started creativity-daemon.service', delay: 200 },
    { type: 'ok', text: '[  OK  ] Started coffee-maker.service', delay: 190 },
    { type: 'dim', text: '', delay: 60 },
    { type: 'info', text: '[BOOT] Running diagnostics...', delay: 100 },
    { type: 'progress', label: 'Scanning components', delay: 100, duration: 600 },
    { type: 'ok', text: '[  OK  ] All diagnostics passed', delay: 150 },
    { type: 'dim', text: '', delay: 60 },
    { type: 'ok', text: '[  OK  ] Cybersecurity modules loaded', delay: 180 },
    { type: 'ok', text: '[  OK  ] Portfolio interface ready', delay: 200 },
    { type: 'dim', text: '', delay: 60 },
    { type: 'white', text: '  System ready. Welcome, operator.', delay: 300 },
    { type: 'sep', text: '══════════════════════════════════════════════════════', delay: 80 },
    { type: 'dim', text: '', delay: 200 },
    { type: 'launch', delay: 400 },
  ];

  function appendLine(type, text) {
    const div = document.createElement('div');
    div.className = 'terminal-log-line';

    if (type === 'sep') { div.innerHTML = `<span class="t-sep">${text}</span>`; }
    else if (type === 'ok') { div.innerHTML = `<span class="t-ok">${text}</span>`; }
    else if (type === 'info') { div.innerHTML = `<span class="t-info">${text}</span>`; }
    else if (type === 'warn') { div.innerHTML = `<span class="t-warn">${text}</span>`; }
    else if (type === 'white') { div.innerHTML = `<span class="t-white">${text}</span>`; }
    else if (type === 'dim') { div.innerHTML = `&nbsp;`; }
    else { div.innerHTML = text; }

    cursorLine.before(div);
    requestAnimationFrame(() => div.classList.add('show'));
    termBody.scrollTop = termBody.scrollHeight;
    return div;
  }

  function runProgressBar(label, duration) {
    return new Promise(resolve => {
      const wrapper = document.createElement('div');
      wrapper.className = 'terminal-log-line show';
      wrapper.innerHTML = `<span class="t-info">${label}  </span>`;
      const track = document.createElement('div');
      track.className = 'terminal-progress-track';
      const bar = document.createElement('div');
      bar.className = 'terminal-progress-bar';
      track.appendChild(bar);
      wrapper.appendChild(track);
      cursorLine.before(wrapper);
      termBody.scrollTop = termBody.scrollHeight;

      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const pct = Math.min(((ts - start) / duration) * 100, 100);
        bar.style.width = pct + '%';
        if (pct < 100) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  function createLaunchBtn() {
    const btn = document.createElement('button');
    btn.id = 'terminal-launch-btn';
    btn.className = 'terminal-launch-btn';
    btn.innerHTML = '<span>▶</span> ENTER PORTFOLIO';
    cursorLine.before(btn);
    requestAnimationFrame(() => btn.classList.add('visible'));
    termBody.scrollTop = termBody.scrollHeight;

    btn.addEventListener('click', () => {
      btn.style.pointerEvents = 'none';
      appendLine('ok', '[  OK  ] Launching portfolio interface...');
      setTimeout(() => {
        overlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
        setTimeout(() => { mainContent.style.opacity = '1'; }, 50);
        setTimeout(initPortfolio, 400);
      }, 700);
    });
  }

  async function runBootSequence() {
    let cumulativeDelay = 300;

    for (let i = 0; i < bootScript.length; i++) {
      const item = bootScript[i];
      await new Promise(resolve => setTimeout(resolve, cumulativeDelay));
      cumulativeDelay = item.delay || 150;

      if (item.type === 'progress') {
        appendLine('info', `[DIAG] ${item.label}...`);
        await new Promise(r => setTimeout(r, 100));
        await runProgressBar(item.label, item.duration || 600);
      } else if (item.type === 'launch') {
        createLaunchBtn();
      } else {
        appendLine(item.type, item.text);
      }
    }
  }

  runBootSequence();


  // ================================================
  // ASCII ORB HERO CANVAS (ported from 21st.dev)
  // ================================================
  function initOrbCanvas() {
    const canvas = document.getElementById('orb-canvas');
    const grainCanvas = document.getElementById('grain-canvas');
    if (!canvas || !grainCanvas) return;

    const ctx = canvas.getContext('2d');
    const grainCtx = grainCanvas.getContext('2d');

    const density = ' .:-=+*#%@';
    let frameId = null;
    let time = 0;

    const params = {
      rotation: 0,
      atmosphereShift: 0,
      glitchIntensity: 0
    };

    // GSAP animations (GSAP is already loaded via CDN)
    if (window.gsap) {
      gsap.to(params, { rotation: Math.PI * 2, duration: 20, repeat: -1, ease: 'none' });
      gsap.to(params, { atmosphereShift: 1, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(params, {
        glitchIntensity: 1, duration: 0.1, repeat: -1, yoyo: true,
        ease: 'power2.inOut', repeatDelay: 2 + Math.random() * 2
      });
    }

    // Film grain
    function generateFilmGrain(w, h, intensity) {
      const imageData = grainCtx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * intensity * 255;
        const v = Math.max(0, Math.min(255, 128 + grain));
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = Math.abs(grain) * 3;
      }
      return imageData;
    }

    // Draw glitched orb
    function drawGlitchedOrb(cx, cy, radius, hue, glitchIntensity) {
      ctx.save();
      const shouldGlitch = Math.random() < 0.1 && glitchIntensity > 0.5;
      const glitchOffset = shouldGlitch ? (Math.random() - 0.5) * 20 * glitchIntensity : 0;
      const glitchScale  = shouldGlitch ? 1 + (Math.random() - 0.5) * 0.3 * glitchIntensity : 1;

      if (shouldGlitch) {
        ctx.translate(glitchOffset, glitchOffset * 0.8);
        ctx.scale(glitchScale, 1 / glitchScale);
      }

      // Main orb gradient — tuned to green/cyan
      const orbGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.5);
      orbGradient.addColorStop(0,   `hsla(${hue + 10}, 100%, 92%, 0.9)`);
      orbGradient.addColorStop(0.2, `hsla(${hue + 20}, 90%, 75%, 0.7)`);
      orbGradient.addColorStop(0.5, `hsla(${hue}, 70%, 45%, 0.4)`);
      orbGradient.addColorStop(1,   'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orbGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bright centre
      const cr = radius * 0.3;
      ctx.fillStyle = `hsla(${hue + 20}, 100%, 92%, 0.8)`;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();

      if (shouldGlitch) {
        ctx.globalCompositeOperation = 'screen';
        // Green channel shift
        ctx.fillStyle = `hsla(140, 100%, 50%, ${0.6 * glitchIntensity})`;
        ctx.beginPath(); ctx.arc(cx + glitchOffset * 0.5, cy, cr, 0, Math.PI * 2); ctx.fill();
        // Cyan channel shift
        ctx.fillStyle = `hsla(185, 100%, 50%, ${0.5 * glitchIntensity})`;
        ctx.beginPath(); ctx.arc(cx - glitchOffset * 0.5, cy, cr, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        // Noise lines
        ctx.strokeStyle = `rgba(0, 255, 136, ${0.5 * glitchIntensity})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const y = cy - radius + Math.random() * radius * 2;
          ctx.beginPath();
          ctx.moveTo(cx - radius + Math.random() * 20, y);
          ctx.lineTo(cx + radius - Math.random() * 20, y);
          ctx.stroke();
        }
        // Corruption blocks
        ctx.fillStyle = `rgba(0, 255, 136, ${0.35 * glitchIntensity})`;
        for (let i = 0; i < 3; i++) {
          const bx = cx - radius + Math.random() * radius * 2;
          const by = cy - radius + Math.random() * radius * 2;
          ctx.fillRect(bx, by, Math.random() * 10 + 2, Math.random() * 10 + 2);
        }
      }

      // Outer ring
      ctx.strokeStyle = `hsla(${hue + 20}, 80%, 65%, 0.6)`;
      ctx.lineWidth = 2;
      if (shouldGlitch) {
        for (let i = 0; i < 8; i++) {
          const rr = radius * 1.2 + (Math.random() - 0.5) * 10 * glitchIntensity;
          ctx.beginPath();
          ctx.arc(cx, cy, rr, (i / 8) * Math.PI * 2, ((i + 1) / 8) * Math.PI * 2);
          ctx.stroke();
        }
      } else {
        ctx.beginPath(); ctx.arc(cx, cy, radius * 1.2, 0, Math.PI * 2); ctx.stroke();
      }

      // Glitch bars
      if (shouldGlitch && Math.random() < 0.3) {
        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = `rgba(255,255,255,${0.8 * glitchIntensity})`;
        for (let i = 0; i < 3; i++) {
          const by = cy - radius + Math.random() * radius * 2;
          ctx.fillRect(cx - radius, by, radius * 2, Math.random() * 5 + 1);
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.restore();
    }

    function render() {
      time += 0.016;
      const W = canvas.width  = grainCanvas.width  = window.innerWidth;
      const H = canvas.height = grainCanvas.height = window.innerHeight;

      ctx.fillStyle = '#030810';
      ctx.fillRect(0, 0, W, H);

      const cx = W > 900 ? W * 0.7 : W / 2, cy = H / 2;
      const radius = Math.min(W, H) * (W > 900 ? 0.28 : 0.22);

      // Atmosphere — shifted to green/cyan range (140–200)
      const hue = 150 + params.atmosphereShift * 40;

      const bg = ctx.createRadialGradient(cx, cy - 50, 0, cx, cy, Math.max(W, H) * 0.8);
      bg.addColorStop(0,   `hsla(${hue + 40}, 80%, 55%, 0.35)`);
      bg.addColorStop(0.3, `hsla(${hue}, 60%, 35%, 0.25)`);
      bg.addColorStop(0.6, `hsla(${hue - 20}, 40%, 18%, 0.15)`);
      bg.addColorStop(1,   'rgba(3,8,16,0.6)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawGlitchedOrb(cx, cy, radius, hue, params.glitchIntensity);

      // ASCII sphere
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const spacing = 9;
      const cols = Math.floor(W / spacing);
      const rows = Math.floor(H / spacing);

      for (let i = 0; i < cols && i < 150; i++) {
        for (let j = 0; j < rows && j < 100; j++) {
          const x = (i - cols / 2) * spacing + cx;
          const y = (j - rows / 2) * spacing + cy;
          const dx = x - cx, dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius && Math.random() > 0.4) {
            const z = Math.sqrt(Math.max(0, radius * radius - dx * dx - dy * dy));
            const angle = params.rotation;
            const rotZ = dx * Math.sin(angle) + z * Math.cos(angle);
            const brightness = (rotZ + radius) / (radius * 2);

            if (rotZ > -radius * 0.3) {
              const charIndex = Math.floor(brightness * (density.length - 1));
              let char = density[charIndex];

              // ASCII glitch characters
              if (dist < radius * 0.8 && params.glitchIntensity > 0.8 && Math.random() < 0.3) {
                const gc = ['█','▓','▒','░','▄','▀','■','□'];
                char = gc[Math.floor(Math.random() * gc.length)];
              }

              const alpha = Math.max(0.2, brightness);
              // Tint to green for outer chars, white for bright centre
              if (brightness > 0.6) {
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
              } else {
                ctx.fillStyle = `rgba(0,255,136,${alpha * 0.8})`;
              }
              ctx.fillText(char, x, y);
            }
          }
        }
      }

      // Film grain
      grainCtx.clearRect(0, 0, W, H);
      const grainIntensity = 0.2 + Math.sin(time * 10) * 0.025;
      grainCtx.putImageData(generateFilmGrain(W, H, grainIntensity), 0, 0);

      // Extra sparkle during glitch
      if (params.glitchIntensity > 0.5) {
        grainCtx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 150; i++) {
          grainCtx.fillStyle = `rgba(0,255,136,${Math.random() * 0.4 * params.glitchIntensity})`;
          grainCtx.beginPath();
          grainCtx.arc(Math.random() * W, Math.random() * H, Math.random() * 2.5 + 0.5, 0, Math.PI * 2);
          grainCtx.fill();
        }
      }
      grainCtx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 80; i++) {
        grainCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.25})`;
        grainCtx.beginPath();
        grainCtx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
        grainCtx.fill();
      }

      frameId = requestAnimationFrame(render);
    }

    render();

    // Clean up when terminal overlay hides (boot complete)
    return () => { if (frameId) cancelAnimationFrame(frameId); };
  }







  // ================================================
  // TYPING EFFECT
  // ================================================
  function initTypingEffect() {
    const el = document.getElementById('type-effect');
    if (!el) return;
    let generation = 0;

    function start() {
      const gen = ++generation;
      let pi = 0, ci = 0, deleting = false;
      el.textContent = '';

      function getPhrases() {
        return (window.I18N && window.I18N.t('typing.phrases')) ||
          ['Computer Engineering', 'Cybersecurity Enthusiast', 'Linux Power User', 'Open Source Contributor'];
      }

      function tick() {
        if (generation !== gen) return;
        const phrases = getPhrases();
        const phrase = phrases[pi % phrases.length];
        if (!deleting) {
          el.textContent = phrase.slice(0, ++ci);
          if (ci === phrase.length) { deleting = true; setTimeout(tick, 2000); return; }
          setTimeout(tick, 75 + Math.random() * 40);
        } else {
          el.textContent = phrase.slice(0, --ci);
          if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
          setTimeout(tick, 40);
        }
      }
      tick();
    }

    start();
    document.addEventListener('i18n:change', start);
  }


  // ================================================
  // PORTFOLIO INIT
  // ================================================
  function initPortfolio() {
    initOrbCanvas();
    initTypingEffect();


    // Scroll animations
    const scrollEls = document.querySelectorAll('.scroll-animate');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    scrollEls.forEach(el => obs.observe(el));

    // Navbar
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateNavbar() {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      let current = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // Smooth scroll
    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        document.getElementById('nav-links').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
      });
    });

    // Hamburger
    document.getElementById('hamburger').addEventListener('click', () => {
      document.getElementById('hamburger').classList.toggle('open');
      document.getElementById('nav-links').classList.toggle('open');
    });

    // Hero section links
    document.querySelectorAll('.hero-section a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      });
    });

    loadGitHubRepos();
    initContactForm();
  }

  // ================================================
  // CONTACT FORM
  // ================================================
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('cft-submit-btn');
      const success = document.getElementById('cft-success');
      const origHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>⏳ Sending...</span>';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.style.display = 'none';
          success.style.display = 'block';
          form.reset();
        } else {
          throw new Error('Failed');
        }
      } catch {
        // Fallback: open mailto
        const name = form.querySelector('#cf-name').value;
        const email = form.querySelector('#cf-email').value;
        const msg = form.querySelector('#cf-message').value;
        const subject = `Portfolio Contact from ${name}`;
        const body = `From: ${name} (${email})\n\n${msg}`;
        window.open(`mailto:alexdl0418@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      } finally {
        btn.disabled = false;
        btn.innerHTML = origHTML;
      }
    });
  }


  // ================================================
  // GITHUB REPOS
  // ================================================
  const GITHUB_USERNAME = 'Aledev746';
  const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&direction=desc`;

  const LANG_ICONS = { 'Python': 'python', 'JavaScript': 'javascript', 'TypeScript': 'typescript', 'HTML': 'html5', 'CSS': 'css3', 'Java': 'java', 'Swift': 'swift', 'C': 'c', 'C++': 'cplusplus', 'C#': 'csharp', 'Go': 'go', 'Rust': 'rust', 'Ruby': 'ruby', 'PHP': 'php', 'Kotlin': 'kotlin', 'Dart': 'dart', 'Shell': 'bash' };

  function getLanguageIcon(lang) {
    if (!lang) return '';
    const slug = LANG_ICONS[lang];
    return slug ? `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg" alt="${lang}" class="project-lang-icon">` : '';
  }

  function timeAgo(d) {
    const i = window.I18N;
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return i ? i.t('time.now') : 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}${i ? i.t('time.min') : 'm ago'}`;
    if (s < 86400) return `${Math.floor(s / 3600)}${i ? i.t('time.hour') : 'h ago'}`;
    if (s < 2592000) return `${Math.floor(s / 86400)}${i ? i.t('time.day') : 'd ago'}`;
    if (s < 31536000) return `${Math.floor(s / 2592000)}${i ? i.t('time.month') : ' months ago'}`;
    return `${Math.floor(s / 31536000)}${i ? i.t('time.year') : ' years ago'}`;
  }

  function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card scroll-animate';
    card.style.transitionDelay = `${Math.min(index * 0.08, 0.6)}s`;

    const desc = repo.description || (window.I18N ? window.I18N.t('projects.nodesc') : 'No description available.');
    const lang = repo.language || '';
    const icon = getLanguageIcon(lang);
    const topics = repo.topics || [];
    let tags = lang ? `<span class="tag">${lang}</span>` : '';
    topics.forEach(t => { tags += `<span class="tag">${t}</span>`; });

    card.innerHTML = `
      <div class="project-header">
        <div class="project-icon-wrapper">
          ${icon || `<svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`}
        </div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener" aria-label="GitHub">
            <svg viewBox="0 0 24 24" class="project-link-icon"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.57.1.78-.25.78-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.79 1.06.79 2.14v3.17c0 .3.21.66.79.55A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
          </a>
        </div>
      </div>
      <h3 class="project-name">${repo.name}</h3>
      <p class="project-desc">${desc}</p>
      <div class="project-meta">
        ${repo.stargazers_count > 0 ? `<span class="project-meta-item">★ ${repo.stargazers_count}</span>` : ''}
        ${repo.forks_count > 0 ? `<span class="project-meta-item">⑂ ${repo.forks_count}</span>` : ''}
        <span class="project-meta-item">↺ ${timeAgo(repo.updated_at)}</span>
      </div>
      <div class="project-tags">${tags}</div>`;

    return card;
  }

  let _cachedRepos = null;

  function renderRepos(repos) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const i = window.I18N;
    grid.innerHTML = '';
    if (!repos.length) {
      grid.innerHTML = `<div class="projects-empty"><p>${i ? i.t('projects.empty') : 'No public repositories found.'}</p></div>`;
      return;
    }
    repos.forEach((r, idx) => grid.appendChild(createProjectCard(r, idx)));
    const obs2 = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs2.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    grid.querySelectorAll('.scroll-animate').forEach(el => obs2.observe(el));
  }

  async function loadGitHubRepos() {
    const grid = document.getElementById('projects-grid');
    const loading = document.getElementById('projects-loading');
    const i = window.I18N;
    try {
      const res = await fetch(GITHUB_API_URL, { headers: { 'Accept': 'application/vnd.github.mercy-preview+json' } });
      if (!res.ok) throw new Error(res.status);
      const repos = await res.json();
      const own = repos.filter(r => !r.fork);
      if (loading) loading.remove();
      _cachedRepos = own;
      renderRepos(own);
    } catch (err) {
      console.error(err);
      if (loading) loading.remove();
      const errMsg = i ? i.t('projects.error') : 'Unable to load repositories from GitHub.';
      const retryTxt = i ? i.t('projects.retry') : 'Retry';
      grid.innerHTML = `<div class="projects-error"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="error-icon"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>${errMsg}</p><button class="btn btn-secondary retry-btn" onclick="location.reload()">${retryTxt}</button></div>`;
    }
  }

  document.addEventListener('i18n:change', () => {
    if (_cachedRepos) renderRepos(_cachedRepos);
  });

})();