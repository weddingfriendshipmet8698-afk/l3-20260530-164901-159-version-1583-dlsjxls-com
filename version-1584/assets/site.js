(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const navPanel = document.querySelector('[data-nav-panel]');

  if (menuButton && navPanel) {
    menuButton.addEventListener('click', function () {
      navPanel.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let activeIndex = 0;

    function showSlide(index) {
      activeIndex = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide((activeIndex + 1) % slides.length);
      }, 5200);
    }
  }

  const panels = Array.from(document.querySelectorAll('[data-filter-panel]'));
  panels.forEach(function (panel) {
    const list = document.querySelector('[data-card-list]');
    const input = panel.querySelector('[data-local-search]');
    const chips = Array.from(panel.querySelectorAll('[data-filter-year]'));

    if (!list) {
      return;
    }

    const cards = Array.from(list.querySelectorAll('[data-card]'));
    let year = 'all';

    function applyFilters() {
      const query = input ? input.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        const haystack = [
          card.dataset.title || '',
          card.dataset.region || '',
          card.dataset.genre || '',
          card.dataset.year || ''
        ].join(' ').toLowerCase();
        const yearMatch = year === 'all' || card.dataset.year === year;
        const queryMatch = !query || haystack.indexOf(query) !== -1;
        card.style.display = yearMatch && queryMatch ? '' : 'none';
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        year = chip.dataset.filterYear;
        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });
        applyFilters();
      });
    });

    if (input) {
      input.addEventListener('input', applyFilters);
    }
  });

  const searchInput = document.getElementById('search-input');
  const searchForm = document.getElementById('search-page-form');
  const searchResults = document.getElementById('search-results');
  const searchTitle = document.getElementById('search-title');

  if (searchInput && searchResults && Array.isArray(window.SITE_MOVIES)) {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;

    function movieCard(movie) {
      const tags = movie.tags.slice(0, 4).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');

      return [
        '<article class="movie-card" data-card>',
        '  <a class="poster-link" href="' + escapeHtml(movie.file) + '">',
        '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '    <span class="poster-shade"></span>',
        '    <span class="play-chip">立即观看</span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <h2><a href="' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a></h2>',
        '    <p class="meta-line">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + ' · ' + escapeHtml(String(movie.year)) + '</p>',
        '    <p class="movie-one-line">' + escapeHtml(movie.oneLine) + '</p>',
        '    <div class="tag-row">' + tags + '</div>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"]/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        }[char];
      });
    }

    function runSearch(query) {
      const text = query.trim().toLowerCase();
      if (!text) {
        searchTitle.textContent = '热门影片';
        searchResults.innerHTML = window.SITE_MOVIES.slice(0, 24).map(movieCard).join('');
        return;
      }

      const words = text.split(/\s+/).filter(Boolean);
      const matched = window.SITE_MOVIES.filter(function (movie) {
        const haystack = [
          movie.title,
          movie.region,
          movie.type,
          String(movie.year),
          movie.genre,
          movie.tags.join(' '),
          movie.oneLine
        ].join(' ').toLowerCase();
        return words.every(function (word) {
          return haystack.indexOf(word) !== -1;
        });
      }).slice(0, 120);

      searchTitle.textContent = matched.length ? '检索结果' : '暂无匹配影片';
      searchResults.innerHTML = matched.map(movieCard).join('');
    }

    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const query = searchInput.value.trim();
        const url = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
        history.replaceState(null, '', url);
        runSearch(query);
      });
    }

    searchInput.addEventListener('input', function () {
      runSearch(searchInput.value);
    });

    runSearch(initialQuery);
  }
})();
