/* ================================================
   i18n — Internazionalizzazione / Internationalization
   Default: EN | Supports: EN, IT
   ================================================ */
(function () {
  'use strict';

  const STORAGE_KEY = 'aledev_lang';
  const SUPPORTED   = ['en', 'it'];
  const DEFAULT     = 'en';

  // ================================================
  // TRANSLATION DICTIONARY
  // ================================================
  const T = {
    en: {
      /* --- Navigation --- */
      'nav.home':     'Home',
      'nav.about':    'About',
      'nav.skills':   'Skills',
      'nav.projects': 'Projects',
      'nav.contact':  'Contact',

      /* --- Hero --- */
      'hero.desc':          'Passionate about software development, cybersecurity and interactive design. I build digital experiences with clean code and creativity.',
      'hero.btn.projects':  'View Projects',
      'hero.btn.contact':   'Contact Me',
      'hero.btn.cv':        'Download CV',
      'hero.stat.year':     'Year',
      'hero.stat.langs':    'Languages',
      'hero.stat.projects': 'Projects',

      /* --- About --- */
      'about.title':        'About Me',
      'about.p1':           "I'm in my second year of <strong>Computer Engineering</strong> at the University of Palermo. I'm interested in software development, cybersecurity, and interactive design.",
      'about.p2':           "I love exploring the boundary between technology and design, creating experiences that blend functionality and visual impact. When I'm not writing code, I study software architectures and experiment with new frameworks.",
      'about.details':      '// Details',
      'about.uni.label':    'University',
      'about.deg.label':    'Degree',
      'about.city.label':   'City',
      'about.focus.label':  'Focus',
      'about.deg.value':    'Computer Engineering',
      'about.city.value':   'Palermo, Italy',

      /* --- Projects --- */
      'projects.title':   'Projects',
      'projects.loading': '// Loading repositories from GitHub...',
      'projects.empty':   'No public repositories found.',
      'projects.error':   'Unable to load repositories from GitHub.',
      'projects.retry':   'Retry',
      'projects.nodesc':  'No description available.',

      /* --- Contact --- */
      'contact.title':   'Contact',
      'contact.text':    "Have an interesting project or just want to chat? Don't hesitate to reach out!",
      'contact.connect': 'Connect',
      'contact.follow':  'Follow me',

      /* --- Form --- */
      'form.name':       'NAME',
      'form.name.ph':    'your name',
      'form.email':      'EMAIL',
      'form.message':    'MESSAGE',
      'form.message.ph': 'Write your message...',
      'form.send':       'SEND MESSAGE',
      'form.success':    'Message sent successfully!',

      /* --- Footer --- */
      'footer.rights': '© 2026 — All rights reserved',

      /* --- Typing phrases (array) --- */
      'typing.phrases': ['Computer Engineering', 'Cybersecurity Enthusiast', 'Full-Stack Developer', 'Linux Power User', 'Open Source Contributor'],

      /* --- Time ago suffixes --- */
      'time.now':   'just now',
      'time.min':   'm ago',
      'time.hour':  'h ago',
      'time.day':   'd ago',
      'time.month': ' months ago',
      'time.year':  ' years ago',
    },

    it: {
      /* --- Navigation --- */
      'nav.home':     'Home',
      'nav.about':    'Chi Sono',
      'nav.skills':   'Skills',
      'nav.projects': 'Progetti',
      'nav.contact':  'Contatti',

      /* --- Hero --- */
      'hero.desc':          'Appassionato di sviluppo software, cybersecurity e design interattivo. Costruisco esperienze digitali con codice pulito e creatività.',
      'hero.btn.projects':  'Vedi Progetti',
      'hero.btn.contact':   'Contattami',
      'hero.btn.cv':        'Scarica CV',
      'hero.stat.year':     'Anno',
      'hero.stat.langs':    'Linguaggi',
      'hero.stat.projects': 'Progetti',

      /* --- About --- */
      'about.title':       'Chi Sono',
      'about.p1':          "Sono al secondo anno di <strong>Ingegneria Informatica</strong> presso l'Università degli Studi di Palermo. Mi interesso di sviluppo software, cybersecurity e progettazione interattiva.",
      'about.p2':          "Amo esplorare il confine tra tecnologia e design, creando esperienze che uniscano funzionalità e impatto visivo. Quando non scrivo codice, studio architetture software e sperimento nuovi framework.",
      'about.details':     '// Dettagli',
      'about.uni.label':   'Università',
      'about.deg.label':   'Corso',
      'about.city.label':  'Città',
      'about.focus.label': 'Focus',
      'about.deg.value':   'Ingegneria Informatica',
      'about.city.value':  'Palermo, Italia',

      /* --- Projects --- */
      'projects.title':   'Progetti',
      'projects.loading': '// Caricamento repository da GitHub...',
      'projects.empty':   'Nessuna repository pubblica trovata.',
      'projects.error':   'Impossibile caricare le repository da GitHub.',
      'projects.retry':   'Riprova',
      'projects.nodesc':  'Nessuna descrizione disponibile.',

      /* --- Contact --- */
      'contact.title':   'Contatti',
      'contact.text':    'Hai un progetto interessante o vuoi semplicemente fare una chiacchierata? Non esitare a contattarmi!',
      'contact.connect': 'Connettiti',
      'contact.follow':  'Seguimi',

      /* --- Form --- */
      'form.name':       'NOME',
      'form.name.ph':    'il tuo nome',
      'form.email':      'EMAIL',
      'form.message':    'MESSAGGIO',
      'form.message.ph': 'Scrivi il tuo messaggio...',
      'form.send':       'INVIA MESSAGGIO',
      'form.success':    'Messaggio inviato con successo!',

      /* --- Footer --- */
      'footer.rights': '© 2026 — Tutti i diritti riservati',

      /* --- Typing phrases (array) --- */
      'typing.phrases': ['Ingegneria Informatica', 'Cybersecurity Enthusiast', 'Full-Stack Developer', 'Linux Power User', 'Open Source Contributor'],

      /* --- Time ago suffixes --- */
      'time.now':   'adesso',
      'time.min':   'm fa',
      'time.hour':  'h fa',
      'time.day':   'g fa',
      'time.month': ' mesi fa',
      'time.year':  ' anni fa',
    }
  };

  // ================================================
  // STATE
  // ================================================
  let currentLang = DEFAULT;

  // ================================================
  // CORE
  // ================================================
  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const browser = (navigator.language || '').toLowerCase().slice(0, 2);
    return SUPPORTED.includes(browser) ? browser : DEFAULT;
  }

  function t(key) {
    const dict = T[currentLang] || T[DEFAULT];
    return dict[key] !== undefined ? dict[key] : (T[DEFAULT][key] !== undefined ? T[DEFAULT][key] : key);
  }

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = t(el.dataset.i18n);
      if (typeof val === 'string') el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const val = t(el.dataset.i18nHtml);
      if (typeof val === 'string') el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const val = t(el.dataset.i18nPlaceholder);
      if (typeof val === 'string') el.placeholder = val;
    });

    updateToggleUI();
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }));
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  function getLang() { return currentLang; }

  // ================================================
  // TOGGLE BUTTON (injected into navbar)
  // ================================================
  function createToggle() {
    const btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.className = 'lang-toggle';
    btn.setAttribute('aria-label', 'Toggle language / Cambia lingua');
    btn.innerHTML =
      '<span class="lang-toggle__icon" id="lang-icon">🇬🇧</span>' +
      '<span class="lang-toggle__code" id="lang-code">EN</span>';
    btn.addEventListener('click', () => setLang(currentLang === 'en' ? 'it' : 'en'));
    return btn;
  }

  function updateToggleUI() {
    const icon = document.getElementById('lang-icon');
    const code = document.getElementById('lang-code');
    if (!icon || !code) return;
    icon.textContent = currentLang === 'it' ? '🇮🇹' : '🇬🇧';
    code.textContent = currentLang === 'it' ? 'IT' : 'EN';
  }

  // ================================================
  // INIT
  // ================================================
  function init() {
    const hamburger = document.getElementById('hamburger');
    const navContainer = document.querySelector('.nav-container');
    if (navContainer && hamburger) {
      navContainer.insertBefore(createToggle(), hamburger);
    }
    applyLang(detectLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ================================================
  // PUBLIC API
  // ================================================
  window.I18N = { t, setLang, getLang };
})();
