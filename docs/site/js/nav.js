/**
 * BLACK BOX SCRIPTER DOCS — Navigation Loader
 * Loads shared header, sidebar, and footer into each page.
 */
(function () {
  'use strict';

  // Detect if we're in /reference/ subdirectory
  const inSubdir = location.pathname.includes('/reference/');
  const BASE = inSubdir ? '../' : './';

  async function loadFragment(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const resp = await fetch(BASE + file);
      if (!resp.ok) return;
      el.innerHTML = await resp.text();
      // Fix relative links in loaded fragments when in subdirectory
      if (inSubdir) {
        el.querySelectorAll('a[href]').forEach(a => {
          const href = a.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/')) {
            a.setAttribute('href', BASE + href);
          }
        });
        el.querySelectorAll('img[src]').forEach(img => {
          const src = img.getAttribute('src');
          if (src && !src.startsWith('http') && !src.startsWith('/')) {
            img.setAttribute('src', BASE + src);
          }
        });
      }
    } catch (e) {
      // Silent fail — nav will just be missing
    }
  }

  function highlightActive() {
    const sidebar = document.getElementById('sidebar-nav');
    if (!sidebar) return;
    const path = location.pathname;
    const links = sidebar.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && path.endsWith(href.replace(/^\.\//, '').replace(/^\.\.\//, ''))) {
        link.classList.add('active');
      }
    });
  }

  function setupMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // Client-side search filter for reference tables
  function setupSearch() {
    const input = document.getElementById('fn-search');
    if (!input) return;

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      document.querySelectorAll('.fn-row').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
      // Show/hide category headers
      document.querySelectorAll('.category-section').forEach(section => {
        const visibleRows = section.querySelectorAll('.fn-row[style=""], .fn-row:not([style])');
        const hasVisible = Array.from(section.querySelectorAll('.fn-row')).some(r => r.style.display !== 'none');
        section.style.display = hasVisible ? '' : 'none';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
      loadFragment('site-header', 'includes/header.html'),
      loadFragment('sidebar-nav', 'includes/sidebar.html'),
      loadFragment('site-footer', 'includes/footer.html')
    ]);
    highlightActive();
    setupMobileNav();
    setupSearch();
  });
})();
