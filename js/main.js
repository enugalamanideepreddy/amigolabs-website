document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const updateNavigation = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 160) current = section.id;
    });
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${current}`;
      link.style.color = active ? 'var(--text-1)' : '';
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', updateNavigation, { passive: true });
  updateNavigation();

  // Content remains visible when JavaScript or animation support is unavailable.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-up').forEach(element => observer.observe(element));
  }

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;
  const setMenuOpen = (open, restoreFocus = false) => {
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    if (restoreFocus) hamburger.focus();
  };
  hamburger.addEventListener('click', () => setMenuOpen(!mobileMenu.classList.contains('open')));
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('open')) setMenuOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) setMenuOpen(false);
  });
  nav.addEventListener('focusout', event => {
    if (!nav.contains(event.relatedTarget)) setMenuOpen(false);
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) setMenuOpen(false);
  });
});
