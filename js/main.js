(function () {
  var header = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');
  var primaryNav = document.getElementById('primary-nav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var langButtons = Array.prototype.slice.call(document.querySelectorAll('.lang-btn'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  var TITLES = {
    en: 'Florian J. Müller – Senior Scientist, TU Wien',
    de: 'Florian J. Müller – Senior Scientist, TU Wien'
  };

  // ---- Language switching ----
  function setLang(lang) {
    if (lang !== 'en' && lang !== 'de') { lang = 'en'; }
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    try { localStorage.setItem('site-lang', lang); } catch (e) {}
    document.title = TITLES[lang];
    langButtons.forEach(function (btn) {
      var active = btn.getAttribute('data-set-lang') === lang;
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-set-lang'));
    });
  });

  // Sync UI state with the language already applied by the inline head script.
  setLang(document.documentElement.getAttribute('data-lang') || 'en');

  // ---- Sticky header shadow on scroll ----
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu toggle ----
  navToggle.addEventListener('click', function () {
    var isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Scrollspy: highlight nav link for the section in view ----
  if ('IntersectionObserver' in window && sections.length) {
    var activateLink = function (id) {
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activateLink(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
