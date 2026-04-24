/* ================================================
   HACKER TERMINAL — INTERACTIVE EASTER EGG
   Vanilla ES6+ — Zero Dependencies
   ================================================ */
(function () {
  'use strict';

  // ================================================
  // HIDDEN CONSOLE MESSAGE
  // ================================================
  console.log("%c[SYSTEM] Hidden terminal detected. Type 'hack' or press Ctrl + ` to engage.", "color: #00ff88; font-weight: bold; background: #000; padding: 5px;");

  // ================================================
  // DOM REFERENCES (initialized dynamically)
  // ================================================
  let overlay, body, output, inputLine, inputDisplay, inputReal, cursorEl, closeBtn;

  // Terminal structure template
  const TERMINAL_HTML = `
    <div id="hacker-terminal" class="hacker-terminal" aria-label="Interactive hacker terminal" role="dialog" aria-modal="true">
      <div class="ht-scanlines" aria-hidden="true"></div>
      <div class="ht-window">
        <div class="ht-titlebar">
          <div class="ht-dots">
            <span class="ht-dot ht-dot--red"></span>
            <span class="ht-dot ht-dot--yellow"></span>
            <span class="ht-dot ht-dot--green"></span>
          </div>
          <span class="ht-titlebar-text">guest@aledev:~$ — hacker-shell — 80×24</span>
          <button class="ht-close-btn" id="ht-close-btn" aria-label="Close terminal">✕</button>
        </div>
        <div class="ht-body" id="ht-body">
          <div id="ht-output"></div>
          <div class="ht-input-line" id="ht-input-line">
            <span class="ht-prompt">guest@aledev:~$&nbsp;</span>
            <span class="ht-input-display" id="ht-input-display"></span>
            <span class="ht-cursor" id="ht-cursor">█</span>
            <input type="text" id="ht-input-real" class="ht-input-real" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Terminal command" />
          </div>
        </div>
      </div>
    </div>
  `;

  // ================================================
  // STATE
  // ================================================
  let isOpen = false;
  let isInjected = false;
  let isTyping = false;   // true while typewriter is running
  let cmdHistory = [];
  let historyIndex = -1;
  let hackBuffer = '';      // keyboard sequence buffer
  let hackTimer = null;
  let tapCount = 0;
  let tapTimer = null;

  // ================================================
  // DYNAMIC INJECTION
  // ================================================
  function ensureTerminalInjected() {
    if (isInjected) return true;

    // Inject HTML
    const container = document.createElement('div');
    container.innerHTML = TERMINAL_HTML;
    document.body.appendChild(container.firstElementChild);

    // Initialize References
    overlay = document.getElementById('hacker-terminal');
    body = document.getElementById('ht-body');
    output = document.getElementById('ht-output');
    inputLine = document.getElementById('ht-input-line');
    inputDisplay = document.getElementById('ht-input-display');
    inputReal = document.getElementById('ht-input-real');
    cursorEl = document.getElementById('ht-cursor');
    closeBtn = document.getElementById('ht-close-btn');

    if (!overlay || !inputReal) return false;

    // Bind Event Listeners for the new elements
    closeBtn.addEventListener('click', closeTerminal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeTerminal();
      else if (isOpen) inputReal.focus();
    });
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        inputReal.focus();
      }
    });

    inputReal.addEventListener('input', () => {
      inputDisplay.textContent = inputReal.value;
    });

    inputReal.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = inputReal.value.trim();
        inputReal.value = '';
        inputDisplay.textContent = '';
        if (cmd) {
          cmdHistory.push(cmd);
          historyIndex = cmdHistory.length;
          executeCommand(cmd);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length > 0) {
          if (historyIndex > 0) historyIndex--;
          inputReal.value = cmdHistory[historyIndex] || '';
          inputDisplay.textContent = inputReal.value;
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < cmdHistory.length - 1) {
          historyIndex++;
          inputReal.value = cmdHistory[historyIndex] || '';
        } else {
          historyIndex = cmdHistory.length;
          inputReal.value = '';
        }
        inputDisplay.textContent = inputReal.value;
      }
    });

    isInjected = true;
    return true;
  }

  // ================================================
  // TRIGGER: Desktop
  // ================================================
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
      e.preventDefault();
      toggleTerminal();
      return;
    }
    if (e.key === 'Escape' && isOpen) {
      closeTerminal();
      return;
    }
    if (!isOpen) {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;
      hackBuffer += e.key.toLowerCase();
      clearTimeout(hackTimer);
      hackTimer = setTimeout(() => { hackBuffer = ''; }, 1500);
      if (hackBuffer.includes('hack')) {
        hackBuffer = '';
        clearTimeout(hackTimer);
        openTerminal();
      }
    }
  });

  // TRIGGER: Mobile
  document.addEventListener('touchend', () => {
    if (isOpen) return;
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { tapCount = 0; }, 800);
    if (tapCount >= 5) {
      tapCount = 0;
      clearTimeout(tapTimer);
      openTerminal();
    }
  }, { passive: true });

  // TRIGGER: Navbar Link
  const navTerminalBtn = document.getElementById('nav-terminal');
  if (navTerminalBtn) {
    navTerminalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openTerminal();
    });
  }

  // ================================================
  // OPEN / CLOSE LOGIC
  // ================================================
  function toggleTerminal() {
    isOpen ? closeTerminal() : openTerminal();
  }

  function openTerminal() {
    if (isOpen) return;
    if (!ensureTerminalInjected()) return;

    isOpen = true;
    document.body.classList.add('ht-locked');
    overlay.classList.remove('ht-closing');
    overlay.classList.add('ht-active');
    inputReal.focus();

    if (cmdHistory.length === 0 && output.children.length === 0) {
      showWelcome();
    }
  }

  function closeTerminal() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.add('ht-closing');
    setTimeout(() => {
      overlay.classList.remove('ht-active', 'ht-closing');
      document.body.classList.remove('ht-locked');
    }, 420);
  }

  // ================================================
  // HELPER FUNCTIONS
  // ================================================
  function addLine(text, className = '') {
    if (!output) return;
    const div = document.createElement('div');
    div.className = 'ht-line' + (className ? ' ' + className : '');
    div.textContent = text;
    output.appendChild(div);
    scrollToBottom();
    return div;
  }

  function addLineHTML(html, className = '') {
    if (!output) return;
    const div = document.createElement('div');
    div.className = 'ht-line' + (className ? ' ' + className : '');
    div.innerHTML = html;
    output.appendChild(div);
    scrollToBottom();
    return div;
  }

  function scrollToBottom() {
    if (body) body.scrollTop = body.scrollHeight;
  }

  function typewrite(text, className = '') {
    return new Promise((resolve) => {
      if (!output) return resolve();
      isTyping = true;
      const div = document.createElement('div');
      div.className = 'ht-line' + (className ? ' ' + className : '');
      div.style.opacity = '1';
      div.style.transform = 'none';
      output.appendChild(div);

      let i = 0;
      function tick() {
        if (i < text.length) {
          div.textContent += text[i];
          i++;
          scrollToBottom();
          const delay = 15 + Math.random() * 25;
          setTimeout(tick, delay);
        } else {
          isTyping = false;
          resolve();
        }
      }
      tick();
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ================================================
  // COMMANDS
  // ================================================
  const COMMANDS = {
    help: {
      description: 'Shows the list of available commands',
      action: async () => {
        addLine('');
        addLine('╔══════════════════════════════════════════╗', 'ht-line--separator');
        addLine('║          AVAILABLE COMMANDS              ║', 'ht-line--header');
        addLine('╚══════════════════════════════════════════╝', 'ht-line--separator');
        addLine('');
        const cmds = Object.entries(COMMANDS);
        for (const [name, cmd] of cmds) {
          const padded = name.padEnd(14);
          await typewrite(`  ${padded} → ${cmd.description}`, 'ht-line--ok');
          await sleep(30);
        }
        addLine('');
        addLine('  Tip: use ↑/↓ to navigate command history.', 'ht-line--dim');
        addLine('');
      }
    },
    whoami: {
      description: 'Information about the current user',
      action: async () => {
        addLine('');
        await typewrite('  ┌─────────────────────────────────────┐', 'ht-line--separator');
        await typewrite('  │          USER PROFILE                │', 'ht-line--header');
        await typewrite('  └─────────────────────────────────────┘', 'ht-line--separator');
        addLine('');
        await typewrite('  Name:       Alessandro De Luca', 'ht-line--ok');
        await sleep(30);
        await typewrite('  Role:       Computer Engineering — 2nd Year', 'ht-line--ok');
        await sleep(30);
        await typewrite('  University: University of Palermo', 'ht-line--ok');
        await sleep(30);
        await typewrite('  Location:   Palermo, Italy 🇮🇹', 'ht-line--ok');
        await sleep(30);
        await typewrite('  Focus:      Software Development & Cybersecurity', 'ht-line--info');
        await sleep(30);
        await typewrite('  Status:     ■ Available for projects', 'ht-line--ok');
        addLine('');
        await typewrite('  GitHub:     github.com/Aledev746', 'ht-line--dim');
        addLine('');
      }
    },
    skills: {
      description: 'Shows technical skills',
      action: async () => {
        addLine('');
        addLine('  ═══════════════════════════════════════', 'ht-line--separator');
        addLine('  TECH STACK & SKILLS', 'ht-line--header');
        addLine('  ═══════════════════════════════════════', 'ht-line--separator');
        addLine('');
        const skillsList = [
          { name: 'Python', level: 85 },
          { name: 'Java', level: 75 },
          { name: 'HTML/CSS', level: 90 },
          { name: 'JavaScript', level: 70 },
          { name: 'Swift', level: 60 },
          { name: 'SQL/MySQL', level: 70 },
          { name: 'Linux', level: 80 },
          { name: 'Git', level: 75 },
          { name: 'Cybersec', level: 65 },
        ];
        for (const skill of skillsList) {
          const filled = Math.round(skill.level / 5);
          const empty = 20 - filled;
          const bar = '█'.repeat(filled) + '░'.repeat(empty);
          const nameStr = skill.name.padEnd(14);
          const pct = `${skill.level}%`.padStart(4);
          addLineHTML(
            `  <span class="ht-skill-name">${nameStr}</span>` +
            `<span class="ht-skill-bar">${bar}</span> ` +
            `<span class="ht-skill-level">${pct}</span>`,
            'ht-line--ok'
          );
          await sleep(60);
        }
        addLine('');
        addLine('  Always evolving — never stop learning.', 'ht-line--dim');
        addLine('');
      }
    },
    projects: {
      description: 'Lists main projects',
      action: async () => {
        addLine('');
        addLine('  ═══════════════════════════════════════', 'ht-line--separator');
        addLine('  PROJECTS — /dev/projects/', 'ht-line--header');
        addLine('  ═══════════════════════════════════════', 'ht-line--separator');
        addLine('');
        await typewrite('  Loading repositories from GitHub...', 'ht-line--dim');
        await sleep(300);
        try {
          const res = await fetch('https://api.github.com/users/Aledev746/repos?per_page=10&sort=updated', {
            headers: { 'Accept': 'application/vnd.github.mercy-preview+json' }
          });
          if (!res.ok) throw new Error(res.status);
          const repos = await res.json();
          const own = repos.filter(r => !r.fork).slice(0, 6);
          addLine('');
          for (const repo of own) {
            const lang = repo.language ? `[${repo.language}]` : '';
            await typewrite(`  ▸ ${repo.name} ${lang}`, 'ht-line--ok');
            if (repo.description) addLine(`    ${repo.description}`, 'ht-line--dim');
            await sleep(40);
          }
        } catch {
          addLine('  ✗ Error loading repositories.', 'ht-line--err');
        }
        addLine('');
      }
    },
    contact: {
      description: 'Shows contact information',
      action: async () => {
        addLine('');
        await typewrite('  ┌─────────────────────────────────────┐', 'ht-line--separator');
        await typewrite('  │           CONTACTS                   │', 'ht-line--header');
        await typewrite('  └─────────────────────────────────────┘', 'ht-line--separator');
        addLine('');
        await typewrite('  📧  Email:      alexdl0418@gmail.com', 'ht-line--ok');
        await sleep(30);
        await typewrite('  🐙  GitHub:     github.com/Aledev746', 'ht-line--ok');
        await sleep(30);
        await typewrite('  💼  LinkedIn:   linkedin.com/in/alessandro-de-luca-6978ab39b/', 'ht-line--ok');
        await sleep(30);
        await typewrite('  📸  Instagram:  __aledeluca_', 'ht-line--ok');
        addLine('');
        await typewrite('  "The best way to predict the future is to invent it."', 'ht-line--accent');
        addLine('', 'ht-line--dim');
      }
    },
    date: {
      description: 'Shows current date and time',
      action: async () => {
        const now = new Date();
        const formatted = now.toLocaleString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        await typewrite(`  ${formatted}`, 'ht-line--info');
        addLine('');
      }
    },
    neofetch: {
      description: 'Shows system info in neofetch style',
      action: async () => {
        addLine('');
        const ascii = [
          '       ___       __         ____            ',
          '      /   | ____/ /__ _   _/ __ \\_____  ___ ',
          '     / /| |/ __  / _ \\ | / / / / / __ \\/ _ \\',
          '    / ___ / /_/ /  __/ |/ / /_/ / /_/ /  __/',
          '   /_/  |_\\__,_/\\___/|___/\\____/ .___/\\___/ ',
          '                              /_/            ',
        ];
        for (const line of ascii) {
          addLine('  ' + line, 'ht-line--info');
          await sleep(40);
        }
        addLine('');
        const info = [
          ['OS', 'AleDevOS v2.6.1'],
          ['Host', 'Portfolio Web Platform'],
          ['Kernel', '6.1.0-cybersec-custom'],
          ['Shell', 'hacker-shell 1.0.0'],
          ['Terminal', 'aledev-term (80×24)'],
          ['CPU', 'Brain™ i∞ @ ∞GHz'],
          ['GPU', 'WebGL 2.0 (Canvas Fallback)'],
          ['Memory', '∞ / ∞ MB (coffee-powered)'],
          ['Uptime', formatUptime()],
        ];
        for (const [key, val] of info) {
          const k = key.padEnd(12);
          await typewrite(`  ${k}${val}`, 'ht-line--ok');
          await sleep(35);
        }
        addLine('');
        let colorLine = '  ';
        const colors = ['#ff5f57', '#febc2e', '#28c840', '#00ff88', '#00d4ff', '#bf5fff', '#ff4444', '#e8f4f8'];
        colors.forEach(c => { colorLine += `<span style="background:${c};color:${c}">███</span>`; });
        addLineHTML(colorLine);
        addLine('');
      }
    },
    matrix: {
      description: 'Matrix effect for 3 seconds',
      action: () => {
        return new Promise((resolve) => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';
          let lineCount = 0;
          const maxLines = 20;
          const interval = setInterval(() => {
            let line = '  ';
            const cols = Math.min(60, Math.floor((window.innerWidth - 60) / 9));
            for (let c = 0; c < cols; c++) line += chars[Math.floor(Math.random() * chars.length)];
            addLine(line, 'ht-line--ok');
            if (++lineCount >= maxLines) {
              clearInterval(interval);
              addLine('');
              addLine('  Wake up, Neo...', 'ht-line--accent');
              addLine('');
              resolve();
            }
          }, 150);
        });
      }
    },
    clear: { description: 'Clear terminal screen', action: () => { output.innerHTML = ''; } },
    exit: {
      description: 'Close interactive terminal',
      action: () => {
        addLine('');
        addLine('  Session terminated. Goodbye, operator.', 'ht-line--ok');
        setTimeout(closeTerminal, 600);
      }
    },
    history: {
      description: 'Shows command history',
      action: async () => {
        if (cmdHistory.length === 0) return addLine('  No commands in history.', 'ht-line--dim');
        addLine('');
        addLine('  COMMAND HISTORY', 'ht-line--header');
        addLine('  ───────────────', 'ht-line--separator');
        for (let i = 0; i < cmdHistory.length; i++) {
          const idx = String(i + 1).padStart(3);
          await typewrite(`  ${idx}  ${cmdHistory[i]}`, 'ht-line--dim');
          await sleep(20);
        }
        addLine('');
      }
    },
    sudo: {
      description: '??? 🤫',
      action: async () => {
        addLine('');
        await typewrite('  [sudo] password for guest: ', 'ht-line--warn');
        await sleep(800);
        await typewrite('  ✗ Nice try, but you don\'t have permission. 😏', 'ht-line--err');
        await sleep(200);
        addLine('  This incident will be reported.', 'ht-line--dim');
        addLine('');
      }
    },
    hack: {
      description: '??? 🤫',
      action: async () => {
        // ── Disable further input while hack plays ──
        inputReal.disabled = true;
        inputLine.style.display = 'none';

        addLine('');
        await typewrite('  [WARN] Initializing exploit framework...', 'ht-line--warn');
        await sleep(600);
        await typewrite('  [CRITICAL] Root access granted.', 'ht-line--err');
        await sleep(400);
        await typewrite('  [SYSTEM] Launching payload...', 'ht-line--err');
        await sleep(300);

        // ── Close the terminal, then launch fullscreen hack overlay ──
        closeTerminal();
        await sleep(500);

        launchHackSequence();
      }
    },
    echo: { description: 'Repeat a message', action: async (args) => { addLine(`  ${args || ''}`, 'ht-line--ok'); } }
  };

  function executeCommand(input) {
    addLine(`guest@aledev:~$ ${input}`, 'ht-line--cmd');
    if (isTyping) return;
    const parts = input.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    if (COMMANDS[cmd]) {
      const result = COMMANDS[cmd].action(args);
      if (result instanceof Promise) {
        isTyping = true;
        result.then(() => {
          isTyping = false;
          inputReal.focus();
        });
      }
    } else {
      addLine(`  bash: ${cmd}: command not found`, 'ht-line--err');
      addLine('  Type "help" for a list of commands.', 'ht-line--dim');
      addLine('');
    }
  }

  async function showWelcome() {
    const banner = [
      '╔══════════════════════════════════════════════════╗',
      '║                                                  ║',
      '║     █░█ ▄▀█ █▀▀ █▄▀ █▀▀ █▀█   █▀ █░█ █▀▀ █░░ █░░ ║',
      '║     █▀█ █▀█ █▄▄ █░█ ██▄ █▀▄   ▄█ █▀█ ██▄ █▄▄ █▄▄ ║',
      '║                                                  ║',
      '║        [  aledev interactive terminal  ]         ║',
      '║                                                  ║',
      '╚══════════════════════════════════════════════════╝',
    ];
    for (const line of banner) { addLine(line, 'ht-line--info'); await sleep(35); }
    await sleep(150);
    await typewrite('  Access granted. Session initialized.', 'ht-line--ok');
    await sleep(100);
    await typewrite('  Type "help" for a list of available commands.', 'ht-line--dim');
    addLine('');
  }

  function formatUptime() {
    const diff = Math.floor((Date.now() - (window.startTime || Date.now())) / 1000);
    const h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
    return h > 0 ? `${h}h ${m}m ${s}s` : (m > 0 ? `${m}m ${s}s` : `${s}s`);
  }
  window.startTime = Date.now();

  function showMobileHint() {
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) return;
    const hint = document.createElement('div');
    hint.className = 'ht-mobile-hint';
    hint.textContent = '5× tap to access the secret terminal';
    document.body.appendChild(hint);
    setTimeout(() => hint.classList.add('ht-hint-show'), 5000);
    setTimeout(() => {
      hint.classList.remove('ht-hint-show');
      setTimeout(() => hint.remove(), 600);
    }, 10000);
  }
  setTimeout(showMobileHint, 8000);

  // ================================================
  // HACK SEQUENCE — FULLSCREEN EASTER EGG
  // ── Customizable: edit HACK_LOGS messages and
  //    HACK_DURATION (ms) to change the experience ──
  // ================================================
  const HACK_DURATION = 6500; // Total animation time in ms before reload

  // Progressive fake system logs — each has a delay (ms) from the start
  const HACK_LOGS = [
    { t: 0,    text: '[SYS] Exploit framework loaded — v6.6.6',                     cls: 'hack-log--warn' },
    { t: 400,  text: '[NET] Bypassing firewall rules...',                            cls: 'hack-log--warn' },
    { t: 900,  text: '[NET] Firewall bypassed ✓',                                   cls: 'hack-log--ok' },
    { t: 1300, text: '[SSH] Establishing reverse shell on port 4444...',             cls: 'hack-log--warn' },
    { t: 1800, text: '[SSH] Connection established ✓',                               cls: 'hack-log--ok' },
    { t: 2200, text: '[SYS] Accessing mainframe /core/system...',                    cls: 'hack-log--err' },
    { t: 2700, text: '[DB]  Dumping credentials — shadow.db',                        cls: 'hack-log--err' },
    { t: 3100, text: '[DB]  ████████████████████ 100%',                              cls: 'hack-log--ok' },
    { t: 3500, text: '[SYS] Injecting payload into kernel...',                       cls: 'hack-log--err' },
    { t: 3900, text: '[CRITICAL] Kernel panic — not syncing: corrupted memory',      cls: 'hack-log--critical' },
    { t: 4300, text: '[CRITICAL] SYSTEM OVERLOAD — TEMPERATURE CRITICAL',            cls: 'hack-log--critical' },
    { t: 4700, text: '[SYS] Emergency shutdown initiated...',                        cls: 'hack-log--critical' },
    { t: 5200, text: '[REBOOT] Rebooting system in 3...',                            cls: 'hack-log--reboot' },
    { t: 5600, text: '[REBOOT] 2...',                                                cls: 'hack-log--reboot' },
    { t: 5900, text: '[REBOOT] 1...',                                                cls: 'hack-log--reboot' },
  ];

  function launchHackSequence() {
    // ── 1. Create fullscreen overlay ──
    const hackOverlay = document.createElement('div');
    hackOverlay.id = 'hack-overlay';
    hackOverlay.setAttribute('aria-label', 'Hack animation in progress');

    // ── 2. Matrix rain canvas ──
    const canvas = document.createElement('canvas');
    canvas.id = 'hack-matrix-canvas';
    hackOverlay.appendChild(canvas);

    // ── 3. Glitch scanline layer ──
    const glitchLayer = document.createElement('div');
    glitchLayer.className = 'hack-glitch-layer';
    hackOverlay.appendChild(glitchLayer);

    // ── 4. Logs container ──
    const logsContainer = document.createElement('div');
    logsContainer.className = 'hack-logs';
    hackOverlay.appendChild(logsContainer);

    // ── 5. Center skull/warning ASCII ──
    const asciiArt = document.createElement('div');
    asciiArt.className = 'hack-ascii';
    asciiArt.textContent = '☠ SYSTEM COMPROMISED ☠';
    hackOverlay.appendChild(asciiArt);

    // ── Inject into DOM ──
    document.body.appendChild(hackOverlay);
    document.body.classList.add('hack-active');

    // Force reflow then activate
    requestAnimationFrame(() => {
      hackOverlay.classList.add('hack-visible');
    });

    // ── Matrix rain logic ──
    const ctx = canvas.getContext('2d');
    let W, H, columns, drops;
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF$@#%&';

    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const fontSize = 14;
      columns = Math.floor(W / fontSize);
      drops = new Array(columns).fill(1).map(() => Math.random() * -50);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let matrixRunning = true;
    function drawMatrix() {
      if (!matrixRunning) return;
      const fontSize = 14;
      // Semi-transparent black to create trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, W, H);

      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < columns; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head character is brighter
        if (Math.random() < 0.1) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#00ff88';
        } else {
          const brightness = Math.random();
          if (brightness > 0.7) {
            ctx.fillStyle = '#00ff88';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00ff88';
          } else {
            ctx.fillStyle = `rgba(0, 255, 136, ${0.3 + brightness * 0.5})`;
            ctx.shadowBlur = 0;
          }
        }

        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        if (y > H && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    // ── Progressive log messages ──
    HACK_LOGS.forEach(log => {
      setTimeout(() => {
        const logLine = document.createElement('div');
        logLine.className = `hack-log-line ${log.cls}`;
        logLine.textContent = log.text;
        logsContainer.appendChild(logLine);
        // Auto-scroll to bottom
        logsContainer.scrollTop = logsContainer.scrollHeight;
      }, log.t);
    });

    // ── Glitch intensifier: add shake as time progresses ──
    setTimeout(() => {
      hackOverlay.classList.add('hack-shake-light');
    }, 2000);

    setTimeout(() => {
      hackOverlay.classList.remove('hack-shake-light');
      hackOverlay.classList.add('hack-shake-heavy');
    }, 4000);

    // ── Reboot: white flash + page reload ──
    setTimeout(() => {
      matrixRunning = false;
      hackOverlay.classList.add('hack-reboot-flash');

      setTimeout(() => {
        window.location.reload();
      }, 600);
    }, HACK_DURATION);
  }

})();
