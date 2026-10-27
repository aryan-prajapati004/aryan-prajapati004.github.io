(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const hero = document.querySelector('.hero');
  const typewriter = document.querySelector('.typewriter');
  const typewriterText = document.querySelector('.typewriter-text');
  const previewToggle = document.querySelector('[data-preview-toggle]');
  const resumePreview = document.querySelector('#resume-preview');
  const previewFrame = resumePreview?.querySelector('iframe');
  const previewExit = document.querySelector('[data-preview-exit]');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phrases = [
    'Moving models from notebook to cloud',
    'Chasing optimization',
    'Building reliable systems'
  ];
  const storageKey = 'aryan-portfolio-theme';
  const sections = [...document.querySelectorAll('main > section[id]')];
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  let phraseIndex = 0;
  let timer;

  const setTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (persist) {
      try { localStorage.setItem(storageKey, theme); } catch (error) { /* storage may be unavailable */ }
    }
  };

  if (themeToggle) {
    if (root.dataset.theme === 'dark') {
      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
    themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  }

  if (previewToggle && resumePreview) {
    const closePreview = () => {
      resumePreview.close();
      previewToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      previewToggle.focus();
    };

    previewToggle.addEventListener('click', () => {
      if (previewFrame && !previewFrame.getAttribute('src')) {
        previewFrame.setAttribute('src', resumePreview.dataset.src);
      }
      resumePreview.showModal();
      previewToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });

    previewExit?.addEventListener('click', closePreview);

    resumePreview.addEventListener('close', () => {
      previewToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });

    resumePreview.addEventListener('click', (e) => {
      if (e.target === resumePreview) closePreview();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && resumePreview.open) {
        closePreview();
      }
    });
  }

  const updateActiveSection = (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  };

  const sectionObserver = new IntersectionObserver(updateActiveSection, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));

  const startTypewriter = () => {
    window.clearTimeout(timer);
    if (!typewriter || !typewriterText) return;
    typewriter.classList.toggle('crossfade', motionQuery.matches);
    phraseIndex = 0;
    typewriterText.textContent = '';

    if (motionQuery.matches) {
      const showPhrase = () => {
        typewriterText.textContent = phrases[phraseIndex];
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timer = window.setTimeout(showPhrase, 2800);
      };
      showPhrase();
      return;
    }

    let characterIndex = 0;
    let deleting = false;
    const tick = () => {
      const phrase = phrases[phraseIndex];
      characterIndex += deleting ? -1 : 1;
      typewriterText.textContent = phrase.slice(0, characterIndex);
      if (!deleting && characterIndex === phrase.length) {
        deleting = true;
        timer = window.setTimeout(tick, 1400);
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timer = window.setTimeout(tick, 260);
      } else {
        timer = window.setTimeout(tick, deleting ? 28 : 45);
      }
    };
    timer = window.setTimeout(tick, 260);
  };

  if (hero) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startTypewriter();
        } else {
          window.clearTimeout(timer);
        }
      });
    });
    heroObserver.observe(hero);
  } else {
    startTypewriter();
  }

  if (motionQuery.addEventListener) motionQuery.addEventListener('change', startTypewriter);

  const footer = document.querySelector('footer');
  if (footer) {
    footer.textContent = `© ${new Date().getFullYear()} Aryan Prajapati. Built and maintained with care.`;
  }
})();
